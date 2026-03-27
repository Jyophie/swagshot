"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initCommand = initCommand;
const path_1 = __importDefault(require("path"));
const readline = __importStar(require("readline/promises"));
const process_1 = require("process");
const configManager_1 = require("../../lib/configManager");
const detectStructure_1 = require("../../lib/detectStructure");
async function initCommand(options) {
    const root = path_1.default.resolve(options.root ?? process.cwd());
    const existing = await (0, configManager_1.readConfig)(root);
    if (existing) {
        console.log("\n✅ 이미 설정 파일이 있습니다:");
        console.log(JSON.stringify(existing, null, 2));
        console.log("\n변경하려면: swagshot config set <key> <value>");
        return;
    }
    console.log("\n👋 swagshot 초기 설정을 시작합니다.");
    console.log(`📂 프로젝트 루트: ${root}\n`);
    const detected = await (0, detectStructure_1.detectProjectStructure)(root);
    const rl = readline.createInterface({ input: process_1.stdin, output: process_1.stdout });
    async function ask(question, defaultValue) {
        const answer = await rl.question(`${question} (기본값: ${defaultValue}): `);
        return answer.trim() || defaultValue;
    }
    console.log("자동 감지 결과를 확인해주세요. Enter를 누르면 기본값 사용:\n");
    const swaggerUrl = await ask("Swagger JSON URL", "");
    const apiDir = await ask("API 함수 폴더", detected.apiDir ?? "src/api");
    const typesDir = await ask("타입 정의 폴더", detected.typesDir ?? "src/types");
    const hooksDir = await ask("훅 폴더 (없으면 빈칸)", detected.hooksDir ?? "");
    const httpClient = await ask("HTTP 클라이언트 (axios/fetch)", detected.httpClient ?? "axios");
    const axiosInstance = httpClient === "axios"
        ? await ask("axios 인스턴스 파일 경로 (없으면 빈칸)", detected.axiosInstance ?? "")
        : "";
    const queryLibrary = await ask("Query 라이브러리 (react-query/swr/없으면 빈칸)", detected.queryLibrary ?? "");
    rl.close();
    const config = {
        version: "1",
        project: {
            root,
            apiDir,
            typesDir,
            hooksDir: hooksDir || null,
            outputDir: apiDir,
        },
        style: {
            httpClient: httpClient,
            axiosInstance: axiosInstance || null,
            queryLibrary: (queryLibrary || null),
            namingConvention: "camelCase",
        },
        swagger: {
            url: swaggerUrl || null,
        },
    };
    await (0, configManager_1.writeConfig)(root, config);
    console.log(`\n✅ 설정 완료! ${path_1.default.join(root, configManager_1.CONFIG_FILE)} 저장됨`);
    console.log("\n이제 코드를 생성할 수 있습니다:");
    if (swaggerUrl) {
        console.log(`  swagshot list --url "${swaggerUrl}"`);
        console.log(`  swagshot generate --url "${swaggerUrl}" --tag <컨트롤러명>`);
    }
    else {
        console.log(`  swagshot list --url <swagger-json-url>`);
        console.log(`  swagshot generate --url <swagger-json-url> --tag <컨트롤러명>`);
    }
}
//# sourceMappingURL=init.js.map