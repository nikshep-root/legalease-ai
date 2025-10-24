# 🚀 Quick Start: Install Google Cloud SDK

## Step 1: Download & Install

**Run this in PowerShell (as Administrator):**

```powershell
# Download and install Google Cloud SDK
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

**OR manually download from:**
https://cloud.google.com/sdk/docs/install

## Step 2: Restart PowerShell

⚠️ **IMPORTANT:** Close and reopen PowerShell after installation!

## Step 3: Verify Installation

```powershell
gcloud version
```

You should see:
```
Google Cloud SDK 456.0.0
...
```

## Step 4: Login

```powershell
gcloud auth login
```

This will open your browser - sign in with your Google account.

## Step 5: Set Project

```powershell
gcloud config set project legalease-ai-566e9
```

## Step 6: Enable APIs

```powershell
gcloud services enable run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
```

## ✅ You're Ready!

Now you can deploy using:

```powershell
cd c:\Users\user\OneDrive\Desktop\LegalEase\legalease-ai
.\deploy-cloud-run.ps1
```

---

**Estimated Time:** 5-10 minutes total

**Next:** See `DEPLOYMENT.md` for full deployment guide
