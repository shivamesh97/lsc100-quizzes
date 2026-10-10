# Teacher Portal – setup guide

The portal has two parts:

| Folder | Where it goes | What it does |
|---|---|---|
| `website/` | GitHub (GitHub Pages) | The pages teachers open: sign-in, subjects, quizzes, analytics |
| `apps-script/` | Google Apps Script, in the centre's Google account | Checks who is signed in, lists the quizzes, collects scores |

> **Never upload the `apps-script` folder to GitHub.** The quiz files contain the correct answers, and a GitHub Pages repository is public.

Use the **centre's Gmail account** for every step below, so the quizzes and results belong to the centre. Setup takes about 30–40 minutes, once.

---

## Step 1 – Create the backend in Google Apps Script

1. Go to **script.google.com** → **New project**. Rename it *Teacher Portal* (click "Untitled project" at the top).
2. The editor shows a file called `Code.gs`. Delete everything in it and paste the contents of `apps-script/Code.gs`.
3. Click **+** next to *Files* → **Script**, name it `Builder`, and paste `apps-script/Builder.gs`.
4. Again **+** → **Script**, name it `Quizzes_Bio11_Ch1`, and paste `apps-script/Quizzes_Bio11_Ch1.gs`.
5. Click **Save**.
6. In the function menu at the top, choose **setup** and click **Run**.
   - Google asks for permission: **Review permissions** → choose the centre account → **Advanced** → **Go to Teacher Portal (unsafe)** → **Allow**. The warning appears because this is your own script, not a published app.
7. The log at the bottom shows *Database ready* with a link. That spreadsheet, **Teacher Portal – Database**, is now in your Drive. It has three tabs: **Teachers**, **Quizzes** and **Responses**. Your own email is already in Teachers with access to all subjects.

## Step 2 – Get a Google sign-in Client ID

This lets teachers sign in with their Gmail on your website.

1. Go to **console.cloud.google.com** and sign in with the centre account. Accept the terms if asked.
2. At the top, click the project picker → **New project** → name it *Teacher Portal* → **Create**. Make sure it's selected.
3. Open the menu → **APIs & Services** → **OAuth consent screen** (it may be called **Google Auth Platform**). Click **Get started**:
   - App name: your centre's name. User support email: the centre email.
   - Audience: **External**.
   - Contact email: the centre email. Agree and **Create**.
4. Go to **Audience** and click **Publish app** → **Confirm**. (If you skip this, only test users you list can sign in. Sign-in that only asks for name and email does not need Google's review.)
5. Go to **Clients** → **Create client**:
   - Application type: **Web application**. Name: *Teacher Portal website*.
   - Under **Authorized JavaScript origins**, click **Add URI** and enter `https://YOUR-GITHUB-USERNAME.github.io` (your GitHub username, no slash at the end, nothing after `.io`).
   - Click **Create** and copy the **Client ID** (it ends in `.apps.googleusercontent.com`).
6. Back in Apps Script, open `Code.gs` and paste the Client ID between the quotes in the `CLIENT_ID` line at the top. **Save**.

## Step 3 – Publish the backend as a web app

1. In Apps Script, click **Deploy** → **New deployment**.
2. Click the gear icon → **Web app**.
   - Execute as: **Me**
   - Who has access: **Anyone**
3. Click **Deploy** and copy the **Web app URL** (it ends in `/exec`).

"Anyone" only means the website can reach it. The script refuses every request unless it comes with a valid Google sign-in from an email on your Teachers list.

**If you change the code later:** Deploy → **Manage deployments** → pencil icon → Version: **New version** → **Deploy**. The URL stays the same.

## Step 4 – Put the website on GitHub Pages

1. On github.com, create a new **public** repository, for example `teacher-portal`.
2. Click **Add file** → **Upload files** and upload everything **inside** the `website` folder: `index.html`, `quizzes.html`, `analytics.html`, `config.js` and the `assets` folder. **Commit changes**.
3. Open `config.js` in GitHub (pencil icon to edit) and fill in:
   - `CENTRE_NAME` – shown at the top of every page
   - `GOOGLE_CLIENT_ID` – from Step 2
   - `API_URL` – the web app URL from Step 3
   Then **Commit changes**.
4. Go to the repository's **Settings** → **Pages**. Under *Build and deployment*, choose **Deploy from a branch**, branch **main**, folder **/ (root)** → **Save**.
5. After a minute or two, your site is at `https://YOUR-GITHUB-USERNAME.github.io/teacher-portal/`.

Until `config.js` is filled in, the site runs in **demo mode** with sample data, so you can look around first.

## Step 5 – Add your teachers

Open **Teacher Portal – Database** → **Teachers** tab. Add one row per teacher:

| Email | Name | Subjects | Active |
|---|---|---|---|
| naik.physics@gmail.com | Mr. Naik | Physics | Yes |
| fernandes.bio@gmail.com | Mrs. Fernandes | Biology, Chemistry | Yes |

- **Subjects**: one subject, several separated by commas, or `All`. Use the exact names Physics, Chemistry, Maths, Biology.
- **Active**: change to `No` to remove someone's access without deleting the row.

Teachers sign in with that exact Gmail address.

## Step 6 – Create the first quizzes

1. In Apps Script, choose the function **build_Bio11_Ch1** and click **Run**.
2. It creates 6 Biology quizzes (Chapter 1, 2 topics × 3 sets) and lists them on the portal straight away.

Run each chapter's function **once only**. Running it again creates a second copy of every quiz.

For each new chapter, Claude will give you a new file such as `Quizzes_Bio11_Ch2.gs`. Add it as a new script file and run its `build_...` function.

Quizzes made with the older quiz-builder script are not connected to the portal. You can move them to the Drive bin.

---

## How scores reach Analytics

- Every 15 minutes, the script copies new form submissions into the **Responses** tab. Analytics reads from there.
- To update immediately, run **syncResponses** in Apps Script.
- Analytics counts each student's **first attempt** at each quiz. Retakes are recorded but not averaged in.
- Students are matched by the name and batch they type. Remind them to write their full name the same way every time. Small differences in capitals or spaces are handled automatically.

## If something goes wrong

| What you see | What to check |
|---|---|
| "This Google account isn't on the teacher list" | The email in the Teachers tab must match the Gmail exactly, and Active must not be `No`. |
| Google sign-in shows an error about the origin | In Step 2, the Authorized JavaScript origin must be exactly `https://YOUR-GITHUB-USERNAME.github.io`. Changes can take a few minutes to apply. |
| Sign-in works but pages say the server sent an unexpected reply | Redo Step 3 with **Who has access: Anyone**, and check `API_URL` in `config.js` ends in `/exec`. |
| Sign-in is rejected straight away | The Client ID in `Code.gs` and in `config.js` must be identical. After editing `Code.gs`, deploy a new version (Step 3). |
| A new quiz has no scores | Wait 15 minutes or run **syncResponses**. |
| Teachers are asked to sign in again | Google sign-in lasts about an hour. Signing in again takes one click. |
