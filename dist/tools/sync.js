"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSync = handleSync;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const configManager_js_1 = require("../lib/configManager.js");
const fetchSwagger_js_1 = require("../lib/fetchSwagger.js");
const codeGenerator_js_1 = require("../lib/codeGenerator.js");
async function handleSync(swaggerUrl, tag, includeDeprecated = false) {
    const root = process.cwd();
    const config = await (0, configManager_js_1.readConfig)(root);
    if (!config) {
        return [
            "⚠️ 프로젝트 설정이 없습니다.",
            "먼저 `swagger_setup` 툴을 실행해주세요.",
        ].join("\n");
    }
    let spec;
    try {
        spec = await (0, fetchSwagger_js_1.fetchSwaggerSpec)(swaggerUrl);
    }
    catch (e) {
        return `❌ Swagger 스펙을 가져오는 데 실패했습니다.\n${e instanceof Error ? e.message : String(e)}`;
    }
    // If no tag specified, list available tags
    if (!tag) {
        const tags = (0, fetchSwagger_js_1.getControllerTags)(spec);
        if (tags.length === 0) {
            return "❌ Swagger 스펙에 태그가 없습니다.";
        }
        if (tags.length === 1) {
            tag = tags[0];
        }
        else {
            return [
                "📋 사용 가능한 컨트롤러 태그:",
                ...tags.map((t, i) => `  ${i + 1}. ${t}`),
                "",
                "어떤 컨트롤러를 생성할까요?",
                "예) 'payment-controller 생성해줘'",
                "",
                "전체 생성하려면: 'all'",
            ].join("\n");
        }
    }
    // Handle 'all' tag
    const tagsToProcess = tag === "all" ? (0, fetchSwagger_js_1.getControllerTags)(spec) : [tag];
    const writtenFiles = [];
    for (const currentTag of tagsToProcess) {
        const filteredSpec = (0, fetchSwagger_js_1.filterByTag)(spec, currentTag, includeDeprecated);
        const endpointCount = Object.values(filteredSpec.paths).reduce((acc, item) => acc + Object.keys(item).length, 0);
        if (endpointCount === 0) {
            continue;
        }
        // Derive file name from tag
        const baseName = currentTag.replace(/-controller$/, "").replace(/-/g, "-");
        // Generate types
        const typesContent = (0, codeGenerator_js_1.generateTypes)(filteredSpec, currentTag);
        const typesDir = path_1.default.join(root, config.project.typesDir);
        await promises_1.default.mkdir(typesDir, { recursive: true });
        const typesFile = path_1.default.join(typesDir, `${baseName}.ts`);
        await promises_1.default.writeFile(typesFile, typesContent, "utf-8");
        writtenFiles.push(typesFile);
        // Generate API file
        const apiContent = (0, codeGenerator_js_1.generateApiFile)(filteredSpec, currentTag, config);
        const apiDir = path_1.default.join(root, config.project.outputDir);
        await promises_1.default.mkdir(apiDir, { recursive: true });
        const apiFile = path_1.default.join(apiDir, `${baseName}.ts`);
        await promises_1.default.writeFile(apiFile, apiContent, "utf-8");
        writtenFiles.push(apiFile);
    }
    if (writtenFiles.length === 0) {
        return `⚠️ 태그 '${tag}'에 해당하는 엔드포인트를 찾을 수 없습니다.`;
    }
    return [
        `✅ 코드 생성 완료!`,
        `📌 처리된 태그: ${tagsToProcess.join(", ")}`,
        `📁 생성된 파일 (${writtenFiles.length}개):`,
        ...writtenFiles.map((f) => `  - ${path_1.default.relative(root, f)}`),
        "",
        "생성된 코드를 확인하고 필요한 경우 수정해주세요.",
    ].join("\n");
}
//# sourceMappingURL=sync.js.map