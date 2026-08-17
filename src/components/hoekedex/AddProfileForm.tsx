import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, Camera, UserPlus } from "lucide-react";
import { statusLabels, type RelationshipStatus } from "./types";

interface AddProfileFormProps {
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    age: string;
    status: RelationshipStatus;
    rating: number;
    notes: string;
    photoFile?: File;
  }) => void | Promise<void>;
}

const MAX_PHOTO_BYTES = 5 * 1024 * 1024;

export function AddProfileForm({ onClose, onSubmit }: AddProfileFormProps) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [status, setStatus] = useState<RelationshipStatus>("talking");
  const [rating, setRating] = useState(7);
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose an image file.");
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      setPhotoError("Image must be under 5MB.");
      return;
    }

    setPhotoError("");
    setPhotoFile(file);
    setPhotoPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(file);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || submitting) return;
    setSubmitting(true);
    try {
      await onSubmit({ name, age, status, rating, notes, photoFile: photoFile ?? undefined });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SheetContent
      side="bottom"
      className="h-[92dvh] rounded-t-3xl border-t border-border bg-background px-0 pb-0 pt-2"
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
            <SheetTitle className="text-2xl font-bold tracking-tight">New entry</SheetTitle>
            <p className="text-sm text-muted-foreground">Add someone to your Hoekedex.</p>
          </SheetHeader>

          <div className="space-y-5">
            {/* Photo */}
            <div className="flex flex-col items-center gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-24 w-24 flex-col items-center justify-center gap-1 overflow-hidden rounded-2xl border border-dashed border-border/60 bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {photoPreview ? (
                  <img src={photoPreview} alt="Selected" className="h-full w-full object-cover" />
                ) : (
                  <>
                    <Camera className="h-6 w-6" />
                    <span className="text-[10px] font-medium">Add photo</span>
                  </>
                )}
              </button>
              {photoError && <p className="text-xs text-destructive">{photoError}</p>}
            </div>

            {/* Name */}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Sarah Miller"
                className="h-12 rounded-xl border-border/60 bg-card text-base"
                required
              />
            </div>

            {/* Age & Status row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="age" className="text-sm font-medium">
                  Age
                </Label>
                <Input
                  id="age"
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  placeholder="24"
                  className="h-12 rounded-xl border-border/60 bg-card text-base"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-sm font-medium">Status</Label>
                <Select value={status} onValueChange={(v) => setStatus(v as RelationshipStatus)}>
                  <SelectTrigger className="h-12 rounded-xl border-border/60 bg-card text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {(Object.keys(statusLabels) as RelationshipStatus[]).map((s) => (
                      <SelectItem key={s} value={s} className="text-base">
                        {statusLabels[s]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3 rounded-2xl border border-border/60 bg-card p-4">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Rating</Label>
                <span className="text-lg font-bold text-gold">{rating}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full accent-primary"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>1</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-1.5">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="First impression, red flags, context..."
                className="min-h-[100px] rounded-xl border-border/60 bg-card text-base"
              />
            </div>
          </div>
        </div>

        <div className="safe-bottom border-t border-border/60 bg-card/80 p-4 backdrop-blur-md">
          <Button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-6 text-base font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            {submitting ? "Adding..." : "Add to Hoekedex"}
          </Button>
        </div>
      </form>
    </SheetContent>
  );
}
