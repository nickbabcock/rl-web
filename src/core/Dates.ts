// Rocket league dates look like "2016-12-08 17-20-20".
// We can poor man parse it easily enough
export function extractDate(input: string): Date {
  const [y, m, d] = input
    .split(" ")[0]
    .split("-")
    .map(x => parseInt(x, 10));
  return new Date(y, m - 1, d);
}
