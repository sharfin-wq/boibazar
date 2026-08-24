"use client";

import * as React from "react";
import { CheckoutStepper, CheckoutStepNumber } from "./CheckoutStepper";
import { AddressStep, Address } from "./AddressStep";
import { ReviewStep } from "./ReviewStep";
import { PaymentStep, PlacedOrder } from "./PaymentStep";
import { ConfirmationStep } from "./ConfirmationStep";
import { CartItem } from "@/context/CartContext";

interface CheckoutFlowProps {
  initialAddresses: Address[];
  initialCartItems: CartItem[];
  user: {
    id: string;
    name?: string | null;
    email: string;
  };
}

export function CheckoutFlow({
  initialAddresses,
  initialCartItems,
}: CheckoutFlowProps) {
  const [currentStep, setCurrentStep] = React.useState<CheckoutStepNumber>(1);
  const [addresses, setAddresses] = React.useState<Address[]>(initialAddresses);

  // Pick default address or first address initially
  const defaultAddr = initialAddresses.find((a) => a.isDefault) || initialAddresses[0];
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(
    defaultAddr ? defaultAddr.id : null
  );

  const [placedOrder, setPlacedOrder] = React.useState<PlacedOrder | null>(null);

  // Cart pricing calculation
  const totalItems = initialCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = initialCartItems.reduce((sum, item) => {
    const price =
      item.book.discountPrice !== null &&
      item.book.discountPrice !== undefined &&
      item.book.discountPrice < item.book.price
        ? item.book.discountPrice
        : item.book.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingFee = subtotal >= 1000 ? 0 : totalItems > 0 ? 60 : 0;
  const total = subtotal + shippingFee;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);

  const handleAddressCreated = (newAddr: Address) => {
    setAddresses((prev) => [newAddr, ...prev]);
    setSelectedAddressId(newAddr.id);
  };

  const handleOrderPlaced = (order: PlacedOrder) => {
    setPlacedOrder(order);
    setCurrentStep(4);
  };

  return (
    <div className="space-y-6">
      {/* 1. Progress Stepper */}
      <CheckoutStepper currentStep={currentStep} />

      {/* 2. Step Views */}
      {currentStep === 1 && (
        <AddressStep
          addresses={addresses}
          selectedAddressId={selectedAddressId}
          onSelectAddress={setSelectedAddressId}
          onAddressCreated={handleAddressCreated}
          onContinue={() => setCurrentStep(2)}
        />
      )}

      {currentStep === 2 && selectedAddress && (
        <ReviewStep
          cartItems={initialCartItems}
          selectedAddress={selectedAddress}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          onBack={() => setCurrentStep(1)}
          onChangeAddress={() => setCurrentStep(1)}
          onContinue={() => setCurrentStep(3)}
        />
      )}

      {currentStep === 3 && selectedAddress && (
        <PaymentStep
          selectedAddress={selectedAddress}
          subtotal={subtotal}
          shippingFee={shippingFee}
          total={total}
          totalItems={totalItems}
          onBack={() => setCurrentStep(2)}
          onOrderPlaced={handleOrderPlaced}
        />
      )}

      {currentStep === 4 && placedOrder && (
        <ConfirmationStep order={placedOrder} />
      )}
    </div>
  );
}
