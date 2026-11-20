# What to do next — a simple guide

You do not need to install anything or understand code. Follow the steps in order.
Steps 1–2 take about ten minutes. Steps 3–5 can wait until you have tried the app.

---

## Step 1 — Look at the app (right now)

1. The app is running in your preview panel on **port 5173**. If the panel is closed, reopen the
   preview for the process called **Keyform app**.
2. You should see a white page with **Keyform** in the top-left corner and the heading
   *"Practise English by typing the answer, not by clicking a letter."*
3. If you see a blank page or an error, tell me and I will restart it. Do not try to fix it yourself.

> Important: this app is only visible inside this workspace, not on the internet yet.
> Publishing it for other people is Step 4.

---

## Step 2 — Try these six things (about 10 minutes)

Do them in this order. Each one tests a different part of the app.

**1. Answer a question the right way**
- Click **Start a session**.
- Choose **CDS**, then **Vocabulary**.
- Read the question and the four lettered options.
- Type the answer **in your own spelling and small letters**, for example `lessen`, and press Enter.
- You should see green **Correct** and a short explanation.

**2. Answer one wrongly on purpose**
- Press **Next question**, then type something wrong and press Enter.
- You should see red **Not quite**, the expected answer, and a *Reason* line.
- Notice the answer box becomes read-only. You cannot change an answer after submitting.

**3. Try the case and space rule**
- Answer a question using CAPITAL LETTERS with extra spaces around your answer.
- It should still be accepted. Small letters, capital letters and extra spaces do not matter.
- Spelling and punctuation **do** matter. This is on purpose.

**4. Take a short mock test**
- Open **Mock tests** in the left menu, then **Start CDS run**.
- Answer two or three questions, then click **Submit run**.
- A browser box will ask you to confirm. It will also tell you how many questions are blank.
- After submitting, you will see: correct, incorrect and **omitted** (blank) counted separately.

**5. Change the look**
- Open **Settings**, click **Dark**. The whole app turns dark.
- Click **Light** to go back.

**6. Look at it on a phone**
- Narrow your browser window until it is thin, like a phone.
- The left menu should collapse into a **Menu** button and nothing should spill off the side.

---

## Step 3 — Tell me what felt wrong

This is the most useful thing you can do. Write in your own words; short notes are fine.

Helpful things to comment on:
- Is the writing on the practice screen easy to read on your phone?
- Do you like seeing the four options **before** you type? Or would you rather type first and then check?
- Is the explanation helpful, or too long?
- Is anything hard to find in the menu?
- Does the mock test feel right at **10 questions / 8 minutes**? That is my own setting, not an official exam rule.

I will make the changes and tell you exactly what I changed.

---

## Step 4 — Publish it on the internet (only when you are ready)

Right now nobody else can open your app. To make a real web address, **you** must do the
account parts, because only you can create accounts and approve access. I will do everything else.

### What you need
- An email address.
- About 20 minutes.
- **No money.** Everything below has a free tier. You do not need a domain name.

### The two choices

**Choice A — Cloudflare Pages (recommended, what we planned)**
- Free web address like `keyform.pages.dev`.
- Can grow later to include accounts and saved progress on a server.

**Choice B — GitHub Pages (simplest to start)**
- Free web address like `your-username.github.io`.
- Static only. No accounts, no saved-on-server progress, ever.

If you are unsure, pick **A**. You can always move to B or another host later, because the app is
just files.

### The steps (I will guide each one when you say "let's publish")

1. **Create a free GitHub account**, if you do not have one. GitHub is where the code files live.
2. **Create a free Cloudflare account**, if you choose A.
3. **Tell me you are ready.** I will prepare the exact files and give you click-by-click
   instructions with screenshots of the buttons to press.
4. **Create an empty repository** on GitHub and paste me its name. Do not upload files yet.
5. **Give the workspace access to GitHub** using the app connection on this page, or follow my
   manual instructions if the connection is not available.
6. **Add two secret values** in GitHub settings (only if you choose A). I will show you exactly
   where they go.
7. **Press "Run workflow"**. The site builds and goes live. I will then open your real address and
   check the live site for you.

### Rules to keep you safe
- **Never paste a token, password or API key into this chat.** If I need one, I will tell you where
  to put it in the website settings.
- Cloudflare asks for a payment method on some paid features. **Do not add one.** Free Pages does
  not need it.
- If any page asks you to pay, stop and tell me.

---

## Step 5 — What happens after it is live

In rough order, and only if you want each one:

1. **More practice questions.** The biggest complaint will be "there are only 44". Each new
   question must be written, checked for the correct answer, and labelled as original practice.
2. **AFCAT syllabus check.** I still need to read the official Indian Air Force syllabus document
   before I can honestly say which AFCAT topics are official. Until then, those topics are marked
   as practice groupings only.
3. **Real previous-year questions.** Only if we can confirm permission to reuse them. Otherwise we
   keep linking to the official papers, which is always safe.
4. **Cloud saving (optional).** This needs the free Supabase account and a privacy decision from
   you. The app already works without it, so this is never urgent.

---

## Things that are already done, so you do not need to worry about them

- The app is built and runs.
- 37 automated tests pass, and 37 browser checks pass on the real interface.
- It works without internet after loading, saves progress on your device, and has no login.
- Nothing has been deployed, nothing is public, and nothing has cost money.

---

## If something goes wrong

- **Blank preview** → tell me "restart the preview". Do not reinstall anything.
- **Progress disappeared** → progress is saved in your browser. Clearing browser data, private
  windows, or switching devices will lose it. I can add a backup/export button if this bothers you.
- **Confused about a word in the guide** → ask me. There is no such thing as a silly question here.
