"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONFIG_FILE = void 0;
exports.fileExists = fileExists;
exports.dirExists = dirExists;
exports.readConfig = readConfig;
exports.writeConfig = writeConfig;
exports.updateConfig = updateConfig;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
exports.CONFIG_FILE = ".swagshot.json";
async function fileExists(filePath) {
    try {
        await promises_1.default.access(filePath);
        return true;
    }
    catch {
        return false;
    }
}
async function dirExists(dirPath) {
    try {
        const stat = await promises_1.default.stat(dirPath);
        return stat.isDirectory();
    }
    catch {
        return false;
    }
}
async function readConfig(root) {
    const configPath = path_1.default.join(root, exports.CONFIG_FILE);
    if (!(await fileExists(configPath)))
        return null;
    const raw = await promises_1.default.readFile(configPath, "utf-8");
    return JSON.parse(raw);
}
async function writeConfig(root, config) {
    const configPath = path_1.default.join(root, exports.CONFIG_FILE);
    await promises_1.default.writeFile(configPath, JSON.stringify(config, null, 2), "utf-8");
}
async function updateConfig(root, updates) {
    const config = await readConfig(root);
    if (!config)
        throw new Error("설정 파일이 없습니다. swagger_setup을 먼저 실행하세요.");
    for (const [key, value] of Object.entries(updates)) {
        if (key in config.project) {
            config.project[key] = value;
        }
        else if (key in config.style) {
            config.style[key] = value;
        }
    }
    await writeConfig(root, config);
    return config;
}
//# sourceMappingURL=configManager.js.map