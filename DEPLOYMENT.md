# 🚀 LegalEase AI - Google Cloud Run Deployment Guide

**Built for Google GenAI Exchange Hackathon 2025**

This guide will help you deploy LegalEase AI to Google Cloud Run and showcase the full Google Cloud integration.

---

## 📋 Prerequisites

### 1. Install Google Cloud SDK

**Windows (PowerShell as Administrator):**
```powershell
# Download and run installer
(New-Object Net.WebClient).DownloadFile("https://dl.google.com/dl/cloudsdk/channels/rapid/GoogleCloudSDKInstaller.exe", "$env:Temp\GoogleCloudSDKInstaller.exe")
& $env:Temp\GoogleCloudSDKInstaller.exe
```

**Or download directly:** https://cloud.google.com/sdk/docs/install

After installation:
1. **Close and reopen PowerShell**
2. Verify installation: `gcloud version`

---

## 🔧 Setup (One-Time Configuration)

### Step 1: Authenticate with Google Cloud

```powershell
# Login to your Google account
gcloud auth login

# This will open a browser window - sign in with your Google account
```

### Step 2: Set Your Project

```powershell
# Set your project ID
gcloud config set project legalease-ai-566e9

# Verify it's set correctly
gcloud config list project
```

### Step 3: Enable Required APIs

```powershell
# Enable Cloud Run, Cloud Build, and Artifact Registry
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable documentai.googleapis.com
gcloud services enable aiplatform.googleapis.com
```

---

## 🚢 Deploy to Cloud Run

### Option 1: Use the Deployment Script (Recommended)

```powershell
# Navigate to your project directory
cd c:\Users\user\OneDrive\Desktop\LegalEase\legalease-ai

# Run the deployment script
.\deploy-cloud-run.ps1
```

### Option 2: Manual Deployment

```powershell
# Deploy with all configurations
gcloud run deploy legalease-ai `
  --source . `
  --platform managed `
  --region us-central1 `
  --allow-unauthenticated `
  --memory 2Gi `
  --cpu 2 `
  --min-instances 0 `
  --max-instances 10 `
  --timeout 60
```

**Deployment takes 5-10 minutes** ⏱️

---

## 🔐 Set Environment Variables

After deployment, configure your environment variables:

```powershell
# Set all environment variables at once
gcloud run services update legalease-ai `
  --set-env-vars "^@^GOOGLE_AI_API_KEY=your-api-key@NEXTAUTH_SECRET=your-secret@NEXTAUTH_URL=https://your-cloud-run-url.run.app@FIREBASE_PROJECT_ID=legalease-ai-566e9" `
  --region us-central1
```

**Replace with your actual values:**
- `GOOGLE_AI_API_KEY` - Your Gemini API key
- `NEXTAUTH_SECRET` - Your NextAuth secret
- `NEXTAUTH_URL` - Your Cloud Run service URL (get after deployment)
- `FIREBASE_PROJECT_ID` - Your Firebase project ID

---

## 🌐 Custom Domain Setup (Optional)

### Map Your Domain to Cloud Run

```powershell
# Verify domain ownership first in Google Search Console
# Then map the domain
gcloud run domain-mappings create `
  --service legalease-ai `
  --domain legalease.ai `
  --region us-central1
```

**Follow the DNS configuration instructions provided**

---

## 📊 View Your Deployment

### Get Service URL

```powershell
# Get the public URL
gcloud run services describe legalease-ai `
  --region us-central1 `
  --format "value(status.url)"
```

### View in Console

**Cloud Run Dashboard:**
https://console.cloud.google.com/run?project=legalease-ai-566e9

**View Logs:**
https://console.cloud.google.com/logs/query?project=legalease-ai-566e9

**View Metrics:**
https://console.cloud.google.com/monitoring?project=legalease-ai-566e9

---

## 🔍 Useful Commands

### Check Service Status
```powershell
gcloud run services describe legalease-ai --region us-central1
```

### View Live Logs
```powershell
gcloud run services logs read legalease-ai --region us-central1 --limit 50
```

### Update Service Configuration
```powershell
# Increase memory
gcloud run services update legalease-ai --memory 4Gi --region us-central1

# Change min instances (keep warm)
gcloud run services update legalease-ai --min-instances 1 --region us-central1
```

### List All Services
```powershell
gcloud run services list --region us-central1
```

### Delete Service (if needed)
```powershell
gcloud run services delete legalease-ai --region us-central1
```

---

## 📈 Monitoring & Debugging

### View Real-Time Logs
```powershell
gcloud run services logs tail legalease-ai --region us-central1
```

### Check for Errors
```powershell
gcloud logging read "resource.type=cloud_run_revision AND severity>=ERROR" --limit 50
```

### View Metrics Dashboard
```powershell
# Open in browser
start https://console.cloud.google.com/run/detail/us-central1/legalease-ai/metrics?project=legalease-ai-566e9
```

---

## 🎯 Hackathon Demo Checklist

Before your demo, make sure:

- ✅ Service is deployed and running on Cloud Run
- ✅ Environment variables are configured
- ✅ Tech Stack page is accessible (`/tech-stack`)
- ✅ All features are working (upload, analysis, chat)
- ✅ Logs are clean (no critical errors)
- ✅ Custom domain is mapped (optional but impressive)
- ✅ Monitoring dashboard is ready to show

---

## 🏆 Demo Script Suggestions

**Opening:**
"LegalEase AI is a fully Google-powered legal document intelligence platform built entirely on Google Cloud infrastructure."

**Show Tech Stack:**
Navigate to `/tech-stack` page to showcase all Google services used.

**Architecture Highlights:**
1. **Cloud Run** - Serverless deployment with auto-scaling
2. **Gemini 2.0 Flash** - Advanced AI for legal analysis
3. **Document AI** - OCR and document understanding
4. **Cloud Storage** - Secure document storage with auto-deletion
5. **Firestore** - Real-time database
6. **Cloud Logging** - Production monitoring
7. **10+ Google Services** integrated seamlessly

**Live Demo:**
1. Upload a legal document
2. Show AI analysis powered by Gemini
3. Demonstrate chat feature
4. Show Cloud Run metrics dashboard
5. Display logs in real-time

---

## 💡 Cost Optimization

### Free Tier Includes:
- 2 million requests/month
- 360,000 GB-seconds of memory
- 180,000 vCPU-seconds

### With Your $1000 Credits:
- Can run **millions of requests for FREE**
- Perfect for hackathon and initial production
- No credit card charges until credits exhausted

### To Minimize Costs:
```powershell
# Scale to zero when not in use
gcloud run services update legalease-ai --min-instances 0 --region us-central1

# Reduce memory if possible
gcloud run services update legalease-ai --memory 1Gi --region us-central1
```

---

## 🔧 Troubleshooting

### Build Fails
```powershell
# Check build logs
gcloud builds log $(gcloud builds list --limit 1 --format="value(id)")
```

### Service Won't Start
```powershell
# Check service logs
gcloud run services logs read legalease-ai --region us-central1 --limit 100
```

### Environment Variables Not Set
```powershell
# List current env vars
gcloud run services describe legalease-ai --region us-central1 --format "value(spec.template.spec.containers[0].env)"

# Update if needed
gcloud run services update legalease-ai --set-env-vars "KEY=value" --region us-central1
```

### Port Issues
Cloud Run expects port **8080** by default. Our Dockerfile is configured for this.

---

## 📚 Additional Resources

- **Cloud Run Documentation**: https://cloud.google.com/run/docs
- **Gemini API Documentation**: https://ai.google.dev/docs
- **Document AI Documentation**: https://cloud.google.com/document-ai/docs
- **Vertex AI Documentation**: https://cloud.google.com/vertex-ai/docs

---

## 🎊 Success!

Once deployed, your application will be:
- ✅ Running on Google Cloud infrastructure
- ✅ Auto-scaling based on traffic
- ✅ Monitored and logged
- ✅ Production-ready
- ✅ Perfect for your hackathon demo!

**Service URL:** `https://legalease-ai-XXXXXXX.run.app`

**Tech Stack Page:** `https://legalease-ai-XXXXXXX.run.app/tech-stack`

---

## 🏆 For the Hackathon Judges

**Highlight These Points:**
1. ✅ **10+ Google Cloud Services** - Full ecosystem integration
2. ✅ **Production-Ready Architecture** - Cloud Run with auto-scaling
3. ✅ **AI-First Design** - Gemini 2.0 Flash + Document AI + Vertex AI
4. ✅ **Enterprise-Grade Security** - Cloud Armor, IAM, encryption
5. ✅ **Observable** - Cloud Logging & Monitoring
6. ✅ **Cost-Optimized** - Serverless, pay-per-use
7. ✅ **Scalable** - 0 to 1000+ concurrent users

---

**Built with ❤️ for Google GenAI Exchange Hackathon 2025**

Need help? Check the troubleshooting section or contact your team!
