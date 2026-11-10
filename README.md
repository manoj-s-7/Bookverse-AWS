# BOOKVERSE

Every book opens a new world. React + TypeScript + Vite + Tailwind + React Router + Lucide.

## Run locally (Node.js 18+)

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # type-check + production build into dist/
    npm run preview

## Adding your API keys later
1. `cp .env.example .env`
2. Set `VITE_DATA_MODE=live`. Optionally set `VITE_GOOGLE_BOOKS_API_KEY`.
3. Restart `npm run dev`. No code changes needed.

Open Library needs no key. Vite bakes `VITE_*` values into the browser bundle, so never put a private secret there; a provider that needs one requires a small proxy.
For Docker, pass the values at build time. Vite embeds `VITE_*` values into the browser bundle, so the Google key must be restricted to your deployed domains:

    docker build --build-arg VITE_DATA_MODE=live --build-arg VITE_GOOGLE_BOOKS_API_KEY=xxx -t bookverse .
    docker run --rm -p 8080:80 bookverse

The Google key is not a private server-side secret in this frontend architecture; use Google Cloud HTTP referrer restrictions and API restrictions.

## Docker

    docker build -t bookverse .
    docker run -p 8080:80 bookverse     # http://localhost:8080  (health: /health)

AWS steps are in DEPLOYMENT.md.

## Structure
- `src/services/`: apiClient, openLibraryAdapter, googleBooksAdapter, gutendexAdapter (stub), bookService, authorService. Components only see the normalized `Book` model.
- `src/lib/`: localStorage stores (library, collections), hooks (debounce, abortable async).
- `src/pages/`: Discover, Explore, BookPage, Authors, AuthorPage, Library, Collections.

## Known limits
- Live mode has not been tested against the real APIs in this build environment (no outbound access to them); expect to check field mapping on first run.
- Discover homepage content is editorial mock content in both modes.
- TanStack Query, Zustand, Framer Motion were not used: a small hook, a tiny store and CSS covered the need.
- No search suggestions dropdown, no edition lists, Gutendex not wired in.
