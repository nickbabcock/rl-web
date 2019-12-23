const subscriptions: ((file: File | string) => void)[] = [];
export function subscribeFile(callback: (file: File | string) => void) {
  subscriptions.push(callback);
}
export function publishFile(data: File | string) {
  for (const entry of subscriptions) {
    entry(data);
  }
}
