"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  MapPin,
  Plus,
  Building,
  Home,
  Phone,
  User,
  Edit2,
  Trash2,
  Star,
  Loader2,
  X,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Address } from "@/components/checkout/AddressStep";

const addressSchema = z.object({
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  phone: z.string().min(6, "Valid contact number is required"),
  addressLine: z.string().min(5, "Full street address is required"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  label: z.string(),
  isDefault: z.boolean(),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressManagementViewProps {
  initialAddresses: Address[];
}

export function AddressManagementView({ initialAddresses }: AddressManagementViewProps) {
  const router = useRouter();
  const [addresses, setAddresses] = React.useState<Address[]>(initialAddresses);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingAddress, setEditingAddress] = React.useState<Address | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [deletingId, setDeletingId] = React.useState<string | null>(null);
  const [settingDefaultId, setSettingDefaultId] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      recipientName: "",
      phone: "",
      addressLine: "",
      city: "Dhaka",
      postalCode: "",
      label: "Home",
      isDefault: addresses.length === 0,
    },
  });

  const selectedLabel = watch("label");

  // Handle Edit Address Click
  const startEditing = (addr: Address) => {
    setEditingAddress(addr);
    setShowAddForm(false);
    setValue("recipientName", addr.recipientName);
    setValue("phone", addr.phone);
    setValue("addressLine", addr.addressLine);
    setValue("city", addr.city);
    setValue("postalCode", addr.postalCode);
    setValue("label", addr.label);
    setValue("isDefault", addr.isDefault);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingAddress(null);
    reset();
  };

  // Submit Handler: Add New Address or Update Existing
  const handleSave = async (data: AddressFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingAddress) {
        // Update existing address
        const res = await fetch("/api/addresses", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, id: editingAddress.id }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to update address");
        }

        const resData = await res.json();
        const updated: Address = resData.address;

        setAddresses((prev) =>
          prev.map((a) => {
            if (a.id === updated.id) return updated;
            if (updated.isDefault) return { ...a, isDefault: false };
            return a;
          })
        );
        toast.success("Address updated successfully!");
      } else {
        // Create new address
        const res = await fetch("/api/addresses", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to save address");
        }

        const resData = await res.json();
        const created: Address = resData.address;

        setAddresses((prev) => {
          if (created.isDefault) {
            return [created, ...prev.map((a) => ({ ...a, isDefault: false }))];
          }
          return [...prev, created];
        });
        toast.success("New address added successfully!");
      }

      cancelForm();
      router.refresh();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save address";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Set Address as Default
  const handleSetDefault = async (addressId: string) => {
    setSettingDefaultId(addressId);
    try {
      const res = await fetch("/api/addresses", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId }),
      });

      if (!res.ok) {
        throw new Error("Failed to set default address");
      }

      setAddresses((prev) =>
        prev.map((a) => ({
          ...a,
          isDefault: a.id === addressId,
        }))
      );
      toast.success("Default delivery address updated.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update default address");
    } finally {
      setSettingDefaultId(null);
    }
  };

  // Delete Address
  const handleDelete = async (addressId: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;

    setDeletingId(addressId);
    try {
      const res = await fetch(`/api/addresses?id=${encodeURIComponent(addressId)}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete address");
      }

      setAddresses((prev) => prev.filter((a) => a.id !== addressId));
      toast.info("Address deleted.");
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete address");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Bar with Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Your Saved Addresses ({addresses.length})
        </span>

        {!showAddForm && !editingAddress && (
          <Button
            type="button"
            onClick={() => {
              reset({
                recipientName: "",
                phone: "",
                addressLine: "",
                city: "Dhaka",
                postalCode: "",
                label: "Home",
                isDefault: addresses.length === 0,
              });
              setShowAddForm(true);
            }}
            className="rounded-xl text-xs font-bold bg-primary text-primary-foreground gap-1.5 self-start sm:self-auto h-9"
          >
            <Plus className="size-4" />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {/* Add / Edit Inline Form */}
      {(showAddForm || editingAddress) && (
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-md space-y-4 animate-in fade-in-50 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-border/80">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              {editingAddress ? (
                <>
                  <Edit2 className="size-4 text-primary" />
                  <span>Edit Delivery Address</span>
                </>
              ) : (
                <>
                  <Plus className="size-4 text-primary" />
                  <span>Add New Delivery Address</span>
                </>
              )}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              onClick={cancelForm}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="recipientName" className="text-xs font-semibold">
                  Recipient Name *
                </Label>
                <Input
                  id="recipientName"
                  placeholder="e.g. Tanvir Ahmed"
                  {...register("recipientName")}
                  className={errors.recipientName ? "border-destructive" : ""}
                />
                {errors.recipientName && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.recipientName.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-xs font-semibold">
                  Phone Number *
                </Label>
                <Input
                  id="phone"
                  placeholder="e.g. 01712345678"
                  {...register("phone")}
                  className={errors.phone ? "border-destructive" : ""}
                />
                {errors.phone && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.phone.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="addressLine" className="text-xs font-semibold">
                Street Address / House / Road / Area *
              </Label>
              <Input
                id="addressLine"
                placeholder="e.g. House 42, Road 7, Block C, Dhanmondi"
                {...register("addressLine")}
                className={errors.addressLine ? "border-destructive" : ""}
              />
              {errors.addressLine && (
                <p className="text-[11px] text-destructive font-medium">
                  {errors.addressLine.message}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="city" className="text-xs font-semibold">
                  City / District *
                </Label>
                <Input
                  id="city"
                  placeholder="e.g. Dhaka"
                  {...register("city")}
                  className={errors.city ? "border-destructive" : ""}
                />
                {errors.city && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.city.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="postalCode" className="text-xs font-semibold">
                  Postal Code *
                </Label>
                <Input
                  id="postalCode"
                  placeholder="e.g. 1205"
                  {...register("postalCode")}
                  className={errors.postalCode ? "border-destructive" : ""}
                />
                {errors.postalCode && (
                  <p className="text-[11px] text-destructive font-medium">
                    {errors.postalCode.message}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold">Address Type</Label>
                <div className="flex gap-2">
                  {["Home", "Office", "Other"].map((lbl) => (
                    <Button
                      key={lbl}
                      type="button"
                      variant={selectedLabel === lbl ? "default" : "outline"}
                      size="sm"
                      onClick={() => setValue("label", lbl)}
                      className="flex-1 text-xs h-9 rounded-xl font-medium"
                    >
                      {lbl}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="isDefault"
                {...register("isDefault")}
                className="size-4 rounded border-border text-primary focus:ring-primary accent-primary"
              />
              <Label htmlFor="isDefault" className="text-xs text-foreground cursor-pointer">
                Set as my default delivery address
              </Label>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={cancelForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl px-6 bg-primary text-primary-foreground font-bold text-xs h-10 shadow-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                    Saving...
                  </>
                ) : editingAddress ? (
                  "Update Address"
                ) : (
                  "Save Address"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <Card
              key={address.id}
              className={`rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col justify-between ${
                address.isDefault
                  ? "border-primary/80 bg-primary/5 shadow-xs ring-1 ring-primary/20"
                  : "border-border bg-card shadow-2xs hover:border-border/80"
              }`}
            >
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-muted text-foreground flex items-center justify-center">
                      {address.label.toLowerCase() === "office" ? (
                        <Building className="size-3.5 text-primary" />
                      ) : (
                        <Home className="size-3.5 text-primary" />
                      )}
                    </span>
                    <span className="font-bold text-sm text-foreground capitalize">
                      {address.label}
                    </span>
                    {address.isDefault && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900 flex items-center gap-1">
                        <Check className="size-2.5" />
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-1 text-xs text-muted-foreground">
                  <p className="font-bold text-sm text-foreground flex items-center gap-1.5">
                    <User className="size-3.5 text-muted-foreground" />
                    <span>{address.recipientName}</span>
                  </p>
                  <p className="flex items-center gap-1.5 font-medium text-foreground/90">
                    <Phone className="size-3.5 text-muted-foreground" />
                    <span>{address.phone}</span>
                  </p>
                  <p className="pt-1 leading-relaxed text-foreground/80">
                    {address.addressLine}, {address.city} - {address.postalCode}
                  </p>
                </div>
              </CardContent>

              {/* Card Actions Footer */}
              <div className="p-4 sm:p-5 pt-0 border-t border-border/60 bg-muted/10 flex items-center justify-between gap-2">
                <div>
                  {!address.isDefault && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={settingDefaultId === address.id}
                      onClick={() => handleSetDefault(address.id)}
                      className="h-8 px-2.5 rounded-xl text-xs font-semibold text-primary hover:text-primary/80 hover:bg-primary/10 gap-1"
                    >
                      {settingDefaultId === address.id ? (
                        <Loader2 className="size-3 animate-spin" />
                      ) : (
                        <Star className="size-3" />
                      )}
                      <span>Set as Default</span>
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => startEditing(address)}
                    className="h-8 px-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-muted"
                  >
                    <Edit2 className="size-3.5 mr-1" />
                    <span>Edit</span>
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    disabled={deletingId === address.id}
                    onClick={() => handleDelete(address.id)}
                    className="h-8 px-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                  >
                    {deletingId === address.id ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="size-3.5 mr-1" />
                    )}
                    <span>Delete</span>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showAddForm && (
          <Card className="border border-dashed border-border text-center py-16 rounded-3xl bg-card">
            <CardContent className="space-y-4">
              <div className="mx-auto size-16 rounded-3xl bg-muted flex items-center justify-center text-muted-foreground mb-2">
                <MapPin className="size-8 stroke-[1.5]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-foreground">No Saved Addresses</h3>
                <p className="max-w-md mx-auto text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Add your primary home or office delivery address for smooth and fast checkout across Bangladesh.
                </p>
              </div>
              <div className="pt-2">
                <Button
                  onClick={() => setShowAddForm(true)}
                  className="rounded-xl px-6 bg-primary text-primary-foreground font-bold text-xs h-10 shadow-sm gap-2"
                >
                  <Plus className="size-4" />
                  <span>Add First Address</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        )
      )}
    </div>
  );
}
