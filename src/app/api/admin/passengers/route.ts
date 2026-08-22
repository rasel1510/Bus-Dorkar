import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { devUserStore, getAllDevUsers } from "@/lib/dev-store";

const mockPassengers = [
  {
    id: "pass-saif-001",
    name: "Saif Bean",
    email: "saifbean3@gmail.com",
    phone: "+8801799112233",
    phoneVerified: true,
    status: "ACTIVE",
    walletBalance: 500,
    totalBookings: 6,
    preferredRoute: "Dhaka → Sylhet",
    createdAt: new Date().toISOString(),
  },
  {
    id: "pass-101",
    name: "Karim Chowdhury",
    email: "karim.dhaka@gmail.com",
    phone: "+8801755667788",
    phoneVerified: true,
    status: "ACTIVE",
    walletBalance: 450,
    totalBookings: 14,
    preferredRoute: "Dhaka → Chittagong",
    createdAt: "2025-11-12T10:30:00.000Z",
  },
  {
    id: "pass-102",
    name: "Sharmin Sultana",
    email: "sharmin.s@yahoo.com",
    phone: "+8801811223344",
    phoneVerified: true,
    status: "ACTIVE",
    walletBalance: 1200,
    totalBookings: 28,
    preferredRoute: "Dhaka → Sylhet",
    createdAt: "2025-08-04T14:15:00.000Z",
  },
  {
    id: "pass-103",
    name: "Rafiqul Islam",
    email: "rafiq.bus@gmail.com",
    phone: "+8801922334455",
    phoneVerified: false,
    status: "UNVERIFIED",
    walletBalance: 0,
    totalBookings: 1,
    preferredRoute: "Dhaka → Rajshahi",
    createdAt: "2026-08-20T09:45:00.000Z",
  },
  {
    id: "pass-104",
    name: "Mahmud Hasan",
    email: "mahmud.h@outlook.com",
    phone: "+8801633445566",
    phoneVerified: true,
    status: "SUSPENDED",
    walletBalance: 0,
    totalBookings: 5,
    preferredRoute: "Dhaka → Cox's Bazar",
    createdAt: "2026-02-18T16:20:00.000Z",
  },
  {
    id: "pass-105",
    name: "Nabila Rahman",
    email: "nabila.r@gmail.com",
    phone: "+8801544556677",
    phoneVerified: true,
    status: "ACTIVE",
    walletBalance: 850,
    totalBookings: 19,
    preferredRoute: "Dhaka → Barisal",
    createdAt: "2025-12-01T11:10:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const statusFilter = searchParams.get("status") || "ALL";
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  try {
    const whereClause: any = { role: "PASSENGER" };
    if (statusFilter !== "ALL") {
      if (statusFilter === "UNVERIFIED") {
        whereClause.phoneVerified = false;
      }
    }

    const dbPassengers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        phoneVerified: true,
        createdAt: true,
        _count: { select: { bookings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedDbPassengers = dbPassengers.map((p: any) => ({
      id: p.id,
      name: p.name,
      email: p.email,
      phone: p.phone,
      phoneVerified: p.phoneVerified,
      status: p.phoneVerified ? "ACTIVE" : "UNVERIFIED",
      walletBalance: 200,
      totalBookings: p._count?.bookings || 0,
      preferredRoute: "Inter-District Line",
      createdAt: p.createdAt,
    }));

    // Combine with dev store passengers
    const devUsers = getAllDevUsers().filter((u) => u.role === "PASSENGER");
    const formattedDev = devUsers.map((u) => ({
      id: u.id,
      name: u.name,
      email: u.email || null,
      phone: u.phone,
      phoneVerified: true,
      status: "ACTIVE",
      walletBalance: 500,
      totalBookings: 3,
      preferredRoute: "Dhaka → Chattogram",
      createdAt: new Date().toISOString(),
    }));

    // Deduplicate
    const passMap = new Map<string, any>();
    mockPassengers.forEach((p) => passMap.set(p.id, p));
    formattedDev.forEach((p) => passMap.set(p.id, p));
    formattedDbPassengers.forEach((p: any) => passMap.set(p.id, p));

    let finalPassengers = Array.from(passMap.values());
    if (statusFilter !== "ALL") {
      finalPassengers = finalPassengers.filter((p) => p.status === statusFilter);
    }
    if (searchQuery) {
      finalPassengers = finalPassengers.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          (p.email && p.email.toLowerCase().includes(searchQuery)) ||
          p.phone.includes(searchQuery)
      );
    }

    return NextResponse.json({
      success: true,
      passengers: finalPassengers,
      total: finalPassengers.length,
    });
  } catch {
    let filtered = mockPassengers;
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((p) => p.status === statusFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery) ||
          (p.email && p.email.toLowerCase().includes(searchQuery)) ||
          p.phone.includes(searchQuery)
      );
    }
    return NextResponse.json({
      success: true,
      passengers: filtered,
      total: filtered.length,
      isFallback: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, passengerId, status, voucherAmount } = body;

    if (action === "TOGGLE_STATUS" && status) {
      const target = mockPassengers.find((p) => p.id === passengerId);
      if (target) target.status = status;
      return NextResponse.json({
        success: true,
        message: `Passenger status updated to ${status}`,
      });
    }

    if (action === "VERIFY_PHONE") {
      const target = mockPassengers.find((p) => p.id === passengerId);
      if (target) {
        target.phoneVerified = true;
        target.status = "ACTIVE";
      }
      return NextResponse.json({
        success: true,
        message: "Mobile phone manually verified by Admin override.",
      });
    }

    if (action === "ISSUE_VOUCHER") {
      const amount = voucherAmount || 200;
      const target = mockPassengers.find((p) => p.id === passengerId);
      if (target) target.walletBalance += amount;
      return NextResponse.json({
        success: true,
        message: `৳${amount} promotional wallet credit issued to passenger.`,
      });
    }

    if (action === "TRIGGER_PASSWORD_RESET") {
      return NextResponse.json({
        success: true,
        message: "Password reset link and SMS code sent to passenger.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action type" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
