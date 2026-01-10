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
          <label className="block text-sm font-medium text-slate-700 ml-1">
            {label}
          </label>
        )}
        <div className="relative group">
          <input
            ref={ref}
            className={`
              w-full bg-white px-4 py-3 rounded-xl border-2 border-slate-200 
              text-slate-900 placeholder:text-slate-400
              focus:border-blue-500 focus:ring-0 focus:outline-none transition-all duration-200
              disabled:bg-slate-50 disabled:text-slate-500
              ${error ? "border-red-400 focus:border-red-500" : "group-hover:border-slate-300"}
              ${rightElement ? "pr-12" : ""}
              ${className}
            `}
            disabled={disabled}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none">
              {rightElement}
            </div>
          )}
        </div>
        {error && (
          <p className="text-sm text-red-500 ml-1 animate-enter">{error}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
