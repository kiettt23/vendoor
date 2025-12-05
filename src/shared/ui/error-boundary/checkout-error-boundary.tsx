"use client";

import { Component, type ReactNode } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCw, ShoppingCart } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Card, CardContent } from "@/shared/ui/card";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("CheckoutErrorBoundary");

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary cho Checkout flow
 * Catch errors trong checkout process và show user-friendly message
 */
export class CheckoutErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    logger.error("Checkout error caught", {
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
              <div className="rounded-full bg-warning/10 p-4">
                <AlertTriangle className="size-8 text-warning" />
              </div>
            </div>

            <h2 className="text-lg font-semibold">
              Không thể hoàn tất thanh toán
            </h2>

            <p className="text-muted-foreground text-sm">
              Đã xảy ra lỗi trong quá trình thanh toán. Vui lòng thử lại hoặc
              quay lại giỏ hàng.
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
                <Link href="/cart">
                  <ShoppingCart className="size-4 mr-2" />
                  Về giỏ hàng
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
