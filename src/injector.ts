const subscriptions: ((file: File) => void)[] = [];
export function subscribeFile(callback: (file: File) => void) {
  subscriptions.push(callback);
}
export function publishFile(data: File) {
  for (const entry of subscriptions) {
    entry(data);
  }
}
