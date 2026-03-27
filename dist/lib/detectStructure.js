"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.detectProjectStructure = detectProjectStructure;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const configManager_js_1 = require("./configManager.js");
async function detectProjectStructure(root) {
    const candidates = {
        apiDir: ["api", "apis", "src/api", "src/apis", "src/services", "src/lib/api", "src/fetchers"],
        typesDir: ["types", "types/api", "src/types/api", "src/types", "src/@types", "src/models", "src/interfaces"],
        hooksDir: ["hooks", "hooks/api", "src/hooks/api", "src/hooks/queries", "src/hooks", "src/queries"],
    };
    const detected = {
        apiDir: null,
        typesDir: null,
        hooksDir: null,
        httpClient: null,
        queryLibrary: null,
        axiosInstance: null,
    };
    for (const [key, paths] of Object.entries(candidates)) {
        for (const p of paths) {
            if (await (0, configManager_js_1.dirExists)(path_1.default.join(root, p))) {
                detected[key] = p;
                break;
            }
        }
    }
    // Detect from package.json
    const pkgPath = path_1.default.join(root, "package.json");
    if (await (0, configManager_js_1.fileExists)(pkgPath)) {
        const pkg = JSON.parse(await promises_1.default.readFile(pkgPath, "utf-8"));
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
            if (await (0, configManager_js_1.fileExists)(path_1.default.join(root, p))) {
                detected.axiosInstance = p;
                break;
            }
        }
    }
    return detected;
}
//# sourceMappingURL=detectStructure.js.map