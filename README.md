# NOVA Hair Studio — demo website

Demo-сайт для парикмахерской в Риге. Собран как пример того, что можно
показать владельцу салона: не шаблон, а рабочий прототип с реальной логикой
записи, тремя языками и адаптацией под телефон.

## Стек

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript**
- **Tailwind CSS 4** (через `@tailwindcss/postcss`, без `tailwind.config`, тема в `globals.css`)
- Локальные шрифты через `@fontsource` (Tenor Sans + Onest Variable), без обращений к Google Fonts в проде
- Ноль внешних UI-библиотек — все иконки и «пряди волос» в шапке нарисованы SVG вручную

## Быстрый старт

```bash
npm install
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000) — редиректнёт на `/lv`
(или на `/en` / `/ru`, если в браузере другой язык по умолчанию).

Другие команды:

```bash
npm run build      # прод-сборка
npm run start       # прод-сервер после build
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

Node.js 20.9+ обязателен (используется в `engines`).

## Что реализовано

- **3 языка** — `/lv`, `/en`, `/ru`. Определение языка браузера через
  `Accept-Language` в `src/proxy.ts` (актуальная замена `middleware.ts` в
  Next.js 16), переключатель в шапке, `hreflang`-алтернативы и OG-локали в
  метаданных.
- **Живая запись на услугу** (`src/components/Booking.tsx`) — 4 шага:
  услуга → мастер → день/время → контакты. Свободные слоты считаются
  честно, с учётом расписания салона, выходных мастеров и уже «занятых»
  окон — логика в `src/lib/availability.ts`. Отправка идёт на
  `POST /api/booking` (`src/app/api/booking/route.ts`) с валидацией на
  сервере и honeypot-полем против ботов.
- **Быстрая запись в хиро-блоке** (`QuickBook.tsx`) — показывает ближайшие
  свободные окна прямо на первом экране и одним тапом передаёт выбор в
  основную форму записи через кастомное событие (`booking-events.ts`).
- **«Добавить в календарь»** — на экране успеха генерируется `.ics`-файл
  на лету (`src/lib/ics.ts`), без сторонних сервисов.
- **SEO и структурированные данные** — `sitemap.ts`, `robots.ts`,
  `manifest.ts`, JSON-LD `HairSalon` (адрес, телефон, часы работы) в
  `[lang]/layout.tsx`.
- **Доступность** — «skip to content», видимый `:focus-visible`,
  `aria-live` в блоке живых слотов, корректная разметка `details/summary`
  для FAQ, читаемые статусы шагов записи.
- **Безопасность** — заголовки `X-Content-Type-Options`,
  `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`
  (`next.config.ts`), honeypot, серверная ре-валидация слота и
  **rate limit** на `/api/booking` (`src/lib/rate-limit.ts`, 8
  запросов / 10 минут с одного IP — простой in-memory лимитер,
  для мультиинстанс-продакшена заменить на Redis/Upstash).
- **Превью при шаринге ссылки** — `[lang]/opengraph-image.tsx`
  генерирует OG-картинку 1200×630 на лету под каждый язык (заголовок
  услуги подставляется из словаря), плюс `apple-icon.tsx` для иконки
  на экране iPhone/iPad. Обе через `next/og`, без внешних файлов.
- **Отказоустойчивость** — `[lang]/error.tsx` (локализованный экран
  ошибки с кнопкой «повторить» и номером телефона) и корневой
  `global-error.tsx` на случай падения самого layout.

## Структура

```
src/
  app/
    [lang]/              # layout.tsx (метаданные, JSON-LD, шапка/подвал), page.tsx,
                          # error.tsx, opengraph-image.tsx
    api/booking/          # серверная валидация, rate limit и «бронирование»
    apple-icon.tsx, icon.svg, manifest.ts, sitemap.ts, robots.ts
    global-error.tsx, not-found.tsx
    globals.css           # тема Tailwind 4 (@theme), палитра, шрифты
  components/             # Header, Hero, Services, Team, Booking, Footer …
  lib/
    site.ts               # реквизиты компании, часы работы
    data.ts                # услуги и мастера
    availability.ts         # расчёт свободных слотов
    booking.ts              # валидация формы записи
    rate-limit.ts            # простой in-memory rate limiter для API
    i18n/                     # словари lv / en / ru + типы
  proxy.ts                 # редирект на язык браузера (Next.js 16 proxy)
```

## Как адаптировать под реального клиента

1. `src/lib/site.ts` — название, адрес, телефон, соцсети, часы работы.
2. `src/lib/data.ts` — список услуг, цены, длительность, мастера.
3. `src/lib/i18n/{lv,en,ru}.ts` — все тексты (можно убрать языки, которые
   не нужны, — тогда поправить `locales` в `src/lib/i18n/config.ts`).
4. `src/app/api/booking/route.ts` — сюда подключается реальный календарь
   (Google Calendar, Cal.com, amoCRM и т.п.) и отправка
   SMS/email-подтверждений вместо демо-логики.
5. Фото мастеров — сейчас вместо фотографий инициалы на цветном фоне
   (осознанное решение для демо без реальных снимков); при реальных фото
   меняется `components/Team.tsx`.

## Важно

Это демонстрационный проект. Реальных записей он не создаёт и никуда их
не сохраняет — бронирование только проверяет, что слот теоретически
свободен, и возвращает номер брони.
