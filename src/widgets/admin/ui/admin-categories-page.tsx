"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, FolderOpen } from "lucide-react";
import { Card, CardContent } from "@/shared/ui/card";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  slug: string;
  _count: { products: number };
}

interface AdminCategoriesPageProps {
  categories: Category[];
  onCreate: (name: string) => Promise<{ success: boolean; error?: string }>;
  onUpdate: (
    id: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  onDelete: (id: string) => Promise<{ success: boolean; error?: string }>;
}

export function AdminCategoriesPage({
  categories,
  onCreate,
  onUpdate,
  onDelete,
}: AdminCategoriesPageProps) {
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const result = await onCreate(newName);
    if (result.success) {
      toast.success("Đã tạo danh mục");
      setNewName("");
      setIsCreateOpen(false);
    } else {
      toast.error(result.error || "Lỗi");
    }
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const result = await onUpdate(id, editName);
    if (result.success) {
      toast.success("Đã cập nhật");
      setEditingId(null);
    } else {
      toast.error(result.error || "Lỗi");
    }
  };

  const handleDelete = async (id: string, productCount: number) => {
    if (productCount > 0) {
      toast.error("Không thể xóa danh mục có sản phẩm");
      return;
    }
    if (!confirm("Xác nhận xóa?")) return;
    const result = await onDelete(id);
    if (result.success) {
      toast.success("Đã xóa");
    } else {
      toast.error(result.error || "Lỗi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Danh Mục</h1>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Thêm Danh Mục Mới</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Tên danh mục</Label>
                <Input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Điện thoại"
                />
              </div>
              <Button onClick={handleCreate} className="w-full">
                Tạo
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <FolderOpen className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">Chưa có danh mục</h3>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((cat) => (
            <Card key={cat.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  {editingId === cat.id ? (
                    <div className="flex-1 flex gap-2">
                      <Input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                      />
                      <Button size="sm" onClick={() => handleUpdate(cat.id)}>
                        Lưu
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Hủy
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <p className="font-semibold">{cat.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {cat._count.products} sản phẩm
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingId(cat.id);
                            setEditName(cat.name);
                          }}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            handleDelete(cat.id, cat._count.products)
                          }
                          disabled={cat._count.products > 0}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
