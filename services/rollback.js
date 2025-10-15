import axios from "axios";

export async function performRollback(approval) {
  const comp = approval.context?.compensation;
  if (!comp) throw new Error("No compensation descriptor found");

  if (comp.type === "http") {
    const res = await axios({
      method: comp.method || "POST",
      url: comp.url,
      data: comp.body || {},
      headers: comp.headers || {}
    });
    return res.data;
  }

  if (comp.type === "noop") {
    return { ok: true, reason: "noop" };
  }

  throw new Error(`Unsupported compensation type: ${comp.type}`);
}
