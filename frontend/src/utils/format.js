export function formatMetricLabel(key) {
  return key.replace(/([A-Z])/g, " $1").replace(/^./, (char) => char.toUpperCase());
}
