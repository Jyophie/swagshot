import { SwaggerSpec } from "./types.js";
export declare function fetchSwaggerSpec(input: string): Promise<SwaggerSpec>;
export declare function getControllerTags(spec: SwaggerSpec): string[];
export declare function filterByTag(spec: SwaggerSpec, tag: string, includeDeprecated?: boolean): SwaggerSpec;
//# sourceMappingURL=fetchSwagger.d.ts.map