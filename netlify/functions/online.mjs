import { getStore } from "@netlify/blobs";

const TTL = 150000; // quá 150 giây không báo tín hiệu thì coi là đã rời trang
const J = (o, s = 200) => new Response(JSON.stringify(o), {
  status: s, headers: { "content-type": "application/json", "cache-control": "no-store" },
});

export default async (req) => {
  if (req.method !== "POST") return J({ error: "method" }, 405);
  let b; try { b = await req.json(); } catch { return J({ error: "bad json" }, 400); }
  const id = String(b.id || "");
  if (!/^[a-z0-9]{6,40}$/i.test(id)) return J({ error: "bad id" }, 400);

  const store = getStore("presence");
  const now = Date.now();
  const p = (await store.get("now", { type: "json" })) || {};
  for (const k of Object.keys(p)) if (now - p[k] > TTL) delete p[k];
  if (b.leave) delete p[id]; else p[id] = now;
  await store.setJSON("now", p);

  // tổng lượt truy cập: mỗi phiên mở trang tính 1 lần
  const v = (await store.get("visits", { type: "json" })) || { n: 0 };
  if (b.visit && !b.leave) { v.n += 1; await store.setJSON("visits", v); }
  return J({ online: Object.keys(p).length, visits: v.n });
};

export const config = { path: "/api/online" };
