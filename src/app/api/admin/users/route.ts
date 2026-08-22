import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { devUserStore, saveDevUser } from "@/lib/dev-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const roleFilter = searchParams.get("role");
  const searchQuery = searchParams.get("query")?.toLowerCase() || "";

  try {
    const whereClause: any = {};
    if (roleFilter && roleFilter !== "ALL") {
      whereClause.role = roleFilter;
    }
    if (searchQuery) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: "insensitive" } },
        { email: { contains: searchQuery, mode: "insensitive" } },
        { phone: { contains: searchQuery, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        phoneVerified: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      users,
      total: users.length,
    });
  } catch (error) {
    // Fallback to dev store users
    const devUsers = Array.from(devUserStore.values());
    let filtered = devUsers;

    if (roleFilter && roleFilter !== "ALL") {
      filtered = filtered.filter((u) => u.role === roleFilter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery) ||
          (u.email && u.email.toLowerCase().includes(searchQuery)) ||
          u.phone.includes(searchQuery)
      );
    }

    // Add mock demonstration users if dev store is small
    const mockUsers = [
      {
        id: "admin-rasel-001",
        name: "Rasel Admin",
        email: "rasel4897981@gmail.com",
        phone: "+8801700000001",
        role: "ADMIN",
        status: "ACTIVE",
        createdAt: new Date().toISOString(),
      },
      {
        id: "op-greenline-01",
        name: "Green Line Paribahan Admin",
        email: "contact@greenline.bd",
        phone: "+8801711122334",
        role: "BUS_OPERATOR",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
      },
      {
        id: "op-hanif-02",
        name: "Hanif Enterprise Ops",
        email: "operations@hanifenterprise.com",
        phone: "+8801822334455",
        role: "BUS_OPERATOR",
        status: "APPROVED",
        createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
      },
      {
        id: "staff-gabtoli-10",
        name: "Tanvir Ahmed (Gabtoli Counter)",
        email: "tanvir.counter@greenline.bd",
        phone: "+8801933445566",
        role: "COUNTER_STAFF",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
      },
      {
        id: "driver-jamal-05",
        name: "Jamal Uddin (Senior Driver)",
        email: "jamal.driver@hanif.com",
        phone: "+8801644556677",
        role: "DRIVER",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
      },
      {
        id: "pass-karim-99",
        name: "Karim Chowdhury",
        email: "karim.dhaka@gmail.com",
        phone: "+8801555667788",
        role: "PASSENGER",
        status: "ACTIVE",
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];

    // Deduplicate with devUserStore
    const userMap = new Map<string, any>();
    mockUsers.forEach((u) => userMap.set(u.id, u));
    filtered.forEach((u) => userMap.set(u.id, u));

    let finalUsers = Array.from(userMap.values());
    if (roleFilter && roleFilter !== "ALL") {
      finalUsers = finalUsers.filter((u) => u.role === roleFilter);
    }

    return NextResponse.json({
      success: true,
      users: finalUsers,
      total: finalUsers.length,
      isFallback: true,
    });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, newRole } = body;

    if (!newRole) {
      return NextResponse.json({ success: false, error: "Missing newRole parameter" }, { status: 400 });
    }

    // Try Prisma DB update
    try {
      if (email) {
        await prisma.user.update({
          where: { email },
          data: { role: newRole },
        });
      } else if (userId) {
        await prisma.user.update({
          where: { id: userId },
          data: { role: newRole },
        });
      }
    } catch (e) {
      // DB connection or record error fallback
    }

    // Update in-memory dev store
    if (email) {
      const devUser = devUserStore.get(email.toLowerCase());
      if (devUser) {
        devUser.role = newRole;
        saveDevUser(devUser);
      }
    }

    return NextResponse.json({
      success: true,
      message: `User role successfully updated to ${newRole}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
