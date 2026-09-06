# Handyman Website Template

A complete, production-ready website for a handyman or home-services business.
Next.js + Sanity CMS + Tailwind, deployable free.

**→ [SETUP.md](SETUP.md) walks you through it start to finish.** No coding
required; budget about two hours.

## What you get

- **Homepage** with featured services, testimonials, trust signals, and FAQs
- **Service pages** — one per trade, each with problems you solve, your
  approach, FAQs, and before/after photos
- **Service area page** with an interactive map of the neighborhoods you cover
- **Before/after gallery** — the most persuasive page on any trades website
- **Estimate request form** with photo upload, delivered to your inbox
- **Everything editable without code** through a visual CMS

Built for local SEO: per-service and per-neighborhood pages, `LocalBusiness`
structured data, and consistent name/address/phone throughout.

## Cost

Free on the starter plans of Sanity, Vercel, and Resend. A domain name is
~$12/year and is the only thing you must pay for.

> Vercel's Hobby plan is licensed for non-commercial use. If you're running this
> as a real business, budget $20/month for Vercel Pro.

## Tech

| Layer     | Choice                                        |
| --------- | --------------------------------------------- |
| Framework | Next.js 15 (App Router), React 19, TypeScript |
| Styling   | Tailwind CSS                                  |
| CMS       | Sanity v4                                     |
| Email     | Resend                                        |
| Maps      | Leaflet                                       |
| Hosting   | Vercel                                        |

## Quick start

```bash
git clone https://github.com/LucasWyatt/HandymanWebsite.git my-site
cd my-site
pnpm install
# create studio/.env and web/.env.local - see SETUP.md
pnpm dev
```

Website on http://localhost:3000, content editor on http://localhost:3333.

## Project layout

```
web/      Next.js site
studio/   Sanity Studio (content editing)
infra/    Optional Terraform for Vercel
docs/     Architecture and conventions
```

## Content model

| Type           | What it holds                                                            |
| -------------- | ------------------------------------------------------------------------ |
| `siteSettings` | Business name, phone, address, hours, service areas — read by every page |
| `service`      | One trade you offer, with problems, approach, FAQs                       |
| `neighborhood` | An area you serve; drives the service-area page and map                  |
| `galleryImage` | Before/after pair with a caption                                         |
| `testimonial`  | Customer review                                                          |
| `faq`          | General question and answer                                              |
| `page`         | Free-form pages such as About, Privacy, Terms                            |

Changing a schema means changing the matching GROQ query in
`web/src/lib/queries.ts` — the queries are hand-written field lists, not derived
from the schemas.

## Origin

This template is the codebase behind a working handyman business site, released
for reuse. It's been sanitized: business name, contact details, and CMS
credentials are placeholders for you to replace.

## License

MIT — use it commercially, modify it, no attribution required.
