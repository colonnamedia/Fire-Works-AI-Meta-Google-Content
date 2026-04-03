import React from "react";
import CopyButton from "./CopyButton";

export default function SectionCard({ title, icon: Icon, children, copyText }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 md:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          <h3 className="font-semibold text-sm text-foreground">{title}</h3>
        </div>
        {copyText && <CopyButton text={copyText} />}
      </div>
      {children}
    </div>
  );
}