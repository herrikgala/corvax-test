import type { Handler } from "vite-plugin-mix";
import { readFileSync, writeFileSync } from "fs";
import { join, dirname, resolve } from "path";
import { fileURLToPath } from "url";
import getRawBody from "raw-body";

async function handleGetTemplate(req, res, next) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const data = readFileSync(
    join(__dirname, "./mock_backend/template.json"),
    "utf-8"
  );
  res.setHeader("Content-Type", "application/json");

  res.end(data);
}

async function handlePostTemplate(req, res, next) {
  let requestBody;
  try {
    requestBody = await getRawBody(req, {
      length: req.headers["content-length"],
      limit: "1mb",
      encoding: true,
    });
    const parsedBody = JSON.parse(requestBody);
    const __dirname = dirname(fileURLToPath(import.meta.url));
    // Writing template
    writeFileSync(
      resolve(__dirname, "./mock_backend/template.json"),
      JSON.stringify(parsedBody, null, 2)
    );

    res.end("saved");
  } catch (err) {
    console.error(err);
    res.statusCode = 500;
    return res.end("Internal Server Error");
  }
}

function handleGetData(req, res, next) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const data = readFileSync(
    join(__dirname, "./mock_backend/data.json"),
    "utf-8"
  );
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
