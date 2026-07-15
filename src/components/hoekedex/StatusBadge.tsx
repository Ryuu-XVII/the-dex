import { cn } from "@/lib/utils";
import { statusLabels, statusEmoji, type RelationshipStatus } from "./types";

interface StatusBadgeProps {
  status: RelationshipStatus;
  size?: "sm" | "md";
}

const statusClasses: Record<RelationshipStatus, string> = {
  talking: "bg-status-talking/15 text-status-talking-foreground border-status-talking/30",
  situationship:
    "bg-status-situationship/15 text-status-situationship-foreground border-status-situationship/30",
  taken: "bg-status-taken/15 text-status-taken-foreground border-status-taken/30",
  ex: "bg-status-ex/15 text-status-ex-foreground border-status-ex/30",
  backup: "bg-secondary text-secondary-foreground border-border/40",
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-medium",
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-2.5 py-1 text-xs",
        statusClasses[status],
      )}
    >
      <span>{statusEmoji[status]}</span>
      <span>{statusLabels[status]}</span>
    </span>
  );
}
