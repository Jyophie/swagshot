"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchSwaggerSpec = fetchSwaggerSpec;
exports.getControllerTags = getControllerTags;
exports.filterByTag = filterByTag;
const axios_1 = __importDefault(require("axios"));
const promises_1 = __importDefault(require("fs/promises"));
const configManager_js_1 = require("./configManager.js");
async function fetchSwaggerSpec(input) {
    // Local file
    if (!input.startsWith("http")) {
        if (!(await (0, configManager_js_1.fileExists)(input))) {
            throw new Error(`파일을 찾을 수 없습니다: ${input}`);
        }
        const raw = await promises_1.default.readFile(input, "utf-8");
        return JSON.parse(raw);
    }
    // Remote URL
    const response = await axios_1.default.get(input, {
        headers: { Accept: "application/json" },
        timeout: 10000,
    });
    return response.data;
}
function getControllerTags(spec) {
    const tags = new Set();
    for (const pathItem of Object.values(spec.paths)) {
        for (const op of Object.values(pathItem)) {
            if (op?.tags) {
                for (const tag of op.tags)
                    tags.add(tag);
            }
        }
    }
    return Array.from(tags);
}
function filterByTag(spec, tag, includeDeprecated = false) {
    const filteredPaths = {};
    for (const [pathKey, pathItem] of Object.entries(spec.paths)) {
        const filteredItem = {};
        for (const [method, op] of Object.entries(pathItem)) {
            if (!op?.tags?.includes(tag))
                continue;
            if (!includeDeprecated && op.deprecated)
                continue;
            filteredItem[method] = op;
        }
        if (Object.keys(filteredItem).length > 0) {
            filteredPaths[pathKey] = filteredItem;
        }
    }
    return { ...spec, paths: filteredPaths };
}
//# sourceMappingURL=fetchSwagger.js.map