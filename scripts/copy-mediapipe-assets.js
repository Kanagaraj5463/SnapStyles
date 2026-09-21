import { cp, mkdir, readdir } from "node:fs/promises";
import path from "node:path";

const source = path.resolve("node_modules/@mediapipe/selfie_segmentation");
const destination = path.resolve("public/mediapipe/selfie_segmentation");
const assetPattern = /\.(binarypb|data|js|tflite|wasm)$/;

await mkdir(destination, { recursive: true });
for (const file of await readdir(source)) {
  if (assetPattern.test(file)) {
    await cp(path.join(source, file), path.join(destination, file));
  }
}
