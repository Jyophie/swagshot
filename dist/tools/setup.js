"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSetup = handleSetup;
const path_1 = __importDefault(require("path"));
const configManager_js_1 = require("../lib/configManager.js");
const detectStructure_js_1 = require("../lib/detectStructure.js");
async function handleSetup(projectRoot) {
    const root = projectRoot ?? process.cwd();
    const existing = await (0, configManager_js_1.readConfig)(root);
    if (existing) {
        return [
            "✅ 이미 설정이 있습니다:",
            "```json",
            JSON.stringify(existing, null, 2),
            "```",
            "",
            "변경하려면 `swagger_config_update` 툴을 사용하거나,",
            "수정할 항목을 알려주세요. 예) 'apiDir를 src/services로 바꿔줘'",
        ].join("\n");
    }
    const detected = await (0, detectStructure_js_1.detectProjectStructure)(root);
    const config = {
        version: "1",
        project: {
            root,
            apiDir: detected.apiDir ?? "src/api",
            typesDir: detected.typesDir ?? "src/types",
            hooksDir: detected.hooksDir,
            outputDir: detected.apiDir ?? "src/api",
        },
        style: {
            httpClient: detected.httpClient ?? "axios",
            axiosInstance: detected.axiosInstance,
            queryLibrary: detected.queryLibrary,
            namingConvention: "camelCase",
        },
    };
    await (0, configManager_js_1.writeConfig)(root, config);
    const lines = [
        "👋 swagshot 초기 설정 완료!",
        "",
        `📂 프로젝트 루트: ${root}`,
        `📁 설정 파일: ${path_1.default.join(root, configManager_js_1.CONFIG_FILE)}`,
        "",
        "감지된 설정:",
        `  • API 함수 폴더:   ${config.project.apiDir}${detected.apiDir ? " ✅ 자동 감지" : " ⚠️ 기본값 (수정 가능)"}`,
        `  • 타입 정의 폴더:  ${config.project.typesDir}${detected.typesDir ? " ✅ 자동 감지" : " ⚠️ 기본값 (수정 가능)"}`,
        `  • 훅 폴더:         ${config.project.hooksDir ?? "없음"}${detected.hooksDir ? " ✅ 자동 감지" : ""}`,
        `  • HTTP 클라이언트: ${config.style.httpClient}${detected.httpClient ? " ✅ 자동 감지" : " ⚠️ 기본값"}`,
        `  • Query 라이브러리: ${config.style.queryLibrary ?? "없음"}${detected.queryLibrary ? " ✅ 자동 감지" : ""}`,
        detected.axiosInstance ? `  • Axios 인스턴스:  ${config.style.axiosInstance} ✅ 자동 감지` : "",
        "",
        "잘못된 항목이 있으면 알려주세요.",
        "예) 'typesDir는 src/types/api야'",
        "",
        "이제 `swagger_sync` 툴로 코드를 생성할 수 있습니다!",
    ].filter((l) => l !== undefined);
    return lines.join("\n");
}
//# sourceMappingURL=setup.js.map