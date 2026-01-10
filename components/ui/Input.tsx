import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", label, error, rightElement, disabled, ...props }, ref) => {
    return (
      <div className="space-y-1.5 font-sans">
        {label && (
          <label className="block text-xs font-mono text-muted-foreground ml-1 uppercase tracking-wider">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full bg-muted/50 px-4 py-3 rounded-lg border border-border 
              text-foreground placeholder:text-muted-foreground
              focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? "border-red-500 focus:border-red-500" : "group-hover:border-muted-foreground/50"}
              ${rightElement ? "pr-12" : ""}
              ${className}
            `}
            disabled={disabled}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500 ml-1 animate-enter font-mono">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
