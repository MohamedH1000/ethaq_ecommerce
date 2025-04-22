import { cn } from "@/lib/utils";
import { InputHTMLAttributes } from "react";
import { Icons } from "../icons";

export interface Props extends InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  label: string;
  variant?: "minimal" | "normal" | "with-shadow" | "flat";
  onSubmit: (e: any) => void;
  onClearSearch: (e: any) => void;
}

const classes = {
  normal:
    "bg-white dark:bg-gray-800 pl-6 pr-14 rounded-full border border-gray-200 dark:border-gray-700 focus:border-primary focus:ring-2 focus:ring-primary/20",
  minimal:
    "bg-gray-100 dark:bg-gray-900 px-10 md:px-14 rounded-full border border-transparent focus:bg-gray-200 dark:focus:bg-gray-800 focus:ring-2 focus:ring-primary/20",
  flat: "bg-white dark:bg-gray-800 px-10 md:px-14 rounded-full border-0 focus:ring-2 focus:ring-primary/20",
  "with-shadow":
    "bg-white dark:bg-gray-800 px-12 md:px-14 rounded-full border-0 shadow-md focus:ring-2 focus:ring-primary/20",
};

const SearchBox: React.FC<Props> = ({
  className,
  label,
  onSubmit,
  onClearSearch,
  variant = "normal",
  value,
  ...rest
}) => {
  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)}>
      <div
        className={cn("relative flex w-full", {
          "h-14 shadow-900": variant === "normal",
          "h-11 md:h-12": variant === "minimal",
          "h-auto": variant === "flat",
          "h-16 shadow-downfall": variant === "with-shadow",
        })}
      >
        <label htmlFor={label} className="sr-only">
          {label}
        </label>

        <input
          id={label}
          type="text"
          value={value}
          autoComplete="off"
          className={cn(
            "w-full h-full appearance-none overflow-hidden truncate rounded-full text-base text-gray-800 placeholder-gray-400 transition duration-200 ease-in-out focus:outline-none dark:text-gray-200 dark:placeholder-gray-500",
            "rtl:text-right", // RTL text alignment
            classes[variant]
          )}
          {...rest}
        />

        {/* Clear button (appears when there's input) */}
        {value && (
          <button
            type="button"
            onClick={onClearSearch}
            className={cn(
              "absolute flex h-full w-10 items-center justify-center text-gray-400 transition-colors duration-200 hover:text-primary focus:outline-none",
              {
                "left-36": variant === "normal",
                "left-0": variant !== "normal",
              }
            )}
          >
            <span className="sr-only">إغلاق</span>
            <Icons.close className="h-4 w-4" />
          </button>
        )}

        {/* Search button */}
        {variant === "normal" ? (
          <button
            className="absolute left-0 flex h-full min-w-[120px] items-center justify-center rounded-l-full bg-primary px-4 font-medium text-white transition-colors duration-200 hover:bg-primary/90 focus:outline-none"
            type="submit"
          >
            <Icons.search className="h-5 w-5 ml-2" />
            <span className="max-sm:hidden">بحث</span>
          </button>
        ) : (
          <button
            className="absolute right-0 flex h-full w-12 items-center justify-center text-gray-500 transition-colors duration-200 hover:text-primary focus:outline-none"
            type="submit"
          >
            <span className="sr-only">بحث</span>
            <Icons.search className="h-5 w-5" />
          </button>
        )}
      </div>
    </form>
  );
};

export default SearchBox;
