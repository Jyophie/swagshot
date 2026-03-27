import { SwaggerSpec, SchemaObject } from "./types.js";
import { SwagShotConfig } from "./types.js";
export declare function schemaToTS(schema: SchemaObject, schemas?: Record<string, SchemaObject>, indent?: number): string;
export declare function generateTypes(spec: SwaggerSpec, tag: string): string;
export declare function generateApiFile(spec: SwaggerSpec, tag: string, config: SwagShotConfig): string;
//# sourceMappingURL=codeGenerator.d.ts.map