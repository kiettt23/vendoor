"use client";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import { vi } from "@/lib/i18n";

const ViewMore = ({ title, description, visibleButton = true, href = "" }) => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
      <Link
        href={href}
        className="flex items-center gap-5 text-sm text-slate-600 mt-2"
      >
        <p className="max-w-lg text-center">{description}</p>
        {visibleButton && (
          <button className="text-purple-500 flex items-center gap-1">
            {vi.common.viewAll} <ArrowRight size={14} />
          </button>
        )}
      </Link>
    </div>
  );
};

export default ViewMore;
