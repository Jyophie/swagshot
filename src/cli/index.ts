#!/usr/bin/env node
import { Command } from "commander";
import { initCommand } from "./commands/init";
import { generateCommand } from "./commands/generate";
import { listCommand } from "./commands/list";
import { configCommand } from "./commands/config";

const program = new Command();

program
  .name("swagshot")
  .description("Swagger-powered API & type generator")
  .version("0.1.0");

program
  .command("init")
  .description("프로젝트 초기 설정 (.swagshot.json 생성)")
  .option("--root <path>", "프로젝트 루트 경로 (기본값: 현재 디렉토리)")
  .action(initCommand);

program
  .command("generate")
  .description("Swagger 스펙으로 API 함수와 TypeScript 타입 생성")
  .requiredOption("--url <url>", "Swagger JSON URL 또는 파일 경로")
  .option("--tag <tag>", "생성할 컨트롤러 태그 (없으면 목록 표시)")
  .option("--all", "모든 컨트롤러 생성")
  .option("--include-deprecated", "deprecated 엔드포인트 포함")
  .action(generateCommand);

program
  .command("list")
  .description("Swagger 스펙의 컨트롤러 태그 목록 조회")
  .requiredOption("--url <url>", "Swagger JSON URL 또는 파일 경로")
  .action(listCommand);

program
  .command("config")
  .description("프로젝트 설정 변경")
  .argument("<action>", "set")
  .argument("<key>", "설정 키 (예: apiDir, typesDir, httpClient)")
  .argument("<value>", "설정 값")
  .action(configCommand);

program.parse();
