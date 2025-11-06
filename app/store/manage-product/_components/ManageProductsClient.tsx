"use client";
import { useState } from "react";
import { toast } from "sonner";
import Image from "next/image";
import {
  Trash2Icon,
  EditIcon,
  EyeIcon,
  EyeOffIcon,
  PlusIcon,
} from "lucide-react";
import {
  toggleProductStock,
  deleteProduct,
} from "@/lib/actions/seller/product.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const currency = "đ";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  category: string;
  images: string[];
  inStock: boolean;
}

interface ManageProductsClientProps {
  products: Product[];
}

export default function ManageProductsClient({
  products: initialProducts,
}: ManageProductsClientProps) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleToggleStock = async (productId: string) => {
    try {
      const result = await toggleProductStock(productId);

      // Update local state
      setProducts((prev) =>
        prev.map((p) =>
          p.id === productId ? { ...p, inStock: result.inStock! } : p
        )
      );

      toast.success(result.message);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Có lỗi xảy ra");
    }
  };

  const handleEdit = (productId: string) => {
    router.push(`/store/manage-product/edit/${productId}`);
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa sản phẩm "${productName}"?`)) {
      return;
    }

    setDeletingId(productId);

    try {
      await deleteProduct(productId);

      // Remove from local state
      setProducts((prev) => prev.filter((p) => p.id !== productId));

      toast.success("Đã xóa sản phẩm thành công!");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Không thể xóa sản phẩm"
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent className="pt-6">
          <div className="flex flex-col items-center gap-4">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center">
              <EyeOffIcon size={40} className="text-slate-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-800 mb-2">
                Chưa có sản phẩm nào
              </h2>
              <p className="text-slate-600 mb-4">
                Bắt đầu bán hàng bằng cách thêm sản phẩm đầu tiên
              </p>
            </div>
            <Button onClick={() => router.push("/store/add-product")} size="lg">
              <PlusIcon size={18} className="mr-2" />
              Thêm sản phẩm đầu tiên
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl">Quản lý Sản phẩm</CardTitle>
            <Button onClick={() => router.push("/store/add-product")}>
              <PlusIcon size={18} className="mr-2" />
              Thêm sản phẩm
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sản phẩm</TableHead>
                  <TableHead className="hidden lg:table-cell">Mô tả</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Danh mục
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    Giá gốc
                  </TableHead>
                  <TableHead>Giá bán</TableHead>
                  <TableHead className="text-center">Trạng thái</TableHead>
                  <TableHead className="text-center">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="flex gap-3 items-center">
                        <div className="relative w-12 h-12 flex-shrink-0 rounded-md overflow-hidden">
                          <Image
                            fill
                            className="object-cover"
                            src={product.images[0]}
                            alt={product.name}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium truncate">{product.name}</p>
                          <p className="text-xs text-slate-500 md:hidden">
                            {product.category}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md hidden lg:table-cell">
                      <p
                        className="truncate text-slate-600"
                        title={product.description}
                      >
                        {product.description}
                      </p>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary">{product.category}</Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-slate-500 line-through">
                      {product.mrp.toLocaleString()} {currency}
                    </TableCell>
                    <TableCell className="font-medium text-purple-600">
                      {product.price.toLocaleString()} {currency}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            toast.promise(handleToggleStock(product.id), {
                              loading: "Đang cập nhật...",
                            })
                          }
                          className="gap-2"
                        >
                          {product.inStock ? (
                            <>
                              <EyeIcon size={16} className="text-green-600" />
                              <Badge variant="success">Còn hàng</Badge>
                            </>
                          ) : (
                            <>
                              <EyeOffIcon
                                size={16}
                                className="text-slate-400"
                              />
                              <Badge variant="secondary">Hết hàng</Badge>
                            </>
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2 justify-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(product.id)}
                          title="Chỉnh sửa"
                        >
                          <EditIcon size={18} className="text-blue-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(product.id, product.name)}
                          disabled={deletingId === product.id}
                          title="Xóa"
                        >
                          {deletingId === product.id ? (
                            <div className="w-[18px] h-[18px] border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2Icon size={18} className="text-red-600" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-4 text-sm text-slate-500 text-center md:text-right">
            Tổng số:{" "}
            <span className="font-medium text-slate-700">
              {products.length}
            </span>{" "}
            sản phẩm
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
