import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, deserializeSession } from "@/lib/auth/session";
import {
  getDevSavedPassengers,
  addDevSavedPassenger,
  deleteDevSavedPassenger,
  getDevSavedRoutes,
  addDevSavedRoute,
  deleteDevSavedRoute,
} from "@/lib/dev-passenger-extras-store";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const session = deserializeSession(token);
    if (!session) return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });

    const passengers = getDevSavedPassengers(session.id);
    const routes = getDevSavedRoutes(session.id);

    return NextResponse.json({ success: true, passengers, routes }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const session = deserializeSession(token);
    if (!session) return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });

    const body = await request.json();
    if (body.type === "PASSENGER") {
      const added = addDevSavedPassenger(session.id, {
        name: body.name,
        phone: body.phone,
        gender: body.gender || "male",
      });
      return NextResponse.json({ success: true, item: added }, { status: 201 });
    } else if (body.type === "ROUTE") {
      const added = addDevSavedRoute(session.id, {
        fromDistrictId: body.fromDistrictId,
        fromDistrictName: body.fromDistrictName,
        toDistrictId: body.toDistrictId,
        toDistrictName: body.toDistrictName,
      });
      return NextResponse.json({ success: true, item: added }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: "Invalid type" }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const session = deserializeSession(token);
    if (!session) return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });

    const { id, type } = await request.json();
    if (type === "PASSENGER") {
      deleteDevSavedPassenger(session.id, id);
    } else if (type === "ROUTE") {
      deleteDevSavedRoute(session.id, id);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
