import type { Handler } from "vite-plugin-mix";
import { readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

async function handleGetTemplate(req, res, next) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const data = readFileSync(join(__dirname, "./template.json"), "utf-8");
  res.setHeader("Content-Type", "application/json");

  res.end(data);
}

function handlePostTemplate() {}

function handleGetData(req, res, next) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const data = readFileSync(join(__dirname, "./data.json"), "utf-8");
  res.setHeader("Content-Type", "application/json");

  res.end(data);
}

// Create the map of handlers
const handlers: { [path: string]: { [method: string]: Handler } } = {
  "/api/template": {
    GET: handleGetTemplate,
    POST: handlePostTemplate,
  },
  "/api/data": {
    GET: handleGetData,
  },
};

export const handler: Handler = (req, res, next) => {
  const pathHandlers = handlers[req.path];
  const methodHandler = pathHandlers ? pathHandlers[req.method] : undefined;

  if (methodHandler) {
    methodHandler(req, res, next);
  } else {
    next();
  }
};

async function sleep(arg: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, arg);
  });
}
