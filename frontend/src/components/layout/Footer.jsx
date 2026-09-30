import React from "react";
import { Leaf } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="mx-auto max-w-6xl px-4 py-10 text-sm text-muted-foreground">
        
        {/* Brand Header */}
        <div className="flex items-center gap-2 font-semibold text-foreground">
          <Leaf className="h-5 w-5 text-primary" /> OnlineMedicalCard
        </div>
        
        {/* Medical Marijuana Disclaimer & Intent Text Block */}
        <p className="mt-3 max-w-md leading-relaxed">
          Telehealth evaluations connecting patients with licensed physicians for medical marijuana card recommendations. Not affiliated with any state government agency.
        </p>
        
        {/* Dynamic Legal Copyright Footer Anchor */}
        <p className="mt-6 text-xs text-muted-foreground/80">
          &copy; {new Date().getFullYear()} OnlineMedicalCard. All rights reserved.
        </p>
        
      </div>
    </footer>
  );
}
