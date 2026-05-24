const fs = require("node:fs");
const path = require("node:path");

function ensureEnvFile(options = {}) {
  const cwd = options.cwd || process.cwd();
  const log = options.log || console.log;
  const envPath = path.join(cwd, ".env");
  const examplePath = path.join(cwd, ".env.example");

  if (fs.existsSync(envPath)) {
    log(".env already exists, skipping");
    return "exists";
  }

  if (!fs.existsSync(examplePath)) {
    throw new Error(".env.example not found");
  }

  fs.copyFileSync(examplePath, envPath);
  log(".env created from .env.example");
  return "created";
}

if (require.main === module) {
  ensureEnvFile();
}

module.exports = {
  ensureEnvFile
};
