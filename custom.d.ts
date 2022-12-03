declare module "*.replay" {
  const content: string;
  export default content;
}

declare module "*.wasm" {
  const content: string;
  export default content;
}

declare module "*?module" {
  const content: WebAssembly.Module;
  export default content;
}
