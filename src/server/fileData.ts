async function fetchFile(base: string, file: string): Promise<ArrayBuffer> {
  const url = file.startsWith("http") ? file : new URL(file, base);
  return fetch(url).then((x) => x.arrayBuffer());
}

export async function getFileData(req: Request): Promise<ArrayBuffer> {
  const form = await req.formData();
  const file = form.get("file");
  if (file === null) {
    throw new Error("file not provided");
  }

  if (typeof file === "string") {
    return fetchFile(req.url, file);
  } else {
    return file.arrayBuffer();
  }
}
