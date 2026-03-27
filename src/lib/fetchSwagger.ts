import axios from "axios";
import fs from "fs/promises";
import { fileExists } from "./configManager.js";
import { SwaggerSpec } from "./types.js";

export async function fetchSwaggerSpec(input: string): Promise<SwaggerSpec> {
  // Local file
  if (!input.startsWith("http")) {
    if (!(await fileExists(input))) {
      throw new Error(`파일을 찾을 수 없습니다: ${input}`);
    }
    const raw = await fs.readFile(input, "utf-8");
    return JSON.parse(raw) as SwaggerSpec;
  }

  // Remote URL
  const response = await axios.get<SwaggerSpec>(input, {
    headers: { Accept: "application/json" },
    timeout: 10000,
  });
  return response.data;
}

export function getControllerTags(spec: SwaggerSpec): string[] {
  const tags = new Set<string>();
  for (const pathItem of Object.values(spec.paths)) {
    for (const op of Object.values(pathItem)) {
      if (op?.tags) {
        for (const tag of op.tags) tags.add(tag);
      }
    }
  }
  return Array.from(tags);
}

export function filterByTag(spec: SwaggerSpec, tag: string, includeDeprecated = false): SwaggerSpec {
  const filteredPaths: SwaggerSpec["paths"] = {};

  for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
    const filteredItem: typeof pathItem = {};
    for (const [method, op] of Object.entries(pathItem)) {
      if (!op?.tags?.includes(tag)) continue;
      if (!includeDeprecated && op.deprecated) continue;
      (filteredItem as Record<string, unknown>)[method] = op;
    }
    if (Object.keys(filteredItem).length > 0) {
      filteredPaths[pathKey] = filteredItem;
    }
  }

  return { ...spec, paths: filteredPaths };
}
