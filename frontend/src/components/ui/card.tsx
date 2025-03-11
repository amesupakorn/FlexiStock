import React from "react";

export function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-6 rounded-lg shadow-lg bg-white border border-gray-300 hover:shadow-xl transition-shadow duration-300">
      {children}
    </div>
  );
}

export function CardContent({ children }: { children: React.ReactNode }) {
  return <div className="mt-2 text-gray-700 leading-relaxed">{children}</div>;
}
