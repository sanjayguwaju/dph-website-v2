"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label }: { label: string }) {
    return (
        <div className="btn-print-box no-print">
            <button onClick={() => window.print()} className="btn-print">
                <Printer size={16} />
                {label}
            </button>
        </div>
    );
}
