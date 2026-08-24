"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, Edit2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProfileEditFormProps {
  initialName: string;
  email?: string;
}

export function ProfileEditForm({ initialName }: ProfileEditFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [name, setName] = React.useState(initialName);
  const [currentName, setCurrentName] = React.useState(initialName);
  const [isSaving, setIsSaving] = React.useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || name.trim().length < 2) {
      toast.error("Name must be at least 2 characters");
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile");
      }

      setCurrentName(name.trim());
      setIsEditing(false);
      toast.success("Profile name updated successfully!");
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setName(currentName);
    setIsEditing(false);
  };

  return (
    <div className="space-y-4">
      <div className="p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Full Name
          </div>
          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-wrap items-center gap-2 pt-1">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="h-9 max-w-xs text-sm font-semibold"
                autoFocus
              />
              <div className="flex items-center gap-1.5">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSaving}
                  className="h-9 px-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs gap-1.5"
                >
                  {isSaving ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <Check className="size-3.5" />
                  )}
                  <span>Save</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="h-9 px-2.5 text-xs text-muted-foreground hover:text-foreground"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </form>
          ) : (
            <div className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <span>{currentName || "Not Provided"}</span>
            </div>
          )}
        </div>

        {!isEditing && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="self-start sm:self-center gap-1.5 rounded-xl text-xs font-semibold border-border hover:bg-muted"
          >
            <Edit2 className="size-3.5" />
            <span>Edit Name</span>
          </Button>
        )}
      </div>
    </div>
  );
}
