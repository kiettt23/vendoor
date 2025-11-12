import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";

interface ViewMoreProps {
  href?: string;
  text?: string;
  // Section header props
  title?: string;
  description?: string;
  visibleButton?: boolean;
}

export default function ViewMore({
  href,
  text = "Xem thêm",
  title,
  description,
  visibleButton = true,
}: ViewMoreProps) {
  // If title provided, render as section header
  if (title) {
    return (
      <div className="text-center">
        <h2 className="text-3xl sm:text-4xl font-semibold text-slate-800 mb-3">
          {title}
        </h2>
        {description && (
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            {description}
          </p>
        )}
        {visibleButton && href && (
          <Link
            href={href}
            className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors group"
          >
            {text}
            <ArrowRightIcon
              size={16}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        )}
      </div>
    );
  }

  // Simple link button mode
  if (!href) {
    return null;
  }

  return (
    <Link
      href={href}
      className="inline-flex items-center gap-2 text-sm font-medium text-purple-600 hover:text-purple-700 transition-colors group"
    >
      {text}
      <ArrowRightIcon
        size={16}
        className="group-hover:translate-x-1 transition-transform"
      />
    </Link>
  );
}
