#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import * as tools from "./tools";
import * as resources from "./resources";
import * as prompts from "./prompts";
import { getVersion } from "./utils";
import { toolAnnotations } from "./tool-annotations";

const startServer = async () => {
  const server = new McpServer(
    {
      name: "timeweb-mcp-server",
      title: "Timeweb MCP Server",
      version: getVersion(),
    },
    {
      capabilities: {
        tools: {},
        resources: {},
        prompts: {},
      },
    }
  );

  Object.values(tools).forEach((tool: any) => {
    server.registerTool(
      tool.name,
      {
        title: tool.title,
        description: tool.description,
        inputSchema: tool.inputSchema,
        annotations: toolAnnotations(tool.name, tool.title),
      },
      tool.handler
    );
  });

  Object.values(resources).forEach((resource: any) => {
    server.registerResource(
      resource.name,
      resource.uri,
      {
        title: resource.title,
        description: resource.description,
      },
      resource.handler
    );
  });

  Object.values(prompts).forEach((prompt: any) => {
    server.registerPrompt(prompt.name, prompt.config, prompt.handler);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
};

startServer()
  .then(() => {
    // stdout is the JSON-RPC channel of the stdio transport; logs go to stderr.
    console.error("Timeweb MCP server started");
  })
  .catch((error) => {
    console.error("Failed to start Timeweb MCP server:", error);
    process.exit(1);
  });
