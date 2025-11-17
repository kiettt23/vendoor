"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getCategories } from "../actions/get-categories";
import { deleteCategory } from "../actions/delete-category";
import { CategoriesTable } from "./CategoriesTable";
import { CategoryFormDialog } from "./CategoryFormDialog";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Search, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  _count: {
    products: number;
  };
}

export function CategoriesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalCount: 0,
  });

  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [formDialogOpen, setFormDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingCategoryId, setDeletingCategoryId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const page = parseInt(searchParams.get("page") || "1");
    loadCategories(page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const loadCategories = async (page: number) => {
    setIsLoading(true);
    try {
      const result = await getCategories({
        page,
        pageSize: 20,
        search: search || undefined,
      });

      if (result.success && result.data) {
        setCategories(result.data.categories);
        setPagination(result.data.pagination);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra khi tải danh mục");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    params.set("page", "1");
    if (search) params.set("search", search);
    router.push(`/admin/categories?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/categories?${params.toString()}`);
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormDialogOpen(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormDialogOpen(true);
  };

  const handleDelete = (categoryId: string) => {
    setDeletingCategoryId(categoryId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!deletingCategoryId) return;

    try {
      const result = await deleteCategory(deletingCategoryId);
      if (result.success) {
        toast.success(result.message);
        loadCategories(pagination.page);
      } else {
        toast.error(result.error);
      }
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setDeleteDialogOpen(false);
      setDeletingCategoryId(null);
    }
  };

  const handleFormSuccess = () => {
    loadCategories(pagination.page);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Quản lý Danh mục</h1>
          <p className="text-muted-foreground">
            Tạo và quản lý danh mục sản phẩm
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo danh mục
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tìm kiếm</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm theo tên hoặc slug..."
                className="pl-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch}>Tìm kiếm</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Danh sách danh mục ({pagination.totalCount})</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[200px] items-center justify-center">
              <p className="text-muted-foreground">Đang tải...</p>
            </div>
          ) : (
            <>
              <CategoriesTable
                categories={categories}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />

              {pagination.totalPages > 1 && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    Trang {pagination.page} / {pagination.totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Trước
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.totalPages}
                    >
                      Sau
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <CategoryFormDialog
        open={formDialogOpen}
        onOpenChange={setFormDialogOpen}
        category={editingCategory}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa danh mục này? Hành động này không thể
              hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
