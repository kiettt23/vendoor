"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { Package, RefreshCw, Home } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("ProductListErrorBoundary");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary cho Product List/Grid
 * Catch errors khi render product list và show user-friendly message
 */
export class ProductListErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Product list error caught", {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    // TODO: Send to error tracking service (Sentry)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
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
              <div className="rounded-full bg-muted p-4">
                <Package className="size-8 text-muted-foreground" />
              </div>
            </div>

            <h2 className="text-lg font-semibold">
              Không thể tải danh sách sản phẩm
            </h2>

            <p className="text-muted-foreground text-sm">
              Đã xảy ra lỗi khi tải sản phẩm. Vui lòng thử lại sau.
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
              <Button variant="outline" size="sm" asChild>
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
