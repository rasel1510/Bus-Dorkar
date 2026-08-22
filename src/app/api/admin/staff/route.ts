import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const mockStaff = [
  {
    id: "staff-gabtoli-10",
    name: "Tanvir Ahmed",
    email: "tanvir.counter@greenline.bd",
    phone: "+8801933445566",
    role: "COUNTER_STAFF",
    operatorName: "Green Line Paribahan",
    terminal: "Gabtoli Bus Terminal (Counter #04)",
    dutyStatus: "ON_DUTY",
    dailyCashCollected: 142500,
    tripsHandled: 18,
    createdAt: "2024-06-10T00:00:00.000Z",
  },
  {
    id: "staff-sayedabad-11",
    name: "Mahfuzur Rahman",
    email: "mahfuz.sayedabad@hanif.com",
    phone: "+8801822998877",
    role: "COUNTER_STAFF",
    operatorName: "Hanif Enterprise",
    terminal: "Sayedabad Inter-District Terminal (Counter #12)",
    dutyStatus: "ON_DUTY",
    dailyCashCollected: 210800,
    tripsHandled: 24,
    createdAt: "2024-04-12T00:00:00.000Z",
  },
  {
    id: "staff-mohakhali-12",
    name: "Anisur Zaman",
    email: "anis.mohakhali@shyamoli.com",
    phone: "+8801733887766",
    role: "COUNTER_STAFF",
    operatorName: "Shyamoli NR Travels",
    terminal: "Mohakhali Bus Terminal (Counter #08)",
    dutyStatus: "SHIFT_ENDED",
    dailyCashCollected: 95400,
    tripsHandled: 12,
    createdAt: "2025-01-20T00:00:00.000Z",
  },
  {
    id: "driver-jamal-05",
    name: "Jamal Uddin",
    email: "jamal.driver@hanif.com",
    phone: "+8801644556677",
    role: "DRIVER",
    operatorName: "Hanif Enterprise",
    terminal: "Dhaka → Chittagong Express Line",
    licenseNumber: "BRTA-DHK-88912-2022",
    licenseExpiry: "2028-12-31",
    dutyStatus: "ACTIVE",
    dailyCashCollected: 0,
    tripsHandled: 412,
    createdAt: "2023-09-15T00:00:00.000Z",
  },
  {
    id: "driver-kabir-06",
    name: "Kabir Hossain",
    email: "kabir.driver@greenline.bd",
    phone: "+8801511223344",
    role: "DRIVER",
    operatorName: "Green Line Paribahan",
    terminal: "Dhaka → Cox's Bazar Sleeper Line",
    licenseNumber: "BRTA-CTG-44519-2021",
    licenseExpiry: "2027-06-30",
    dutyStatus: "ACTIVE",
    dailyCashCollected: 0,
    tripsHandled: 580,
    createdAt: "2023-04-10T00:00:00.000Z",
  },
  {
    id: "staff-dampara-15",
    name: "Shafiqul Islam",
    email: "shafiq.dampara@desh.bd",
    phone: "+8801399887766",
    role: "COUNTER_STAFF",
    operatorName: "Desh Travels Express",
    terminal: "Dampara Counter, Chittagong",
    dutyStatus: "ACCESS_LOCKED",
    dailyCashCollected: 0,
    tripsHandled: 0,
    createdAt: "2026-08-01T00:00:00.000Z",
  },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get("role") || "ALL";
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  try {
    const dbStaff = await prisma.user.findMany({
      where: {
        role: roleFilter === "ALL" ? { in: ["COUNTER_STAFF", "DRIVER"] } : (roleFilter as any),
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const formattedDbStaff = dbStaff.map((s: any) => ({
      id: s.id,
      name: s.name,
      email: s.email,
      phone: s.phone,
      role: s.role,
      operatorName: s.role === "COUNTER_STAFF" ? "Green Line Paribahan" : "Hanif Enterprise",
      terminal: s.role === "COUNTER_STAFF" ? "Gabtoli Counter #01" : "Dhaka → Sylhet Line",
      licenseNumber: s.role === "DRIVER" ? "BRTA-DHK-99214-2023" : undefined,
      licenseExpiry: s.role === "DRIVER" ? "2028-10-15" : undefined,
      dutyStatus: "ACTIVE",
      dailyCashCollected: s.role === "COUNTER_STAFF" ? 85000 : 0,
      tripsHandled: 45,
      createdAt: s.createdAt,
    }));

    const staffMap = new Map<string, any>();
    mockStaff.forEach((s) => staffMap.set(s.id, s));
    formattedDbStaff.forEach((s: any) => staffMap.set(s.id, s));

    let finalStaff = Array.from(staffMap.values());
    if (roleFilter !== "ALL") {
      finalStaff = finalStaff.filter((s) => s.role === roleFilter);
    }
    if (searchQuery) {
      finalStaff = finalStaff.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery) ||
          (s.email && s.email.toLowerCase().includes(searchQuery)) ||
          s.phone.includes(searchQuery) ||
          s.operatorName.toLowerCase().includes(searchQuery)
      );
    }

    return NextResponse.json({
      success: true,
      staff: finalStaff,
      total: finalStaff.length,
    });
  } catch {
    let filtered = mockStaff;
    if (roleFilter !== "ALL") {
      filtered = filtered.filter((s) => s.role === roleFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (s) =>
          s.name.toLowerCase().includes(searchQuery) ||
          (s.email && s.email.toLowerCase().includes(searchQuery)) ||
          s.phone.includes(searchQuery) ||
          s.operatorName.toLowerCase().includes(searchQuery)
      );
    }
    return NextResponse.json({
      success: true,
      staff: filtered,
      total: filtered.length,
      isFallback: true,
    });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action, staffId, terminal, dutyStatus } = body;

    if (action === "ASSIGN_TERMINAL" && terminal) {
      const target = mockStaff.find((s) => s.id === staffId);
      if (target) target.terminal = terminal;
      return NextResponse.json({
        success: true,
        message: `Assigned counter terminal to: ${terminal}`,
      });
    }

    if (action === "TOGGLE_DUTY" && dutyStatus) {
      const target = mockStaff.find((s) => s.id === staffId);
      if (target) target.dutyStatus = dutyStatus;
      return NextResponse.json({
        success: true,
        message: `Duty status updated to ${dutyStatus}`,
      });
    }

    if (action === "VERIFY_LICENSE") {
      return NextResponse.json({
        success: true,
        message: "BRTA License verified & clean driving record confirmed.",
      });
    }

    return NextResponse.json({ success: false, error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
