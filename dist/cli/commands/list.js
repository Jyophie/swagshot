"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listCommand = listCommand;
const fetchSwagger_1 = require("../../lib/fetchSwagger");
async function listCommand(options) {
    console.log(`\n📡 Swagger 스펙 가져오는 중... ${options.url}`);
    let spec;
    try {
        spec = await (0, fetchSwagger_1.fetchSwaggerSpec)(options.url);
    }
    catch (e) {
        console.error(`❌ Swagger 스펙을 가져오지 못했습니다.\n${e instanceof Error ? e.message : String(e)}`);
        process.exit(1);
    }
    const tags = (0, fetchSwagger_1.getControllerTags)(spec);
    if (tags.length === 0) {
        console.log("❌ 태그가 없습니다.");
        return;
    }
    console.log(`\n📋 컨트롤러 태그 목록 (${tags.length}개):\n`);
    tags.forEach((t, i) => console.log(`  ${i + 1}. ${t}`));
    console.log("\n사용법:");
    console.log(`  swagshot generate --url "${options.url}" --tag <태그명>`);
    console.log(`  swagshot generate --url "${options.url}" --all`);
}
//# sourceMappingURL=list.js.map