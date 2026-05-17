<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## 🚀 Project Vision
All development MUST follow the [PROJECT_VISION.md](../PROJECT_VISION.md) (or root `/PROJECT_VISION.md`) blueprint. This includes offline-first architecture, component discipline, and the FastAPI backend strategy.

## 🧩 Component-First Rule (CRITICAL)
**Future features must be added as isolated, composable components — never as rewrites of the main codebase.**

- ✅ New feature → new component in `src/features/<feature>/` or `src/shared/components/`
- ✅ Wire it into existing pages with a single import + JSX node
- ✅ Reuse `ImageUploadWithPreview`, `ClinicSidebar`, `Breadcrumbs`, etc. instead of re-implementing
- ❌ Do NOT rewrite `dashboard/page.tsx`, `reception/page.tsx`, or other large existing pages
- ❌ Do NOT change shared API client signatures, state-store shapes, or routing without a strong reason
- ❌ Do NOT touch business logic, API calls, or data flow when the task is "make it look better" — only restructure HTML/Tailwind classes

The codebase is **LIVE on Vercel + Render**. Breaking existing flows costs real users. When in doubt, build a new component beside the old code, not in place of it.

## 📱 Mobile-First Rule
All 3 projects (frontend, admin, reception) must look and feel like a native app on mobile.
- Design mobile layout first, then enhance for tablet/desktop with `md:`/`lg:` Tailwind prefixes
- Touch targets ≥ 44px (use `py-3` or larger on buttons)
- Sticky bottom-nav or bottom-CTA on mobile, sidebar only on `md+`
- Never assume hover — every hover state needs an active/tap equivalent
- Test in browser DevTools at 375px (iPhone SE) before declaring done

## 🌐 Live Deployment
- Frontend: Vercel (https://clinicsathi-frontend.vercel.app)
- Backend:  Render (https://clinicsathi-backend.onrender.com) — free tier sleeps after 15 min idle; first request can take 30–45 s
- Admin:    separate Vercel deployment

`apiClient.ts` already handles cold-start timeouts (45 s) and surfaces `NetworkError` with a user-friendly message. Don't shorten this timeout.
<!-- END:nextjs-agent-rules -->
