import Link from "next/link";
import { ExternalLink } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { formatPrice, formatDateTime } from "@/shared/lib";
import { ROUTES, ORDER_STATUS_BADGE, getBadgeConfig } from "@/shared/lib/constants";
import type { EarningsTransaction } from "../api";

interface TransactionListProps {
  transactions: EarningsTransaction[];
  total: number;
}

export function TransactionList({ transactions, total }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch sử giao dịch</CardTitle>
        <CardDescription>
          {total} đơn hàng có doanh thu
        </CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Chưa có giao dịch nào
          </p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Đơn hàng</TableHead>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="text-right">Doanh thu</TableHead>
                  <TableHead className="text-right">Phí NTảng</TableHead>
                  <TableHead className="text-right">Thực nhận</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead>Ngày</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((tx) => {
                  const config = getBadgeConfig(tx.status, ORDER_STATUS_BADGE);

                  return (
                    <TableRow key={tx.id}>
                      <TableCell>
                        <Link
                          href={`${ROUTES.VENDOR_ORDERS}/${tx.id}`}
                          className="font-medium hover:underline flex items-center gap-1"
                        >
                          {tx.orderNumber}
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {tx.customerName}
                      </TableCell>
                      <TableCell className="text-right">
                        {formatPrice(tx.subtotal)}
                      </TableCell>
                      <TableCell className="text-right text-red-600">
                        -{formatPrice(tx.platformFee)}
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatPrice(tx.vendorEarnings)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={config.variant}>{config.label}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDateTime(tx.createdAt)}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
