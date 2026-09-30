// In-memory mock backend resolver. Every call `lib/api.ts` would normally
// make over HTTP is routed through here instead, so this static copy of the
// app has zero network/database dependencies (see mock-data.ts for fixtures).

import type { ApiErrorBody, Page, TripListItem } from "@/types/api";
import {
  bookingsForStatus,
  createBooking,
  DEMO_EMAIL,
  DEMO_PASSWORD,
  getPageContent,
  getRaceCategories,
  getTripDetail,
  listTrips,
  state,
  type Locale,
} from "./mock-data";

export interface MockResult {
  status: number;
  body: unknown;
}

function ok(body: unknown, status = 200): MockResult {
  return { status, body };
}

function error(status: number, code: string, message: string): MockResult {
  return { status, body: { code, message } satisfies ApiErrorBody };
}

function paginate<T>(items: T[], page: number, pageSize: number): Page<T> {
  const start = (page - 1) * pageSize;
  return { items: items.slice(start, start + pageSize), total: items.length, page, page_size: pageSize };
}

function fakeTokens() {
  return { access_token: "mock-access-token", refresh_token: "mock-refresh-token", token_type: "bearer" };
}

function locale(params: URLSearchParams): Locale {
  return params.get("locale") === "el" ? "el" : "en";
}

/** Resolves `${method} ${path}` (path includes query string) against the
 * static fixtures, mimicking the FastAPI backend's JSON responses closely
 * enough for every page/component in this app to render normally. */
export function resolveMock(method: string, path: string, body?: unknown): MockResult {
  const [pathname, search = ""] = path.split("?");
  const params = new URLSearchParams(search);
  const segments = pathname.split("/").filter(Boolean);
  const parsedBody = (): Record<string, unknown> => {
    if (!body) return {};
    if (typeof body === "string") {
      try {
        return JSON.parse(body);
      } catch {
        return {};
      }
    }
    return body as Record<string, unknown>;
  };

  // --- Content pages ---
  if (method === "GET" && segments[0] === "content" && segments[1] === "pages" && segments[2]) {
    return ok(getPageContent(segments[2], locale(params)));
  }

  // --- Trips ---
  if (method === "GET" && segments[0] === "trips" && segments.length === 1) {
    const loc = locale(params);
    let items: TripListItem[] = listTrips(loc);
    if (params.get("featured") === "true") items = items.filter((t) => t.is_featured);
    const status = params.get("status");
    const today = new Date().toISOString().slice(0, 10);
    if (status === "past") items = items.filter((t) => t.start_date < today);
    else if (status === "upcoming") items = items.filter((t) => t.start_date >= today);
    const category = params.get("category");
    if (category) items = items.filter((t) => t.categories.some((c) => c.race_category.slug === category));
    const q = params.get("q");
    if (q) items = items.filter((t) => t.title.toLowerCase().includes(q.toLowerCase()));
    const page = Number(params.get("page")) || 1;
    const pageSize = Number(params.get("page_size")) || 12;
    return ok(paginate(items, page, pageSize));
  }
  if (method === "GET" && segments[0] === "trips" && segments.length === 2) {
    const detail = getTripDetail(segments[1], locale(params));
    if (!detail) return error(404, "NOT_FOUND", "Trip not found");
    return ok(detail);
  }

  // --- Race categories ---
  if (method === "GET" && segments[0] === "race-categories") {
    return ok(getRaceCategories(locale(params)));
  }

  // --- Auth ---
  if (method === "POST" && segments[0] === "auth" && segments[1] === "login") {
    return ok({ user: state.user, tokens: fakeTokens() });
  }
  if (method === "POST" && segments[0] === "auth" && segments[1] === "signup") {
    const b = parsedBody();
    if (typeof b.full_name === "string") state.user.full_name = b.full_name;
    return ok({ user: state.user, tokens: fakeTokens() }, 201);
  }
  if (method === "POST" && segments[0] === "auth" && segments[1] === "google") {
    return ok({ user: state.user, tokens: fakeTokens() });
  }
  if (method === "POST" && segments[0] === "auth" && segments[1] === "refresh") {
    return ok(fakeTokens());
  }
  if (method === "POST" && segments[0] === "auth" && segments[1] === "logout") {
    return ok(undefined, 204);
  }
  if (method === "POST" && segments[0] === "auth" && ["forgot-password", "reset-password", "verify-email"].includes(segments[1])) {
    return ok(undefined, 204);
  }

  // --- Users ---
  if (method === "GET" && segments[0] === "users" && segments[1] === "me" && segments.length === 2) {
    return ok(state.user);
  }
  if (method === "PATCH" && segments[0] === "users" && segments[1] === "me" && segments.length === 2) {
    const b = parsedBody();
    if (typeof b.full_name === "string") state.user.full_name = b.full_name;
    return ok(state.user);
  }
  if (method === "GET" && segments[0] === "users" && segments[1] === "me" && segments[2] === "travel-profile") {
    return ok(state.travelProfile);
  }
  if (method === "PATCH" && segments[0] === "users" && segments[1] === "me" && segments[2] === "travel-profile") {
    Object.assign(state.travelProfile, parsedBody());
    return ok(state.travelProfile);
  }
  if (method === "GET" && segments[0] === "users" && segments[1] === "me" && segments[2] === "bookings") {
    const status = params.get("status") === "past" ? "past" : "upcoming";
    const pageSize = Number(params.get("page_size")) || 20;
    return ok(paginate(bookingsForStatus(status), 1, pageSize));
  }

  // --- Bookings ---
  if (method === "POST" && segments[0] === "bookings" && segments.length === 1) {
    const b = parsedBody();
    const booking = createBooking(
      Number(b.trip_id),
      Number(b.trip_category_id),
      (b.participants as { full_name: string }[]) ?? []
    );
    return ok(booking, 201);
  }

  // --- Payments ---
  if (method === "POST" && segments[0] === "payments" && segments[1] === "create-intent") {
    const b = parsedBody();
    const booking = state.bookings.find((bk) => bk.id === Number(b.booking_id));
    return ok({
      payment_id: 1,
      client_secret: "mock_client_secret",
      amount_cents: booking?.total_amount_cents ?? 0,
    });
  }

  // --- Contact / newsletter ---
  if (method === "POST" && segments[0] === "contact") {
    return ok(undefined, 204);
  }
  if (method === "POST" && segments[0] === "newsletter") {
    return ok(undefined, 204);
  }

  // --- Admin (not the focus of this static demo — minimal stubs) ---
  if (segments[0] === "admin") {
    if (method === "POST" && segments[1] === "auth" && segments[2] === "login") {
      return ok({ user: { ...state.user, role: "admin", email: DEMO_EMAIL }, tokens: fakeTokens() });
    }
    if (method === "GET" && segments[1] === "auth" && segments[2] === "me") {
      return ok({ ...state.user, role: "admin" });
    }
    if (method === "POST" && (segments[2] === "logout" || segments[1] === "logout")) {
      return ok(undefined, 204);
    }
    if (method === "GET") {
      return ok(paginate([], 1, 20));
    }
    return ok(undefined, 204);
  }

  return error(501, "NOT_IMPLEMENTED", `No mock for ${method} ${pathname}`);
}

// Exported only so a login form could reference the demo credentials if
// ever needed — the mock accepts any email/password combination.
export const DEMO_CREDENTIALS = { email: DEMO_EMAIL, password: DEMO_PASSWORD };
