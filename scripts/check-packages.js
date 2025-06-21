#!/usr/bin/env node

import { readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = join(__dirname, "..", "packages");
const packages = ["core", "linter"];

console.log("🔍 Проверяю готовность пакетов к публикации...\n");

for (const pkg of packages) {
  const packageJsonPath = join(packagesDir, pkg, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  console.log(`📦 ${packageJson.name} v${packageJson.version}`);

  // Проверяем наличие необходимых полей
  const requiredFields = [
    "name",
    "version",
    "description",
    "license",
    "publishConfig",
  ];
  const missingFields = requiredFields.filter((field) => !packageJson[field]);

  if (missingFields.length > 0) {
    console.log(`❌ Отсутствуют поля: ${missingFields.join(", ")}`);
  } else {
    console.log("✅ Все необходимые поля присутствуют");
  }

  // Проверяем наличие dist папки
  try {
    const distPath = join(packagesDir, pkg, "dist");
    const fs = await import("fs");
    await fs.promises.access(distPath);
    console.log("✅ Папка dist существует");
  } catch {
    console.log("❌ Папка dist не найдена - запустите npm run build");
  }

  console.log("");
}

console.log("✨ Проверка завершена!");
