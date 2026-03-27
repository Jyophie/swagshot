"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateCommand = generateCommand;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const configManager_1 = require("../../lib/configManager");
const fetchSwagger_1 = require("../../lib/fetchSwagger");
const codeGenerator_1 = require("../../lib/codeGenerator");
async function generateCommand(options) {
    const root = process.cwd();
    const config = await (0, configManager_1.readConfig)(root);
    if (!config) {
        console.error("❌ 설정 파일이 없습니다. 먼저 실행하세요: swagshot init");
        process.exit(1);
    }
    console.log(`\n📡 Swagger 스펙 가져오는 중... ${options.url}`);
    let spec;
    try {
        spec = await (0, fetchSwagger_1.fetchSwaggerSpec)(options.url);
    }
    catch (e) {
        console.error(`❌ Swagger 스펙을 가져오지 못했습니다.\n${e instanceof Error ? e.message : String(e)}`);
        process.exit(1);
    }
    const allTags = (0, fetchSwagger_1.getControllerTags)(spec);
    // 태그 미지정 시 목록 출력 후 종료
    if (!options.tag && !options.all) {
        console.log("\n📋 사용 가능한 컨트롤러 태그:");
        allTags.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
        console.log("\n사용법:");
        console.log(`  swagshot generate --url "${options.url}" --tag <태그명>`);
        console.log(`  swagshot generate --url "${options.url}" --all`);
        return;
    }
    const tagsToProcess = options.all ? allTags : [options.tag];
    const writtenFiles = [];
    for (const tag of tagsToProcess) {
        if (!allTags.includes(tag)) {
            console.error(`❌ 태그를 찾을 수 없습니다: "${tag}"`);
            console.log("사용 가능한 태그:", allTags.join(", "));
            process.exit(1);
        }
        const filteredSpec = (0, fetchSwagger_1.filterByTag)(spec, tag, options.includeDeprecated ?? false);
        const endpointCount = Object.values(filteredSpec.paths).reduce((acc, item) => acc + Object.keys(item).length, 0);
        if (endpointCount === 0)
            continue;
        const baseName = tag.replace(/-controller$/, "");
        // types 파일 생성
        const typesContent = (0, codeGenerator_1.generateTypes)(filteredSpec, tag);
        const typesDir = path_1.default.join(root, config.project.typesDir);
        await promises_1.default.mkdir(typesDir, { recursive: true });
        const typesFile = path_1.default.join(typesDir, `${baseName}.ts`);
        await promises_1.default.writeFile(typesFile, typesContent, "utf-8");
        writtenFiles.push(typesFile);
        // api 파일 생성
        const apiContent = (0, codeGenerator_1.generateApiFile)(filteredSpec, tag, config);
        const apiDir = path_1.default.join(root, config.project.outputDir);
        await promises_1.default.mkdir(apiDir, { recursive: true });
        const apiFile = path_1.default.join(apiDir, `${baseName}.ts`);
        await promises_1.default.writeFile(apiFile, apiContent, "utf-8");
        writtenFiles.push(apiFile);
        console.log(`\n✅ ${tag} (${endpointCount}개 엔드포인트)`);
    }
    if (writtenFiles.length === 0) {
        console.log("⚠️  생성된 파일이 없습니다.");
        return;
    }
    console.log(`\n📁 생성된 파일 (${writtenFiles.length}개):`);
    writtenFiles.forEach(f => console.log(`  - ${path_1.default.relative(root, f)}`));
}
//# sourceMappingURL=generate.js.map