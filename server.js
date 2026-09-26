import { createServer } from "node:http";
import { readFileSync } from "node:fs";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { registerAppResource, registerAppTool, RESOURCE_MIME_TYPE } from "@modelcontextprotocol/ext-apps/server";
import { z } from "zod";

const PORT = Number(process.env.PORT || 8787);
const UI_URI = "ui://character-lab/v1.1.html";
const html = readFileSync(new URL("./public/character-lab.html", import.meta.url), "utf8");

function makeServer() {
  const server = new McpServer({ name: "Character Lab", version: "1.1.0" }, { capabilities: { tools: {} } });
  registerAppResource(server, "character-lab-ui", UI_URI, {}, async () => ({ contents: [{ uri: UI_URI, mimeType: RESOURCE_MIME_TYPE, text: html, _meta: { ui: { prefersBorder: false }, "openai/ui": { availableDisplayModes: ["inline", "fullscreen"] } } }] }));
  registerAppTool(server, "open_character_lab", { title: "เปิด Character Lab", description: "เปิดฟอร์ม Character Lab สำหรับสร้างตัวละครและภาพ", inputSchema: {}, _meta: { ui: { resourceUri: UI_URI }, "openai/outputTemplate": UI_URI } }, async () => ({ structuredContent: { ready: true }, content: [{ type: "text", text: "เปิด Character Lab แล้ว" }] }));
  registerAppTool(server, "create_character_image_request", {
    title: "สร้างภาพจาก Character Lab",
    description: "รับ Prompt และค่าฟอร์ม Character Lab เพื่อส่งต่อให้ ChatGPT ใช้สร้างภาพ",
    inputSchema: {
      prompt: z.string().min(1), prompt_en: z.string().optional(), form: z.record(z.any()).optional(), references: z.array(z.object({ key: z.string(), label: z.string(), hasImage: z.boolean() })).optional()
    },
    _meta: { ui: { visibility: ["app"] }, "openai/widgetAccessible": true }
  }, async ({ prompt, prompt_en, form, references }) => ({
    structuredContent: { prompt, prompt_en, form, references, action: "generate_image" },
    content: [{ type: "text", text: `คำขอสร้างภาพจาก Character Lab:\n${prompt}` }]
  }));
  return server;
}

createServer(async (req, res) => {
  if (req.url !== "/mcp") { res.writeHead(404).end("Not found"); return; }
  const server = makeServer();
  const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });
  res.on("close", () => { transport.close(); server.close(); });
  await server.connect(transport);
  await transport.handleRequest(req, res);
}).listen(PORT, () => console.log(`Character Lab MCP: http://localhost:${PORT}/mcp`));
