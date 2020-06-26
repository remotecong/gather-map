const API_URL = process.env.API_URL || "http://localhost:7712/tulsa";

export async function lookupAll(addresses) {
  const res = await fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(addresses),
  });
  return await res.json();
}
