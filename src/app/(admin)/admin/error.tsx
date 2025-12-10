"use client";

import { useEffect } from "react";
import { AdminErrorPage } from "@/shared/ui/feedback";
import { createLogger } from "@/shared/lib/utils/logger";

const logger = createLogger("AdminError");

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    logger.error("Admin panel error caught by error boundary", error);
  }, [error]);

  return (
    <div className="p-6">
      <AdminErrorPage error={error} reset={reset} />
    </div>
  );
}

