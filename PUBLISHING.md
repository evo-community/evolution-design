# Публикация пакетов

Этот документ описывает процесс публикации пакетов в монорепозитории Evolution Design.

## Пакеты для публикации

Публикуются только пакеты из папки `packages/`:
- `@evod/core` - основная функциональность линтера
- `edlint` - CLI инструмент для линтинга

Пакет `@evod/kit` остается приватным и используется только внутри монорепозитория.

## Процесс публикации

### 1. Локальная подготовка

```bash
# Убедитесь, что все изменения зафиксированы
git status

# Соберите все пакеты
npm run build

# Проверьте готовность пакетов к публикации
npm run check-packages
```

### 2. Создание changeset

```bash
# Создайте changeset для описания изменений
npm run changeset
```

Выберите пакеты, которые изменились, и тип изменений:
- `patch` - исправления багов
- `minor` - новая функциональность (обратно совместимая)
- `major` - breaking changes

### 3. Автоматическая публикация через GitHub Actions

1. Создайте PR с вашими изменениями и changeset
2. После мерджа в `main`, GitHub Actions автоматически:
   - Создаст PR с обновлением версий
   - После мерджа этого PR опубликует пакеты в npm

### 4. Ручная публикация (если нужно)

Если автоматическая публикация не сработала или нужна экстренная публикация:

```bash
# Переключитесь на main и получите последние изменения
git checkout main
git pull origin main

# Убедитесь, что все зависимости установлены
npm ci

# Соберите пакеты
npm run build

# Проверьте готовность к публикации
npm run check-packages

# Опубликуйте пакеты
npm run release
```

## Настройка для первой публикации

### 1. Создайте NPM токен

1. Войдите в [npmjs.com](https://www.npmjs.com/)
2. Перейдите в настройки → Access Tokens
3. Создайте новый токен с правами "Automation"

### 2. Настройте GitHub Secrets

В настройках репозитория добавьте секрет:
- `NPM_TOKEN` - ваш NPM токен

### 3. Локальная настройка (для ручной публикации)

Для локальной публикации добавьте в `.npmrc`:

```
//registry.npmjs.org/:_authToken=YOUR_NPM_TOKEN
```

**Важно:** Никогда не коммитьте токен в репозиторий!

## Структура версионирования

Проект использует [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH`
- Все пакеты синхронизированы по версиям

## Полезные команды

```bash
# Создать changeset для новых изменений
npm run changeset

# Проверить статус текущих changesets
npm run changeset status

# Посмотреть, что будет опубликовано (без публикации)
npm run changeset:publish --dry-run

# Обновить версии пакетов (обычно делается через Release PR)
npm run changeset:version

# Опубликовать пакеты (ручная публикация)
npm run changeset:publish

# Полная публикация (сборка + публикация)
npm run release

# Собрать все пакеты
npm run build

# Очистить кеш сборки
npm run clean

# Проверить готовность к публикации
npm run check-packages

# Полная подготовка к релизу
npm run prepare-release
```

## Troubleshooting

### Проблемы с публикацией

1. **"403 Forbidden"** - проверьте NPM токен и права доступа
2. **"Package already exists"** - версия уже опубликована, обновите версию
3. **"Build failed"** - запустите `npm run build` и исправьте ошибки

### Откат публикации

```bash
# Откат последней версии (в течение 72 часов)
npm unpublish @evod/core@VERSION
npm unpublish edlint@VERSION

# Пометить версию как deprecated
npm deprecate @evod/core@VERSION "Reason for deprecation"
``` 