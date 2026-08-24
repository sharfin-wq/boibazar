import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";

const addressPayloadSchema = z.object({
  recipientName: z.string().min(2, "Recipient name must be at least 2 characters"),
  phone: z.string().min(6, "Valid phone number is required"),
  addressLine: z.string().min(5, "Address line must be at least 5 characters"),
  city: z.string().min(2, "City is required"),
  postalCode: z.string().min(2, "Postal code is required"),
  label: z.string().default("Home"),
  isDefault: z.boolean().default(false),
});

const updateAddressSchema = addressPayloadSchema.extend({
  id: z.string().min(1, "Address ID is required"),
});

// 1. GET /api/addresses: Fetch all saved addresses for current user
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to view addresses" },
        { status: 401 }
      );
    }

    const addresses = await prisma.address.findMany({
      where: { userId: user.id },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return NextResponse.json({ addresses });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

// 2. POST /api/addresses: Create a new address for current user
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to save an address" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = addressPayloadSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid address data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const {
      recipientName,
      phone,
      addressLine,
      city,
      postalCode,
      label,
      isDefault,
    } = parsed.data;

    // Check if this is the user's first address
    const addressCount = await prisma.address.count({
      where: { userId: user.id },
    });

    const shouldBeDefault = isDefault || addressCount === 0;

    // If setting as default, unset other defaults
    if (shouldBeDefault && addressCount > 0) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true },
        data: { isDefault: false },
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        userId: user.id,
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        label: label.trim() || "Home",
        isDefault: shouldBeDefault,
      },
    });

    return NextResponse.json(
      {
        message: "Address saved successfully",
        address: newAddress,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Failed to save address" },
      { status: 500 }
    );
  }
}

// 3. PATCH /api/addresses: Update an existing address
export async function PATCH(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to update an address" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const parsed = updateAddressSchema.safeParse(body);

    if (!parsed.success) {
      const errorMsg = parsed.error.issues[0]?.message || "Invalid address update data";
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    const {
      id,
      recipientName,
      phone,
      addressLine,
      city,
      postalCode,
      label,
      isDefault,
    } = parsed.data;

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // If setting as default, unset others
    if (isDefault) {
      await prisma.address.updateMany({
        where: { userId: user.id, isDefault: true, id: { not: id } },
        data: { isDefault: false },
      });
    }

    const updated = await prisma.address.update({
      where: { id },
      data: {
        recipientName: recipientName.trim(),
        phone: phone.trim(),
        addressLine: addressLine.trim(),
        city: city.trim(),
        postalCode: postalCode.trim(),
        label: label.trim() || "Home",
        isDefault,
      },
    });

    return NextResponse.json({
      message: "Address updated successfully",
      address: updated,
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

// 4. PUT /api/addresses: Set address as default
export async function PUT(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to update default address" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const addressId = body.addressId || body.id;

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    // Unset current defaults
    await prisma.address.updateMany({
      where: { userId: user.id, isDefault: true },
      data: { isDefault: false },
    });

    // Set new default
    const updated = await prisma.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });

    return NextResponse.json({
      message: "Default address updated",
      address: updated,
    });
  } catch (error) {
    console.error("Error setting default address:", error);
    return NextResponse.json(
      { error: "Failed to update default address" },
      { status: 500 }
    );
  }
}

// 5. DELETE /api/addresses: Delete an address
export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "You must be signed in to delete an address" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    let addressId = searchParams.get("id") || searchParams.get("addressId");

    if (!addressId) {
      try {
        const body = await request.json();
        addressId = body.id || body.addressId;
      } catch {
        // body empty
      }
    }

    if (!addressId) {
      return NextResponse.json({ error: "Address ID is required" }, { status: 400 });
    }

    // Verify ownership
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId: user.id },
    });

    if (!existing) {
      return NextResponse.json({ error: "Address not found" }, { status: 404 });
    }

    await prisma.address.delete({
      where: { id: addressId },
    });

    // If deleted address was default, make another address default if available
    if (existing.isDefault) {
      const firstRemaining = await prisma.address.findFirst({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
      if (firstRemaining) {
        await prisma.address.update({
          where: { id: firstRemaining.id },
          data: { isDefault: true },
        });
      }
    }

    return NextResponse.json({
      message: "Address deleted successfully",
      addressId,
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
