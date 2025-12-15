# Deploying to Vercel (Free & Fast)

Vercel is excellent because it **never sleeps** and is very fast.

### Step 1: Login to Vercel
1.  Go to [vercel.com](https://vercel.com).
2.  Sign up/Login with **GitHub**.

### Step 2: Import Project
1.  Click **"Add New..."** -> **"Project"**.
2.  You will see your GitHub repos.
3.  Click **"Import"** next to `helpdesk-pro`.

### Step 3: Configure Project
1.  **Framework Preset:** Leave as "Other".
2.  **Environment Variables:** (Expand this section).
3.  Add your variables here (Copy from `.env`):
    *   `MONGODB_URI`: (Your connection string)
    *   `JWT_SECRET`: (Your secret)
    *   `NODE_ENV`: `production`

**Note:** You do NOT need to set `PORT` on Vercel.

### Step 4: Deploy
1.  Click **"Deploy"**.
2.  Wait for a minute.
3.  You will see confetti! 🎉 Your site is live.

### Important Limitation on Vercel
*   **File Uploads:** Since Vercel is "Serverless", you **cannot upload files** to the `uploads/` folder permanently. They will disappear after the request finishes.
*   **Fix:** For a production app on Vercel, you should use a cloud storage service like **Cloudinary** or **AWS S3** for images.
*   For now, the app will work, but uploaded attachments might show as broken links later.
