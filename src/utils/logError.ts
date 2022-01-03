export function logError(e: unknown) {
  if (e instanceof Error) {
    console.error(e, e.stack);
  } else {
    console.error(e);
  }
}
