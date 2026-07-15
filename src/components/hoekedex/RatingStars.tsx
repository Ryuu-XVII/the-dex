import { cn } from "@/lib/utils";
import { Star } from "lucide-react";

interface RatingStarsProps {
  rating: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
}

const sizeClasses = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
};

const textSizes = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export function RatingStars({
  rating,
  max = 10,
  size = "md",
  showValue = true,
}: RatingStarsProps) {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {Array.from({ length: max }).map((_, i) => {
          const filled = i < Math.floor(rating);
          const half = !filled && i < Math.ceil(rating) && rating % 1 !== 0;
          return (
            <div key={i} className="relative">
              <Star
                className={cn(
                  sizeClasses[size],
                  "text-muted-foreground/30",
                )}
                fill="currentColor"
                strokeWidth={0}
              />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: half ? "50%" : filled ? "100%" : "0%" }}
              >
                <Star
                  className={cn(
                    sizeClasses[size],
                    "text-gold",
                  )}
                  fill="currentColor"
                  strokeWidth={0}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showValue && (
        <span
          className={cn(
            "ml-1 font-semibold tabular-nums text-gold",
            textSizes[size],
          )}
        >
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
