"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  MapPin,
  Plus,
  CheckCircle2,
  Building,
  Home,
  Phone,
  User,
  ArrowRight,
  Loader2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export interface Address {
  id: string;
  userId: string;
  label: string;
  recipientName: string;
  phone: string;
  addressLine: string;
  city: string;
  postalCode: string;
  isDefault: boolean;
}

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

interface AddressStepProps {
  addresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (addressId: string) => void;
  onAddressCreated: (address: Address) => void;
  onContinue: () => void;
}

export function AddressStep({
  addresses,
  selectedAddressId,
  onSelectAddress,
  onAddressCreated,
  onContinue,
}: AddressStepProps) {
  const [showAddForm, setShowAddForm] = React.useState(addresses.length === 0);
  const [isSaving, setIsSaving] = React.useState(false);

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

  const handleSaveAddress = async (data: AddressFormValues) => {
    setIsSaving(true);
    try {
      const res = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to save address");
      }

      const resData = await res.json();
      const newAddress: Address = resData.address;

      onAddressCreated(newAddress);
      onSelectAddress(newAddress.id);
      setShowAddForm(false);
      reset();
      toast.success("Delivery address saved successfully!");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save address";
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/80">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight flex items-center gap-2">
            <MapPin className="size-5 sm:size-6 text-primary" />
            <span>Select Delivery Address</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Choose where you want your book package delivered across Bangladesh.
          </p>
        </div>

        {addresses.length > 0 && !showAddForm && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
            className="gap-1.5 rounded-xl border-border text-xs font-semibold self-start sm:self-auto hover:bg-muted"
          >
            <Plus className="size-4" />
            <span>Add New Address</span>
          </Button>
        )}
      </div>

      {/* 1. Saved Addresses Grid */}
      {addresses.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => {
            const isSelected = address.id === selectedAddressId;

            return (
              <Card
                key={address.id}
                onClick={() => onSelectAddress(address.id)}
                className={`relative cursor-pointer rounded-2xl transition-all duration-200 border overflow-hidden ${
                  isSelected
                    ? "border-primary ring-2 ring-primary/20 bg-primary/5 shadow-sm"
                    : "border-border hover:border-primary/40 bg-card"
                }`}
              >
                <CardContent className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-muted text-foreground flex items-center justify-center">
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
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                          Default
                        </span>
                      )}
                    </div>

                    <div
                      className={`size-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="size-3.5" />}
                    </div>
                  </div>

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      <span>{address.recipientName}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="size-3.5 text-muted-foreground" />
                      <span>{address.phone}</span>
                    </p>
                    <p className="pt-1 text-foreground/90 leading-relaxed">
                      {address.addressLine}, {address.city} - {address.postalCode}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* 2. Add New Address Form Modal / Inline Block */}
      {showAddForm && (
        <div className="p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/80">
            <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
              <Plus className="size-4 text-primary" />
              <span>Add New Delivery Address</span>
            </h3>
            {addresses.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                onClick={() => setShowAddForm(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            )}
          </div>

          <form onSubmit={handleSubmit(handleSaveAddress)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Recipient Name */}
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

              {/* Contact Phone */}
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

            {/* Address Line */}
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
              {/* City */}
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

              {/* Postal Code */}
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

              {/* Address Label buttons */}
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

            {/* Is Default Checkbox */}
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

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {addresses.length > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
              )}
              <Button
                type="submit"
                disabled={isSaving}
                className="rounded-xl px-6 bg-primary text-primary-foreground font-bold text-xs h-10 shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 size-3.5 animate-spin" />
                    Saving Address...
                  </>
                ) : (
                  "Save & Use This Address"
                )}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Bottom Continue Action */}
      <div className="flex items-center justify-between gap-4 pt-4 border-t border-border/80">
        <p className="text-xs text-muted-foreground">
          {selectedAddress ? (
            <span>
              Delivering to: <strong className="text-foreground">{selectedAddress.recipientName}</strong> ({selectedAddress.city})
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400 font-medium">
              Please select or add a delivery address to continue.
            </span>
          )}
        </p>

        <Button
          type="button"
          onClick={onContinue}
          disabled={!selectedAddressId}
          className="h-11 px-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-sm shadow-md gap-2"
        >
          <span>Continue to Review</span>
          <ArrowRight className="size-4" />
        </Button>
      </div>
    </div>
  );
}
