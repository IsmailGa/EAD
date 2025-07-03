# EAD (Employees And Documents)

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

# Запуск проекта

## Запуск фронтенда

1. Установите зависимости:
   ```bash
   npm install
   ```
2. Запустите Vite:
   ```bash
   npm run dev
   ```

## Запуск mock-сервера (json-server) на порту 3001

1. Установите json-server (если не установлен):
   ```bash
   npm install json-server --save-dev
   ```
2. Запустите сервер:

   ```bash
   json-server --watch db.json --port 3001
   ```

3. Проверьте, что сервер доступен по адресу: [http://localhost:3001](http://localhost:3001)
