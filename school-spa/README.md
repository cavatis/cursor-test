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
- **Internationalization (PL/EN)** with language switcher
- **Responsive design** for mobile and desktop
- **Deployment ready** for Vercel/Netlify

### Tech

- Vue 3 + TypeScript + Vite
- Quasar UI (Vite plugin)
- Pinia (global store)
- Vue Router (SPA)
- Vue I18n (internationalization)
- Sass (styling)
- **Supabase** (Backend-as-a-Service with PostgreSQL)

### Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `env.example` to `.env.local` and fill in your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
4. Run the SQL schema in `supabase-schema.sql` in your Supabase SQL editor
5. The app will now use Supabase as the backend instead of local storage

### Deployment

#### Vercel
1. Install Vercel CLI: `npm install -g vercel`
2. Login: `vercel login`
3. Deploy: `vercel --prod`

#### Netlify
1. Install Netlify CLI: `npm install -g netlify-cli`
2. Login: `netlify login`
3. Deploy: `netlify deploy --prod --dir=dist`

#### Manual Deployment
1. Build: `npm run build`
2. Upload `dist/` folder to your hosting provider
3. Configure SPA routing (redirect all routes to `index.html`)

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
