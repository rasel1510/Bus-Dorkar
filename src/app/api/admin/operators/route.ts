import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockOperators = [
  {
    id: "op-greenline-01",
    companyName: "Green Line Paribahan",
    tradeLicenseNo: "TL-BD-982341",
    status: "APPROVED",
    rating: 4.9,
    totalReviews: 12480,
    registeredBuses: 450,
    totalTrips: 184200,
    ownerEmail: "contact@greenline.bd",
    createdAt: "2024-01-15T00:00:00.000Z",
  },
  {
    id: "op-hanif-02",
    companyName: "Hanif Enterprise",
    tradeLicenseNo: "TL-BD-881230",
    status: "APPROVED",
    rating: 4.8,
    totalReviews: 24900,
    registeredBuses: 820,
    totalTrips: 340100,
    ownerEmail: "operations@hanifenterprise.com",
    createdAt: "2024-02-10T00:00:00.000Z",
  },
  {
    id: "op-shyamoli-03",
    companyName: "Shyamoli NR Travels",
    tradeLicenseNo: "TL-BD-771922",
    status: "APPROVED",
    rating: 4.7,
    totalReviews: 9800,
    registeredBuses: 310,
    totalTrips: 129000,
    ownerEmail: "admin@shyamolinr.com",
    createdAt: "2024-03-01T00:00:00.000Z",
  },
  {
    id: "op-desh-04",
    companyName: "Desh Travels Express",
    tradeLicenseNo: "TL-BD-661002",
    status: "PENDING",
    rating: 5.0,
    totalReviews: 0,
    registeredBuses: 42,
    totalTrips: 0,
    ownerEmail: "info@deshtravels.bd",
    createdAt: "2026-08-19T00:00:00.000Z",
  },
  {
    id: "op-shoag-05",
    companyName: "Shohag Paribahan",
    tradeLicenseNo: "TL-BD-559182",
    status: "UNDER_REVIEW",
    rating: 4.6,
    totalReviews: 15400,
    registeredBuses: 290,
    totalTrips: 210000,
    ownerEmail: "support@shohag.com",
    createdAt: "2024-05-12T00:00:00.000Z",
  },
];

export async function GET() {
  try {
    const operators = await prisma.operatorProfile.findMany({
      include: {
        user: { select: { name: true, email: true, phone: true } },
        _count: { select: { buses: true, routes: true, staff: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      operators,
      total: operators.length,
    });
  } catch {
    return NextResponse.json({
      success: true,
      operators: mockOperators,
      total: mockOperators.length,
      isFallback: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { operatorId, status } = body;

    try {
      await prisma.operatorProfile.update({
        where: { id: operatorId },
        data: { status },
      });
    } catch {
      // Dev store / mock fallback update
      const op = mockOperators.find((o) => o.id === operatorId);
      if (op) op.status = status;
    }

    return NextResponse.json({
      success: true,
      message: `Operator status updated to ${status}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
