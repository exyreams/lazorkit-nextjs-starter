import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "success" | "warning" | "error" | "info" | "neutral";
  size?: "sm" | "md";
}

export const Badge = ({
  className = "",
  variant = "neutral",
  size = "md",
  children,
  ...props
}: BadgeProps) => {
  const variants = {
    success: "bg-[#22c55e]/10 text-[#22c55e] border-[#22c55e]/20",
    warning: "bg-[#f59e0b]/10 text-[#f59e0b] border-[#f59e0b]/20",
    error: "bg-[#ef4444]/10 text-[#ef4444] border-[#ef4444]/20",
    info: "bg-[#3b82f6]/10 text-[#3b82f6] border-[#3b82f6]/20",
    neutral: "bg-primary/10 text-primary border-primary/20",
  };

  const sizes = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-abc border font-mono uppercase tracking-wider
        ${variants[variant]} ${sizes[size]} ${className}
      `}
      {...props}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-75"></span>
      {children}
    </span>
  );
};
