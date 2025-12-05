"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { ShoppingBag, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("CartErrorBoundary");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary cho Cart
 * Catch errors trong cart operations và show user-friendly message
 */
export class CartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Cart error caught", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // TODO: Send to error tracking service (Sentry)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleClearCart = () => {
    // Clear cart from localStorage and retry
    if (typeof window !== "undefined") {
      localStorage.removeItem("cart-storage");
    }
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="pt-6 text-center space-y-4">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <ShoppingBag className="size-8 text-destructive" />
              </div>
            </div>

            <h2 className="text-lg font-semibold">Lỗi giỏ hàng</h2>

            <p className="text-muted-foreground text-sm">
              Không thể tải giỏ hàng. Có thể do dữ liệu bị lỗi. Bạn có thể thử
              lại hoặc xóa giỏ hàng để bắt đầu lại.
            </p>

            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="text-left p-3 bg-muted rounded-md text-xs">
                <summary className="cursor-pointer font-medium">
                  Chi tiết lỗi (dev)
                </summary>
                <pre className="mt-2 whitespace-pre-wrap text-destructive">
                  {this.state.error.message}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center pt-2">
              <Button onClick={this.handleRetry} size="sm">
                <RefreshCw className="size-4 mr-2" />
                Thử lại
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={this.handleClearCart}
              >
                Xóa giỏ hàng
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/">
                  <Home className="size-4 mr-2" />
                  Trang chủ
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      );
    }

    return this.props.children;
  }
}
