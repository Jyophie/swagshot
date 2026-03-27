#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mcp_js_1 = require("@modelcontextprotocol/sdk/server/mcp.js");
const stdio_js_1 = require("@modelcontextprotocol/sdk/server/stdio.js");
const zod_1 = require("zod");
const setup_js_1 = require("./tools/setup.js");
const sync_js_1 = require("./tools/sync.js");
const configUpdate_js_1 = require("./tools/configUpdate.js");
// Workaround: cast server to any to avoid TS2589 deep type instantiation errors
// caused by the MCP SDK 1.28.x zod-compat union types (zod v3 | v4).
// The runtime behavior is fully correct.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const srv = new mcp_js_1.McpServer({ name: "swagshot", version: "0.1.0" });
// ── Tool: swagger_setup ───────────────────────────────────────────────────
srv.registerTool("swagger_setup", {
    description: "프로젝트 구조를 분석하고 swagshot 설정 파일(.swagshot.json)을 생성합니다. 처음 한 번만 실행하면 이후 자동으로 참고합니다.",
    inputSchema: {
        projectRoot: zod_1.z
            .string()
            .optional()
            .describe("레포 루트 경로 (없으면 현재 디렉토리 사용)"),
    },
}, async ({ projectRoot }) => {
    const result = await (0, setup_js_1.handleSetup)(projectRoot);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool: swagger_sync ────────────────────────────────────────────────────
srv.registerTool("swagger_sync", {
    description: "Swagger URL 또는 파일 경로를 받아 프로젝트 패턴에 맞게 API 함수와 TypeScript 타입을 생성합니다.",
    inputSchema: {
        swaggerUrl: zod_1.z
            .string()
            .describe("Swagger JSON URL 또는 로컬 파일 경로 (예: https://api.example.com/swagger.json)"),
        tag: zod_1.z
            .string()
            .optional()
            .describe("생성할 컨트롤러 태그 (없으면 사용 가능한 태그 목록 반환). 전체 생성 시 'all'"),
        includeDeprecated: zod_1.z
            .boolean()
            .optional()
            .describe("deprecated된 엔드포인트도 포함할지 여부 (기본값: false)"),
    },
}, async ({ swaggerUrl, tag, includeDeprecated }) => {
    const result = await (0, sync_js_1.handleSync)(swaggerUrl, tag, includeDeprecated);
    return { content: [{ type: "text", text: result }] };
});
// ── Tool: swagger_config_update ───────────────────────────────────────────
srv.registerTool("swagger_config_update", {
    description: "swagshot 프로젝트 설정을 업데이트합니다. (예: apiDir, typesDir, httpClient 등)",
    inputSchema: {
        updates: zod_1.z
            .record(zod_1.z.string().nullable())
            .describe('변경할 설정 키-값 쌍 (예: { "apiDir": "src/services", "httpClient": "fetch" })'),
    },
}, async ({ updates }) => {
    const result = await (0, configUpdate_js_1.handleConfigUpdate)(updates);
    return { content: [{ type: "text", text: result }] };
});
// ── Start server ──────────────────────────────────────────────────────────
const server = srv;
async function main() {
    const transport = new stdio_js_1.StdioServerTransport();
    await server.connect(transport);
    console.error("swagshot MCP server running on stdio");
}
main().catch((err) => {
    console.error("Fatal error:", err);
    process.exit(1);
});
//# sourceMappingURL=index.js.map