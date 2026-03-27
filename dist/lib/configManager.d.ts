import { SwagShotConfig } from "./types.js";
export declare const CONFIG_FILE = ".swagshot.json";
export declare function fileExists(filePath: string): Promise<boolean>;
export declare function dirExists(dirPath: string): Promise<boolean>;
export declare function readConfig(root: string): Promise<SwagShotConfig | null>;
export declare function writeConfig(root: string, config: SwagShotConfig): Promise<void>;
export declare function updateConfig(root: string, updates: Record<string, string | null>): Promise<SwagShotConfig>;
//# sourceMappingURL=configManager.d.ts.map