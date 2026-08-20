import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, deserializeSession } from "@/lib/auth/session";
import { getDevNotifications, markNotificationRead } from "@/lib/dev-passenger-extras-store";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const session = deserializeSession(token);
    if (!session) return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });

    const notifications = getDevNotifications(session.id);
    return NextResponse.json({ success: true, notifications }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    const session = deserializeSession(token);
    if (!session) return NextResponse.json({ success: false, error: "Invalid session" }, { status: 401 });

    const { notifId } = await request.json();
    if (notifId) {
      markNotificationRead(session.id, notifId);
    }
    return NextResponse.json({ success: true }, { status: 200 });
  } catch {
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
