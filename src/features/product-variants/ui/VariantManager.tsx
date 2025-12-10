"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Star, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Badge } from "@/shared/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { showToast, showErrorToast, getStockStatusBadge } from "@/shared/lib/constants";
import { formatPrice } from "@/shared/lib";
import { deleteVariant, setDefaultVariant } from "../api/actions";
import { VariantFormDialog } from "./VariantFormDialog";
import type { VariantItem } from "../model";

interface VariantManagerProps {
  productId: string;
  variants: VariantItem[];
}

export function VariantManager({ productId, variants }: VariantManagerProps) {
  const router = useRouter();
  const [editingVariant, setEditingVariant] = useState<VariantItem | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!deletingId) return;
    setIsDeleting(true);
    const result = await deleteVariant(deletingId);
    if (result.success) {
      showToast("vendor", "productUpdated");
      router.refresh();
    } else {
      showErrorToast("generic", result.error);
    }
    setIsDeleting(false);
    setDeletingId(null);
  };

  const handleSetDefault = async (variantId: string) => {
    setSettingDefaultId(variantId);
    const result = await setDefaultVariant(variantId, productId);
    if (result.success) {
      showToast("vendor", "productUpdated");
      router.refresh();
    } else {
      showErrorToast("generic", result.error);
    }
    setSettingDefaultId(null);
  };

  const formatVariantName = (v: VariantItem) => {
    if (v.name) return v.name;
    const parts = [v.color, v.size].filter(Boolean);
    return parts.length > 0 ? parts.join(" / ") : "Mặc định";
  };

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Biến Thể Sản Phẩm</CardTitle>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Thêm biến thể
          </Button>
        </CardHeader>
        <CardContent>
          {variants.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Chưa có biến thể nào
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tên</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="text-right">Giá</TableHead>
                    <TableHead className="text-right">Tồn kho</TableHead>
                    <TableHead className="text-center">Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {variants.map((variant) => (
                    <TableRow key={variant.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {formatVariantName(variant)}
                          {variant.isDefault && (
                            <Badge variant="secondary" className="text-xs">
                              Mặc định
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {variant.sku || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div>
                          <span className="font-semibold">
                            {formatPrice(variant.price)}
                          </span>
                          {variant.compareAtPrice && (
                            <span className="text-muted-foreground line-through text-sm ml-2">
                              {formatPrice(variant.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={variant.stock > 0 ? "outline" : "destructive"}
                        >
                          {variant.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {(() => {
                          const stockBadge = getStockStatusBadge(variant.stock);
                          return (
                            <Badge variant={stockBadge.variant}>
                              {stockBadge.label}
                            </Badge>
                          );
                        })()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          {!variant.isDefault && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleSetDefault(variant.id)}
                              disabled={settingDefaultId === variant.id}
                              title="Đặt làm mặc định"
                            >
                              {settingDefaultId === variant.id ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                              ) : (
                                <Star className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setEditingVariant(variant)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          {!variant.isDefault && variants.length > 1 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setDeletingId(variant.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <VariantFormDialog
        productId={productId}
        variant={null}
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />

      <VariantFormDialog
        productId={productId}
        variant={editingVariant}
        open={!!editingVariant}
        onOpenChange={(open: boolean) => !open && setEditingVariant(null)}
      />

      <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa biến thể?</AlertDialogTitle>
            <AlertDialogDescription>
              Biến thể sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
