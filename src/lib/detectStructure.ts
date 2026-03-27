import fs from "fs/promises";
import path from "path";
import { DetectedStructure } from "./types.js";
import { dirExists, fileExists } from "./configManager.js";

export async function detectProjectStructure(root: string): Promise<DetectedStructure> {
  const candidates = {
    apiDir:   ["api", "apis", "src/api", "src/apis", "src/services", "src/lib/api", "src/fetchers"],
    typesDir: ["types", "types/api", "src/types/api", "src/types", "src/@types", "src/models", "src/interfaces"],
    hooksDir: ["hooks", "hooks/api", "src/hooks/api", "src/hooks/queries", "src/hooks", "src/queries"],
  };

  const detected: DetectedStructure = {
    apiDir: null,
    typesDir: null,
    hooksDir: null,
    httpClient: null,
    queryLibrary: null,
    axiosInstance: null,
  };

  for (const [key, paths] of Object.entries(candidates)) {
    for (const p of paths) {
      if (await dirExists(path.join(root, p))) {
        (detected as unknown as Record<string, unknown>)[key] = p;
        break;
      }
    }
  }

  // Detect from package.json
  const pkgPath = path.join(root, "package.json");
  if (await fileExists(pkgPath)) {
    const pkg = JSON.parse(await fs.readFile(pkgPath, "utf-8"));
    const deps = { ...pkg.dependencies, ...pkg.devDependencies };

    detected.httpClient = "axios" in deps ? "axios" : "fetch";
    detected.queryLibrary =
      "@tanstack/react-query" in deps
        ? "react-query"
        : "react-query" in deps
        ? "react-query"
        : "swr" in deps
        ? "swr"
        : null;
  }

  // Try to find axios instance file
  if (detected.httpClient === "axios") {
    const axiosCandidates = [
      "src/lib/axios.ts",
      "src/lib/api.ts",
      "src/utils/axios.ts",
      "src/api/client.ts",
      "src/config/axios.ts",
    ];
    for (const p of axiosCandidates) {
      if (await fileExists(path.join(root, p))) {
        detected.axiosInstance = p;
        break;
      }
    }
  }

  return detected;
}
