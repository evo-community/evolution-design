import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { defineCommand } from 'citty'
import fetch from 'node-fetch'

async function downloadFile(url: string, filePath: string) {
  const response = await fetch(url)
  const data = await response.text()
  fs.writeFileSync(filePath, data)
  console.log('Файл скачан')
}

const rootDir = process.cwd()
const filePath = path.join(rootDir, 'evo.config.new.ts')

async function initializeProject(architecture: string) {
  const fileUrl = `https://raw.githubusercontent.com/evo-community/evolution-design/templates/${architecture}/evo.config.ts`

  try {
    await downloadFile(fileUrl, filePath)
    console.log(`Файл конфигурации evo.config.ts для архитектуры ${architecture.toUpperCase()} успешно установлен в корневую директорию проекта.`)
    process.exit(0)
  }
  catch (error) {
    console.error('Ошибка при загрузке файла:', error)
    process.exit(1)
  }
}

export default defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize a fresh project',
  },
  args: {
    arch: {
      type: 'string',
      description: 'Укажите архитектуру (например, fsd или ddd)',
      required: true,
    },
  },
  async run({ args }) {
    const architecture = args.arch
    await initializeProject(architecture)
  },
})
