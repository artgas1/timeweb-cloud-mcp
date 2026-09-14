import type { ToolAnnotations } from "@modelcontextprotocol/sdk/types.js";

// Tool names follow `<verb>_<object>`, so the verb decides the hints.
// Read-only verbs were checked against the HTTP calls: every tool named
// list_/get_/check_ issues only GET requests, and no other tool does.
const READ_ONLY_VERBS = new Set(["list", "get", "check"]);

// Verbs that only add to the account and never remove or overwrite anything.
// Everything else (delete, update, set, reboot, shutdown, reset, transfer, ...)
// keeps destructiveHint: true, which is also the MCP default for unknown verbs.
const ADDITIVE_VERBS = new Set([
  "create",
  "add",
  "batch",
  "clone",
  "install",
  "link",
  "mount",
  "increase",
  "start",
]);

export const toolAnnotations = (name: string, title: string): ToolAnnotations => {
  const verb = name.split("_", 1)[0];
  const readOnly = READ_ONLY_VERBS.has(verb);
  return {
    title,
    readOnlyHint: readOnly,
    destructiveHint: !readOnly && !ADDITIVE_VERBS.has(verb),
    idempotentHint: readOnly,
    openWorldHint: true,
  };
};
