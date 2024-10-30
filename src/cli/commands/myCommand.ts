import fs from 'node:fs'
import process from 'node:process'
import { defineCommand } from 'citty'

export default defineCommand({
  meta: {
    name: 'myCommand',
    description: 'Описание вашей команды',
  },
  async run() {
    console.log('Ваша команда выполняется!')

    // // Создание файла evo.config.ts
    // fs.writeFileSync('evo.config1.ts', 'export default {\n  // Ваша конфигурация!\n}\n')

    // Обновление package.json
    const packageJsonPath = 'package.json'
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
    packageJson.scripts = {
      ...packageJson.scripts,
      'evo:init': 'test command for cli',
    }
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

    // Установка зависимости evolution-design
    // execSync('npm install evolution-design')

    console.log('Команда выполнена успешно!') // Сообщение о завершении
    process.exit(0)
  },
})
