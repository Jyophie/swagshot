"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleConfigUpdate = handleConfigUpdate;
const configManager_js_1 = require("../lib/configManager.js");
async function handleConfigUpdate(updates) {
    const root = process.cwd();
    try {
        const config = await (0, configManager_js_1.updateConfig)(root, updates);
        return [
            "✅ 설정 업데이트 완료:",
            "```json",
            JSON.stringify(updates, null, 2),
            "```",
            "",
            "현재 설정:",
            "```json",
            JSON.stringify(config, null, 2),
            "```",
        ].join("\n");
    }
    catch (e) {
        return `❌ 설정 업데이트 실패: ${e instanceof Error ? e.message : String(e)}`;
    }
}
//# sourceMappingURL=configUpdate.js.map