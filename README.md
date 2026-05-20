# 4days.ai – landningssida

En-sida landningssida (HTML + Tailwind CDN) för lead capture och Calendly-bokning.

## Lokal preview

Öppna `index.html` i webbläsaren, eller:

```bash
npx serve .
```

## Deploy

Hostas på [Vercel](https://vercel.com). Vid push till `main` deployas automatiskt när GitHub är kopplat (se nedan).

## GitHub (engångs-setup)

```powershell
cd "d:\Cursor\HEMSIDOR\4days"
gh auth login
# Välj: GitHub.com → HTTPS → Login with a web browser

gh repo create 4days-landing --public --description "4days.ai Coming Soon landningssida" --source=. --remote=origin --push

# Koppla Vercel till repot (auto-deploy vid push)
vercel git connect
```

Om repot redan finns på GitHub:

```powershell
git remote add origin https://github.com/DITT-ANVÄNDARNAMN/4days-landing.git
git push -u origin main
vercel git connect
```

## MailerLite (Vercel serverless)

Formuläret postar till `/api/subscribe`, som anropar MailerLite API. API-nyckeln lagras **endast** på Vercel.

### 1. MailerLite-inställningar

1. **Account settings → Subscribe settings**
   - Aktivera **Double opt-in**
   - Aktivera **Double opt-in for API and integrations**
2. Skapa custom fields (om de saknas): `company`, `employees`
3. (Valfritt) Skapa grupp t.ex. "Landningssida" och notera **Group ID**

### 2. Vercel miljövariabler

```powershell
cd "d:\Cursor\HEMSIDOR\4days"
vercel env add MAILERLITE_API_TOKEN production
# Klistra in API-token när du tillfrågas

vercel env add MAILERLITE_GROUP_ID production
# Klistra in grupp-ID (valfritt)
```

Upprepa för `preview` om du vill testa på preview-URL:er. Deploya om efter att variablerna lagts till:

```powershell
vercel deploy --prod
```

### 3. Lokal utveckling

```powershell
copy .env.example .env.local
# Fyll i MAILERLITE_API_TOKEN i .env.local
vercel dev
```

Öppna http://localhost:3000 och testa formuläret.

## Övrig konfiguration

Se kommentarer högst upp i `index.html` (hero-bild, logotyp, OG-bild, footer-länkar).

Calendly: `https://calendly.com/hello-4days/30min`
