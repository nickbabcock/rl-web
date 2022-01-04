const floatFormatter = new Intl.NumberFormat(undefined, {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatFloat(x: number) {
  return floatFormatter.format(x);
}
