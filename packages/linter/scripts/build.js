const path = require('node:path')
const process = require('node:process')
const fs = require('fs-extra')

const TARGET_DIR = path.join(__dirname, '../dist')
const BINARY_NAME = process.platform === 'win32' ? 'ed-lint.exe' : 'ed-lint'
const BINARY_PATH = path.join(__dirname, '../target/release', BINARY_NAME)

async function build() {
  try {
    // Создаем dist директорию если её нет
    await fs.ensureDir(TARGET_DIR)

    // Копируем бинарный файл
    await fs.copy(BINARY_PATH, path.join(TARGET_DIR, BINARY_NAME))

    // Создаем wrapper скрипт
    const wrapperContent = `#!/usr/bin/env node
const { spawn } = require('child_process');
const path = require('path');
const process = require('process');

const binaryPath = path.join(__dirname, '${BINARY_NAME}');
const args = process.argv.slice(2);

const child = spawn(binaryPath, args, { stdio: 'inherit' });

child.on('exit', (code) => {
    process.exit(code);
});
`

    await fs.writeFile(path.join(TARGET_DIR, 'index.js'), wrapperContent)
    await fs.chmod(path.join(TARGET_DIR, 'index.js'), '755')

    // Используем stderr для вывода информации о сборке
    process.stderr.write('Build completed successfully!\n')
  }
  catch (error) {
    process.stderr.write(`Build failed: ${error.message}\n`)
    process.exit(1)
  }
}

build()
