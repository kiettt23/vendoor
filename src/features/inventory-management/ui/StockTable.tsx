"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Check, X, Pencil, Package } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { OptimizedImage } from "@/shared/ui/optimized-image";
import { formatPrice } from "@/shared/lib/utils";

import type { InventoryItem } from "../model/types";
import { updateStock } from "../api/actions";
import { StockStatusBadge } from "./StockStatusBadge";

interface StockTableProps {
  items: InventoryItem[];
  vendorId: string;
}

export function StockTable({ items, vendorId }: StockTableProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.variantId);
    setEditValue(item.stock.toString());
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  const handleSave = (variantId: string) => {
    const stock = parseInt(editValue, 10);
    if (isNaN(stock) || stock < 0) {
      toast.error("Số lượng không hợp lệ");
      return;
    }

    startTransition(async () => {
      const result = await updateStock(vendorId, { variantId, stock });
      if (result.success) {
        toast.success("Cập nhật tồn kho thành công");
        setEditingId(null);
        setEditValue("");
      } else {
        toast.error(result.error);
      }
    });
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Package className="mb-4 size-12 text-muted-foreground" />
        <p className="text-lg font-medium">Không có sản phẩm nào</p>
        <p className="text-sm text-muted-foreground">
          Tạo sản phẩm để bắt đầu quản lý tồn kho
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-16">Ảnh</TableHead>
            <TableHead>Sản phẩm</TableHead>
            <TableHead className="w-32">SKU</TableHead>
            <TableHead className="w-28 text-right">Giá</TableHead>
            <TableHead className="w-32 text-center">Tồn kho</TableHead>
            <TableHead className="w-28">Trạng thái</TableHead>
            <TableHead className="w-20" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.variantId}>
              {/* Image */}
              <TableCell>
                {item.image ? (
                  <OptimizedImage
                    src={item.image}
                    alt={item.productName}
                    width={40}
                    height={40}
                    className="size-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex size-10 items-center justify-center rounded bg-muted">
                    <Package className="size-5 text-muted-foreground" />
                  </div>
                )}
              </TableCell>

              {/* Product name */}
              <TableCell>
                <Link
                  href={`/vendor/products/${item.productId}/edit`}
                  className="font-medium hover:underline"
                >
                  {item.productName}
                </Link>
                {item.variantName && (
                  <span className="text-sm text-muted-foreground">
                    {" "}
                    - {item.variantName}
                  </span>
                )}
              </TableCell>

              {/* SKU */}
              <TableCell className="font-mono text-sm text-muted-foreground">
                {item.sku || "-"}
              </TableCell>

              {/* Price */}
              <TableCell className="text-right">
                {formatPrice(item.price)}
              </TableCell>

              {/* Stock - editable */}
              <TableCell className="text-center">
                {editingId === item.variantId ? (
                  <div className="flex items-center justify-center gap-1">
                    <Input
                      type="number"
                      min={0}
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      className="h-8 w-20 text-center"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSave(item.variantId);
                        if (e.key === "Escape") handleCancel();
                      }}
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={() => handleSave(item.variantId)}
                      disabled={isPending}
                    >
                      <Check className="size-4 text-green-600" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="size-8"
                      onClick={handleCancel}
                      disabled={isPending}
                    >
                      <X className="size-4 text-red-600" />
                    </Button>
                  </div>
                ) : (
                  <span className="font-medium">{item.stock}</span>
                )}
              </TableCell>

              {/* Status badge */}
              <TableCell>
                <StockStatusBadge stock={item.stock} />
              </TableCell>

              {/* Actions */}
              <TableCell>
                {editingId !== item.variantId && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="size-8"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="size-4" />
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
