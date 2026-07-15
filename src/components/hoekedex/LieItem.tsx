import { cn } from "@/lib/utils";
import { lieSeverityLabels, lieSeverityEmoji, type Lie } from "./types";

const severityClasses = {
  white: "bg-secondary/80 text-secondary-foreground border-border/40",
  medium: "bg-status-situationship/15 text-status-situationship-foreground border-status-situationship/25",
  big: "bg-destructive/15 text-destructive-foreground border-destructive/25",
};

interface LieItemProps {
  lie: Lie;
  compact?: boolean;
}

export function LieItem({ lie, compact = false }: LieItemProps) {
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-xl border p-3",
        severityClasses[lie.severity],
      )}
    >
      <span className="shrink-0 text-lg" aria-hidden="true">
        {lieSeverityEmoji[lie.severity]}
      </span>
      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "leading-snug text-foreground",
            compact ? "text-sm" : "text-[15px]",
          )}
        >
          {lie.text}
        </p>
        <div className="mt-1.5 flex items-center gap-2 text-xs text-muted-foreground">
          <span>{lieSeverityLabels[lie.severity]}</span>
          <span className="h-1 w-1 rounded-full bg-muted-foreground/40" />
          <span>{lie.date}</span>
        </div>
      </div>
    </div>
  );
}
