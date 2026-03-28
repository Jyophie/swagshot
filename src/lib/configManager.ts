import fs from "fs/promises";
import path from "path";
import { SwagShotConfig } from "./types.js";

export const CONFIG_FILE = ".swagshot.json";

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function dirExists(dirPath: string): Promise<boolean> {
  try {
    const stat = await fs.stat(dirPath);
    return stat.isDirectory();
  } catch {
    return false;
  }
}

export async function readConfig(root: string): Promise<SwagShotConfig | null> {
  const configPath = path.join(root, CONFIG_FILE);
  if (!(await fileExists(configPath))) return null;
  const raw = await fs.readFile(configPath, "utf-8");
  return JSON.parse(raw) as SwagShotConfig;
}

export async function writeConfig(root: string, config: SwagShotConfig): Promise<void> {
  const configPath = path.join(root, CONFIG_FILE);
  await fs.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
}

export async function updateConfig(
  root: string,
  updates: Record<string, string | null>
): Promise<SwagShotConfig> {
  const config = await readConfig(root);
  if (!config) throw new Error("설정 파일이 없습니다. 'swagshot init'을 먼저 실행하세요.");

  for (const [key, value] of Object.entries(updates)) {
    if (key in config.project) {
      (config.project as Record<string, unknown>)[key] = value;
    } else if (key in config.style) {
      (config.style as Record<string, unknown>)[key] = value;
    }
  }

  await writeConfig(root, config);
  return config;
}
