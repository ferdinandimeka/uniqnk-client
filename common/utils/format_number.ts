export default function formatNumber(number: number) {
  if (number == null) return "";
  if (number < 1_000) return number;
  if (number < 1_000_000) return Math.floor(number / 100) / 10 + "k";
  return Math.floor(number / 100_000) / 10 + "M";
}