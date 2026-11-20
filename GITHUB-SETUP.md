# Put the project on GitHub (for your CV)

Two routes. **Route A is easier** — no software to install. Route B gives a nicer
seven-commit history if you already have Git installed.

You cannot break anything by choosing the "wrong" route: the repository is just files.

---

## Route A — Upload in the browser (about 8 minutes)

### 1. Create the repository
1. Go to **https://github.com/new**
2. **Repository name:** `keyform`
3. **Description:** `Typed-answer English practice workspace for CDS, NDA and AFCAT — React, TypeScript, offline-first.`
4. Choose **Public** (a private repo hides the work from your CV).
5. **Do not** tick "Add a README file", ".gitignore" or a licence — the project already has them.
6. Click **Create repository**.

### 2. Get the files ready
1. In this workspace, download **`releases/keyform-source-v0.2.0.zip`** (133 KB).
2. Unzip it on your computer. You should see `index.html`, `package.json`, `src`, `tests`, `README.md` and so on.
3. Do **not** include `node_modules` even if you have run `npm install` locally — it must stay out.

### 3. Upload
1. On the empty repository page, click **uploading an existing file**.
2. Select everything inside the unzipped folder — the files *and* the folders — and drag them into the browser.
   - Drag the **contents**, not the folder itself, or everything lands one level too deep.
3. In the commit message box, write: `Add Keyform practice workspace (v0.2.0)`
4. Click **Commit changes**.

Check that `README.md` appears on the repository home page and that the folder list shows `src`, `tests` and `.github`. If `.github` is missing, GitHub hides dot-folders in the upload dialog — that is fine; the CI workflow is optional for the CV.

### 4. Make the repository look finished (2 minutes)
1. Click the **⚙ gear** next to *About* on the right.
2. **Description:** the same sentence as above.
3. **Website:** `https://steep-dew-97ac.getsetflytech0209.workers.dev`
4. **Topics:** `react`, `typescript`, `vite`, `education`, `offline-first`, `accessibility`, `indexeddb`, `cloudflare-pages`
5. Save.

That website field is what recruiters click. It links your code to the running site.

---

## Route B — Keep the seven-commit history (if Git is installed)

The repository history was prepared for you as `releases/keyform-repo.bundle`.

```bash
git clone keyform-repo.bundle keyform
cd keyform
git log --oneline          # seven commits
git remote add origin https://github.com/YOUR-USERNAME/keyform.git
git branch -M main
git push -u origin main
```

GitHub will reject the push if the repository already contains a commit (for example a README you
created). Either create the repository completely empty, or run `git pull --rebase origin main`
first and resolve nothing — the histories are unrelated, so the cleanest option is an empty repo.

If you want the commits under your own Git identity:

```bash
git config user.name "Your Name"
git config user.email "you@example.com"
```

Existing commits keep the author recorded at creation time. That is normal and not a problem.

---

## Optional — let Cloudflare rebuild from GitHub

Once the repository exists, every push can redeploy the site automatically:

1. Cloudflare dashboard → **Workers & Pages** → your `keyform` project.
2. Look for **Settings → Build** (or **Connect to Git** on a new project).
3. Connect the GitHub repository, grant access to that one repository only.
4. Build command: `npm run build` · Output directory: `dist` · Root directory: leave blank.
5. Save and deploy.

Until you do this, updating the live site means uploading a new zip by hand.

---

## Suggested CV entry

> **Keyform — Typed-answer English practice platform** (personal project)
> React · TypeScript · Vite · IndexedDB · Playwright · GitHub Actions · Cloudflare
> - Built an offline-first practice workspace for CDS/NDA/AFCAT English where learners type the
>   answer instead of selecting a letter; grading is exact after NFKC normalisation, whitespace
>   collapsing and case folding, with no fuzzy matching.
> - Wrote 53 unit and content-integrity tests plus a 44-check Playwright suite covering the practice
>   loop, persistence across reloads, mock scoring and responsive layouts at 360–1920 px.
> - Documented an architecture decision record, a content-provenance policy and a QA log that
>   separates executed checks from planned ones.
> - Deployed on Cloudflare with no paid services; all 93 practice items are original content with
>   recorded provenance.

Say "93 original practice items **written and reviewed by me**" only if you are comfortable defending
that in an interview. If not, describe them as "original practice content with a documented review
process" — which is accurate either way.

---

## Two cautions

- **Do not** commit `.env` files, tokens or passwords. This project has none, and it never should.
- **Do not** rename folders casually after uploading; the Vite build expects `src/`.
