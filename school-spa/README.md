# school-spa

SPA for managing students and classes built with Vue 3, Vite, Quasar, Pinia, and Vue Router.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev

The app runs at `http://localhost:5173`.

### Features

- Students list with add/edit/delete
- Classes list with student counts
- Class details with assign/remove students
- Global state in Pinia

### Tech

- Vue 3 + TypeScript + Vite
- Quasar UI (Vite plugin)
- Pinia (global store)
- Vue Router (SPA)

### Git Workflow

- Feature branches: `feat/<scope>` (e.g., `feat/quasar-setup`)
- Conventional commits (e.g., `feat(students): add CRUD view`)
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
