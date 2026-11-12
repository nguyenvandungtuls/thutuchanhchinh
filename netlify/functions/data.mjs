import { getStore } from "@netlify/blobs";
import { timingSafeEqual } from "node:crypto";

const KEYS = ["fee", "bank", "al", "tree"];
const eq = (a, b) => {
  a = Buffer.from(String(a || "")); b = Buffer.from(String(b || ""));
  return a.length === b.length && timingSafeEqual(a, b);
};
const J = (o, s = 200) => new Response(JSON.stringify(o), {
  status: s, headers: { "content-type": "application/json", "cache-control": "no-store" },
});
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

export default async (req) => {
  const admin = process.env.ADMIN_PASSWORD;   // bắt buộc
  const view = process.env.VIEW_PASSWORD;     // tùy chọn: để trống = ai có link cũng xem được
  if (!admin) return J({ error: "Chưa cấu hình ADMIN_PASSWORD" }, 500);

  const isAdmin = eq(req.headers.get("x-admin-key"), admin);
  const store = getStore("tknh");

  if (req.method === "POST") {                // chỉ quản trị viên được ghi
    if (!isAdmin) { await delay(1000); return J({ error: "unauthorized" }, 401); }
    let b; try { b = await req.json(); } catch { return J({ error: "bad json" }, 400); }
    if (b.action === "verify") return J({ ok: true });
    if (!KEYS.includes(b.key) || typeof b.data !== "object" || !b.data) return J({ error: "bad request" }, 400);
    await store.setJSON(b.key, b.data);
    return J({ ok: true });
  }

  if (req.method === "GET") {
    if (view && !isAdmin && !eq(req.headers.get("x-view-key"), view)) {
      await delay(1000); return J({ error: "unauthorized" }, 401);
    }
    const out = {};
    for (const k of KEYS) out[k] = await store.get(k, { type: "json" });
    return J(out);
  }
  return J({ error: "method" }, 405);
};

export const config = { path: "/api/data" };
