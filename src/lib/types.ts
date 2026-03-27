export interface SwagShotConfig {
  version: string;
  project: {
    root: string;
    apiDir: string;
    typesDir: string;
    hooksDir: string | null;
    outputDir: string;
  };
  style: {
    httpClient: "axios" | "fetch";
    axiosInstance: string | null;
    queryLibrary: "react-query" | "swr" | null;
    namingConvention: "camelCase" | "snake_case";
  };
  swagger?: {
    url: string | null;
  };
}

export interface DetectedStructure {
  apiDir: string | null;
  typesDir: string | null;
  hooksDir: string | null;
  httpClient: "axios" | "fetch" | null;
  queryLibrary: "react-query" | "swr" | null;
  axiosInstance: string | null;
}

export interface SwaggerSpec {
  openapi?: string;
  swagger?: string;
  info: { title: string; version: string };
  paths: Record<string, PathItem>;
  // OpenAPI 3.0
  components?: {
    schemas?: Record<string, SchemaObject>;
  };
  // Swagger 2.0 (Spring Boot / springfox)
  definitions?: Record<string, SchemaObject>;
  tags?: Array<{ name: string; description?: string }>;
}

export interface PathItem {
  get?: Operation;
  post?: Operation;
  put?: Operation;
  patch?: Operation;
  delete?: Operation;
}

export interface Operation {
  tags?: string[];
  operationId?: string;
  summary?: string;
  deprecated?: boolean;
  parameters?: Parameter[];
  requestBody?: RequestBody;
  responses: Record<string, Response>;
}

export interface Parameter {
  name: string;
  in: "query" | "path" | "header" | "cookie" | "body" | "formData";
  required?: boolean;
  description?: string;
  // OpenAPI 3.0
  schema?: SchemaObject;
  // Swagger 2.0 direct fields (no nested schema)
  type?: string;
  format?: string;
  items?: SchemaObject;
  enum?: unknown[];
  collectionFormat?: string;
}

export interface RequestBody {
  required?: boolean;
  content?: Record<string, { schema?: SchemaObject }>;
}

export interface Response {
  description?: string;
  schema?: SchemaObject; // Swagger 2.0
  content?: Record<string, { schema?: SchemaObject }>; // OpenAPI 3.0
}

export interface SchemaObject {
  type?: string;
  format?: string;
  $ref?: string;
  items?: SchemaObject;
  properties?: Record<string, SchemaObject>;
  required?: string[];
  enum?: unknown[];
  description?: string;
  nullable?: boolean;
  allOf?: SchemaObject[];
  oneOf?: SchemaObject[];
  anyOf?: SchemaObject[];
  additionalProperties?: boolean | SchemaObject;
}
