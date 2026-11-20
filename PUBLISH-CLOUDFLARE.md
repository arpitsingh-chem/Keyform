# Publish on Cloudflare Pages — click-by-click

You chose **Choice A: Cloudflare Pages**. Good choice: it is free, it gives you a real web
address, and it can grow later if we ever add accounts.

**Two ways to do this:**

- **Path 1 (do this first, about 10 minutes):** upload the finished website as a file. No GitHub,
  no tokens, no code. Gets you a live link today.
- **Path 2 (optional, later):** connect a GitHub repository so the site updates itself when I
  change the code.

Do Path 1 now. Ignore Path 2 until you want it.

---

## Before you start

- The website is already built for you. The file is in this workspace:
  **`releases/keyform-site-v0.1.0.zip`** (86 KB).
- Download that file to your computer. Open it in the file viewer and use the download button.
- **Do not unzip it.** Cloudflare accepts the zip as it is.
- The zip contains only 4 files: `index.html`, two files in `assets/`, and no personal data at all.
  I checked it for secrets and found none.

---

## Path 1 — Upload the site (recommended first step)

### 1. Create a free Cloudflare account
1. Go to **https://dash.cloudflare.com/sign-up**
2. Enter your email and a password. Click **Sign up**.
3. Open the verification email and click the link.
4. **If Cloudflare asks for a payment method, close that page.** You do not need one for Pages.
   Nothing in these steps costs money.

### 2. Go to the Pages section
1. In the left sidebar, look for **Workers & Pages** (it may say **Compute (Workers)** at the top
   of the sidebar).
2. Click it, then click the **Create** button (it may say **Create application**).

### 3. Choose the right option
1. You will see two tabs or cards: **Workers** and **Pages**.
2. Choose **Pages**. Do *not* choose Workers — it needs different settings.
3. Under Pages, choose **Upload assets** (some versions say **Direct Upload**).

### 4. Name your project
1. Project name: type **`keyform`**
   - If it says the name is taken, use something like **`keyform-yourname`**.
   - Use only lowercase letters, numbers and dashes.
2. Click **Create project**.

### 5. Upload and deploy
1. Drag **`keyform-site-v0.1.0.zip`** into the upload box, or click to browse and select it.
2. Wait for the file name to appear in the list.
3. Click **Deploy site**.
4. Wait about 30–60 seconds. Cloudflare will show a success message.

### 6. Copy your web address
1. You will see a link ending in **`.pages.dev`**, for example
   `https://keyform.pages.dev`.
2. **Send me that link.** I will open it and check the live site for you — the same 37 checks I ran
   locally, plus the things only a real internet address can break (wrong file paths, missing
   styles, broken links).

### 7. Check it yourself in 30 seconds
1. Open your `.pages.dev` link on your phone.
2. Tap **Start a session**, answer one question correctly, and confirm you see the green **Correct**.
3. Rotate the phone and make sure nothing spills off the screen.

If the page is blank or unstyled, tell me the exact address — do not start changing settings.

---

## Path 2 — Make updates automatic (optional, later)

Right now, updating the site means uploading a new zip. That is fine for a while. When you want it
to update itself:

1. Create a free **GitHub** account at https://github.com/signup (no payment).
2. Create a new **empty** repository called `keyform` — public, no README, no .gitignore.
3. Tell me the repository name, and I will give you instructions for putting the project files in
   it. The files are already prepared: `.github/workflows/` contains two workflows (one runs tests,
   one can deploy).
4. In Cloudflare: **Workers & Pages → Create → Pages → Connect to Git**, pick your repository, and
   set:
   - Framework preset: **None** (or Vite if offered)
   - Build command: **`npm run build`**
   - Build output directory: **`dist`**
5. Click **Save and Deploy**.

**Do not upload zip files again after this** — every change you push to GitHub will rebuild the
site automatically.

> There is also a GitHub Actions workflow (`deploy-cloudflare.yml`) that uses an API token. You do
> **not** need it if you use the Connect-to-Git route above, and I recommend skipping it: it means
> handling a secret token for no benefit. **Never paste a token into this chat.**

---

## What this costs

| Item | Cost |
|---|---|
| Cloudflare Pages, Free plan | ₹0 |
| `.pages.dev` address | ₹0 |
| SSL/HTTPS | ₹0 |
| Custom domain like `keyform.in` | **Paid** — skip it; not needed |
| Supabase cloud saving | ₹0 on the free plan, optional and not built yet |

Free Pages has generous limits — far more than a practice site for personal or small-group use
needs. If traffic ever grows beyond them, Cloudflare will tell you rather than silently charging
you. I will not add anything that requires payment.

---

## Common problems

**"The name is already taken."**
Add your name or a number: `keyform-practice`, `keyform-arjun`. The address changes but nothing else.

**"My upload box only accepts a folder, not a zip."**
Unzip the file and drag the **contents** (the `index.html` file and the `assets` folder) — not the
folder they sit in.

**"I see a Worker setup page with code."**
You picked Workers instead of Pages. Go back one step and choose the **Pages** tab.

**"It says 404 Not Found."**
The zip was uploaded as a single folder inside the project. The `index.html` must sit at the very
top. Tell me and I will rebuild the zip.

**"It is asking for my card."**
Stop. That is a paid product (Workers paid plan, R2, or a domain). Free Pages never needs a card.

---

## What I need from you

Just one thing: **the `.pages.dev` link after step 6.**

Then I will:
1. Open it and verify the live site.
2. Report exactly what passed and what did not.
3. Record the address in `PROJECT_STATE.md` and `DEPLOYMENT_GUIDE.md`.
