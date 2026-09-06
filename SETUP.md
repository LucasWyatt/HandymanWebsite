# Setup Guide

This gets you from a fresh clone to a live website with your own name on it.

Budget about **two hours** the first time. Everything here runs on free plans —
you'll only pay for a domain name (~$12/year), and only when you're ready.

You do **not** need to know how to code. You do need to be comfortable copying
commands into a terminal and filling in web forms.

---

## What you're setting up

Four services, each free to start:

| Service    | What it does                                           | Cost               |
| ---------- | ------------------------------------------------------ | ------------------ |
| **Sanity** | Where you write your website's words and upload photos | Free               |
| **Vercel** | Puts the website on the internet                       | Free               |
| **Resend** | Emails you when someone requests an estimate           | Free (3,000/month) |
| **GitHub** | Stores the website's code                              | Free               |

The important idea: **the code and the content are separate.** You'll almost
never touch code. Day to day you log into Sanity, change your services or
prices, hit Publish, and the website updates itself within a minute.

---

## Before you start

Install these if you don't have them:

- **Node.js** version 18 or newer — https://nodejs.org (take the "LTS" option)
- **pnpm** — after Node is installed, run: `npm install -g pnpm`
- **Git** — https://git-scm.com

Check they worked:

```bash
node --version    # should print v18 or higher
pnpm --version
git --version
```

---

## Step 1 — Get the code

```bash
git clone https://github.com/LucasWyatt/HandymanWebsite.git my-handyman-site
cd my-handyman-site
pnpm install
```

`pnpm install` takes a few minutes and prints a lot. That's normal.

---

## Step 2 — Create your Sanity project

1. Go to https://sanity.io and sign up (free).
2. Create a new project. Name it after your business.
3. When asked for a dataset name, use **`production`**.
4. Open **Settings → API** and copy the **Project ID** — a short string of
   letters and numbers like `a1b2c3d4`.

> **Write that Project ID down.** You need it twice in the next step.

### Tell the code about your project

Create a file at `studio/.env` containing:

```
SANITY_STUDIO_PROJECT_ID=paste_your_project_id_here
SANITY_STUDIO_DATASET=production
```

Create a second file at `web/.env.local` containing:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=paste_your_project_id_here
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Both files are examples you can copy: `studio/.env.example` and
`web/.env.example`.

> These files are deliberately ignored by Git, so your keys never get uploaded
> anywhere. Don't paste their contents into a public place.

### Allow your site to read the content

In Sanity, go to **Settings → API → CORS origins** and add:

- `http://localhost:3000` (tick "Allow credentials")

You'll add your real domain here later.

---

## Step 3 — Run it on your own computer

```bash
pnpm dev
```

Two things start up:

- **http://localhost:3000** — your website
- **http://localhost:3333** — the Studio, where you edit content

Open the Studio first. It'll be empty. That's expected — you have a website with
no words in it yet.

Press `Ctrl+C` in the terminal to stop.

---

## Step 4 — Add your content

In the Studio at http://localhost:3333, work through these in order:

### Site Settings (do this first)

One record holding your business details: name, phone, email, address, business
hours, and your service areas. Everything else on the site reads from here, so
filling it in fixes your phone number and address across every page at once.

### Services

One record per thing you do — "Drywall & Paint Repair", "Door Installation".
For each, you'll write:

- A short description (shown on cards)
- An introduction (a paragraph for the service's own page)
- **Typical Problems** — 5 to 7 problems a customer would recognise, _in their
  words_. "My door sticks in summer" beats "seasonal hygroscopic expansion".
- **Our Approach** — 3 to 5 points on how you handle the job
- A few FAQs

Tick **Featured** on three of them to make them show on the homepage.

### Neighborhoods

The areas you serve. These generate your service-area page and map.

### Gallery Images

Before/after photos. These are the most persuasive thing on the whole site —
add them as you finish jobs.

### FAQs

General questions not tied to one service. Tick **Show on Homepage** for the
three or four most common ones.

> **Everything is optional and editable forever.** Publish something rough, look
> at it on the site, improve it. That loop is the whole point of using a CMS.

---

## Step 5 — Set up the estimate form

Without this, the form on your site looks fine but nothing reaches your inbox.

1. Sign up at https://resend.com (free — 3,000 emails a month).
2. Add and verify your domain. Resend walks you through adding DNS records;
   this is the fiddliest part of the whole guide, and their instructions are
   good. If you don't have a domain yet, skip to Step 6 and come back.
3. Create an **API key** and copy it.
4. Add these lines to `web/.env.local`:

```
EMAIL_API_KEY=re_your_resend_key_here
FROM_EMAIL=noreply@yourdomain.com
ESTIMATES_EMAIL=you@yourdomain.com
REPLY_TO_EMAIL=you@yourdomain.com
```

`ESTIMATES_EMAIL` is where estimate requests land. Make it an address you
actually read.

Restart `pnpm dev` and submit a test request through your own form.

---

## Step 6 — Put it on the internet

1. Push your copy to your own GitHub repository.
2. Go to https://vercel.com, sign up, and click **Add New → Project**.
3. Import your repository.
4. Set **Root Directory** to `web`.
5. Under **Environment Variables**, add every line from your `web/.env.local`.
6. Deploy.

A few minutes later you'll have a live URL ending in `.vercel.app`.

### Your own domain

Buy one anywhere (Namecheap, Cloudflare, Google Domains). In Vercel, open your
project → **Settings → Domains**, add it, and follow the DNS instructions.

Then go back and update two things:

- `NEXT_PUBLIC_SITE_URL` in Vercel's environment variables → `https://yourdomain.com`
- Sanity **Settings → API → CORS origins** → add `https://yourdomain.com`

### Deploy the Studio too (optional but recommended)

So you can edit content from your phone instead of your laptop:

```bash
cd studio
pnpm dlx sanity deploy
```

Pick a hostname and you'll get `https://yourname.sanity.studio`.

---

## Step 7 — Make edits update the live site immediately

By default the site refreshes its content every 60 seconds. To make Publish
instant:

1. In Sanity: **Settings → API → Webhooks → Create webhook**
2. **URL**: `https://yourdomain.com/api/sanity-webhook`
3. **Dataset**: `production`
4. **Trigger on**: Create, Update, Delete

---

## Day-to-day use

Once it's running, your routine is:

1. Go to your Studio URL
2. Change a price, add a service, upload photos from a finished job
3. Hit **Publish**
4. The website updates within a minute

You should not need to touch the code again unless you want to change how the
site _looks_.

---

## Troubleshooting

**`NEXT_PUBLIC_SANITY_PROJECT_ID is not set`**
You skipped `web/.env.local`, or you created it in the wrong folder. It goes
inside `web/`, not the project root. Restart `pnpm dev` after creating it.

**Studio loads but shows no content**
Check `SANITY_STUDIO_PROJECT_ID` in `studio/.env` matches your actual Project ID.

**Website shows nothing / "Failed to fetch"**
Usually a missing CORS origin. Add your URL under Sanity **Settings → API →
CORS origins**.

**`sanity` commands fail with "does not contain a project identifier"**
`studio/.env` is missing or the variable name is misspelled.

**Estimate form says it failed**
Almost always `EMAIL_API_KEY`, or a Resend domain that isn't verified yet.
Until it's verified Resend will only deliver to your own signup address.

**Changes don't show up on the live site**
Wait 60 seconds. If still nothing, the webhook in Step 7 isn't set up or has
the wrong URL.

---

## What's in here

```
web/      The website itself (Next.js)
studio/   The content editor (Sanity Studio)
infra/    Optional Terraform config - ignore this unless you know you want it
docs/     Notes on how the code is organised
```

## Getting help

- Sanity docs — https://www.sanity.io/docs
- Vercel docs — https://vercel.com/docs
- Next.js docs — https://nextjs.org/docs

---

## A note on the content

If this template came to you with content already loaded — real service
descriptions, problem lists, FAQs — that copy was written for a working
handyman business and is yours to adapt. Change the business name, phone,
and service areas to yours, then edit the wording until it sounds like you.
It's a starting point that's much better than a blank page, not a script to
follow word for word.

To load a content export you were given:

```bash
cd studio
pnpm dlx sanity dataset import ../handyman-production.tar.gz production
```
