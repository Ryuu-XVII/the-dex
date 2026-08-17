import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, MessageSquareWarning } from "lucide-react";
import { lieSeverityEmoji, lieSeverityLabels, type Lie, type LieSeverity } from "./types";

interface AddLieFormProps {
  onClose: () => void;
  onSubmit: (lie: Omit<Lie, "id">) => void | Promise<void>;
}

export function AddLieForm({ onClose, onSubmit }: AddLieFormProps) {
  const [text, setText] = useState("");
  const [severity, setSeverity] = useState<LieSeverity>("white");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({
        text: text.trim(),
        severity,
        date: new Date().toISOString().split("T")[0],
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent
      side="bottom"
      className="h-[60dvh] rounded-t-3xl border-t border-border bg-background px-0 pb-0 pt-2"
    >
      <form onSubmit={handleSubmit} className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 pb-2">
          <div className="h-1.5 w-12 rounded-full bg-muted" />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto no-scrollbar px-5">
          <SheetHeader className="pb-4 text-left">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold tracking-tight">
              <MessageSquareWarning className="h-5 w-5 text-love" />
              Log a lie
            </SheetTitle>
            <p className="text-sm text-muted-foreground">
              What did they say that wasn't quite true?
            </p>
          </SheetHeader>

          <div className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="lie-text" className="text-sm font-medium">
                What happened
              </Label>
              <Textarea
                id="lie-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. Said they were 'basically single'..."
                className="min-h-[100px] rounded-xl border-border/60 bg-card text-base"
                autoFocus
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-sm font-medium">Severity</Label>
              <Select value={severity} onValueChange={(v) => setSeverity(v as LieSeverity)}>
                <SelectTrigger className="h-12 rounded-xl border-border/60 bg-card text-base">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {(Object.keys(lieSeverityLabels) as LieSeverity[]).map((s) => (
                    <SelectItem key={s} value={s} className="text-base">
                      {lieSeverityEmoji[s]} {lieSeverityLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="safe-bottom border-t border-border/60 bg-card/80 p-4 backdrop-blur-md">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            {submitting ? "Logging..." : "Log this lie"}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
}
