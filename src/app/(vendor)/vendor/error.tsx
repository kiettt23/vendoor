"use client";

import { useEffect } from "react";
import { VendorErrorPage } from "@/shared/ui/feedback";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("VendorError");

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Vendor dashboard error caught by error boundary", error);
  }, [error]);

  return <VendorErrorPage error={error} reset={reset} />;
}
