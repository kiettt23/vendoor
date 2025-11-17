"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/shared/components/ui/alert-dialog";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";

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

interface CategoriesTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (categoryId: string) => void;
}

export function CategoriesTable({
  categories,
  onEdit,
  onDelete,
}: CategoriesTableProps) {
  if (categories.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg border border-dashed">
        <div className="text-center">
          <p className="text-muted-foreground">Chưa có danh mục nào</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Ảnh</TableHead>
            <TableHead>Tên danh mục</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead className="text-center">Sản phẩm</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>
                {category.image ? (
                  <div className="relative h-10 w-10 overflow-hidden rounded">
                    <Image
                      src={category.image}
                      alt={category.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
                    <span className="text-xs text-muted-foreground">N/A</span>
                  </div>
                )}
              </TableCell>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="font-mono text-sm text-muted-foreground">
                {category.slug}
              </TableCell>
              <TableCell>
                <p className="max-w-xs truncate text-sm text-muted-foreground">
                  {category.description || "-"}
                </p>
              </TableCell>
              <TableCell className="text-center">
                {category._count.products}
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {format(new Date(category.createdAt), "dd/MM/yyyy", {
                  locale: vi,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(category)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Xóa danh mục?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Bạn có chắc muốn xóa danh mục &ldquo;{category.name}
                          &rdquo;?
                          {category._count.products > 0 && (
                            <span className="block mt-2 text-destructive">
                              Danh mục này có {category._count.products} sản
                              phẩm. Việc xóa danh mục sẽ không xóa sản phẩm
                              nhưng các sản phẩm sẽ không còn danh mục.
                            </span>
                          )}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Hủy</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(category.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Xóa
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
