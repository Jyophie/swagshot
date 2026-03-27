"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configCommand = configCommand;
const configManager_1 = require("../../lib/configManager");
async function configCommand(action, key, value) {
    if (action !== "set") {
        console.error(`❌ 알 수 없는 액션: ${action}. 사용 가능: set`);
        process.exit(1);
    }
    const root = process.cwd();
    const config = await (0, configManager_1.readConfig)(root);
    if (!config) {
        console.error("❌ 설정 파일이 없습니다. 먼저 실행하세요: swagshot init");
        process.exit(1);
    }
    const parsedValue = value === "null" ? null : value;
    if (key in config.project) {
        config.project[key] = parsedValue;
    }
    else if (key in config.style) {
        config.style[key] = parsedValue;
    }
    else if (key === "swaggerUrl" || key === "url") {
        config.swagger = { ...config.swagger, url: parsedValue };
    }
    else {
        console.error(`❌ 알 수 없는 설정 키: ${key}`);
        console.log("사용 가능한 키: apiDir, typesDir, hooksDir, outputDir, httpClient, axiosInstance, queryLibrary, swaggerUrl");
        process.exit(1);
    }
    await (0, configManager_1.writeConfig)(root, config);
    console.log(`✅ ${key} = ${value}`);
}
//# sourceMappingURL=config.js.map