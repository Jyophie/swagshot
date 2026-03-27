import path from "path";
import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { SwagShotConfig } from "../../lib/types";
import { readConfig, writeConfig, CONFIG_FILE } from "../../lib/configManager";
import { detectProjectStructure } from "../../lib/detectStructure";

export async function initCommand(options: { root?: string }) {
  const root = path.resolve(options.root ?? process.cwd());
  const existing = await readConfig(root);

  if (existing) {
    console.log("\n✅ 이미 설정 파일이 있습니다:");
    console.log(JSON.stringify(existing, null, 2));
    console.log("\n변경하려면: swagshot config set <key> <value>");
    return;
  }

  console.log("\n👋 swagshot 초기 설정을 시작합니다.");
  console.log(`📂 프로젝트 루트: ${root}\n`);

  const detected = await detectProjectStructure(root);

  const rl = readline.createInterface({ input, output });

  async function ask(question: string, defaultValue: string): Promise<string> {
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

  const config: SwagShotConfig = {
    version: "1",
    project: {
      root,
      apiDir,
      typesDir,
      hooksDir: hooksDir || null,
      outputDir: apiDir,
    },
    style: {
      httpClient: httpClient as "axios" | "fetch",
      axiosInstance: axiosInstance || null,
      queryLibrary: (queryLibrary || null) as "react-query" | "swr" | null,
      namingConvention: "camelCase",
    },
    swagger: {
      url: swaggerUrl || null,
    },
  };

  await writeConfig(root, config);

  console.log(`\n✅ 설정 완료! ${path.join(root, CONFIG_FILE)} 저장됨`);
  console.log("\n이제 코드를 생성할 수 있습니다:");
  if (swaggerUrl) {
    console.log(`  swagshot list --url "${swaggerUrl}"`);
    console.log(`  swagshot generate --url "${swaggerUrl}" --tag <컨트롤러명>`);
  } else {
    console.log(`  swagshot list --url <swagger-json-url>`);
    console.log(`  swagshot generate --url <swagger-json-url> --tag <컨트롤러명>`);
  }
}
