export default function plural(m) {
  if (!m) return m;
  if (m.endsWith("s")) return m + "es";
  if (/[^aeiou]y$/.test(m)) return m.slice(0, -1) + "ies";
  else return m + "s";
}

export function singular(m) {
  if (!m) return m;
  if (m.toLowerCase().endsWith("s")) {
    m = m.slice(0, -1);
    if (m.toLowerCase().endsWith("sse")) return m.slice(0, -1);
    return m;
  }
  return m;
}
