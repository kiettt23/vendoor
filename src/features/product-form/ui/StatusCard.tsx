"use client";

import type { UseFormSetValue, UseFormWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Switch } from "@/shared/ui/switch";

interface StatusCardProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValue: UseFormSetValue<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  watch: UseFormWatch<any>;
}

export function StatusCard({ setValue, watch }: StatusCardProps) {
  const isActive = watch("isActive");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trạng Thái</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Hiển thị sản phẩm</p>
            <p className="text-sm text-muted-foreground">
              Sản phẩm sẽ xuất hiện trên cửa hàng
            </p>
          </div>
          <Switch
            checked={isActive}
            onCheckedChange={(v) => setValue("isActive", v)}
          />
        </div>
      </CardContent>
    </Card>
  );
}
