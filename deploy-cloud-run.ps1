# Cloud Run Deployment Script for LegalEase AI
# Google GenAI Exchange Hackathon

Write-Host "🚀 Deploying LegalEase AI to Google Cloud Run..." -ForegroundColor Cyan
Write-Host ""

# Configuration
$PROJECT_ID = "legalease-ai-566e9"
$SERVICE_NAME = "legalease-ai"
$REGION = "us-central1"
$MEMORY = "2Gi"
$CPU = "2"
$MIN_INSTANCES = "0"
$MAX_INSTANCES = "10"
$TIMEOUT = "60"

Write-Host "📋 Configuration:" -ForegroundColor Yellow
Write-Host "  Project ID: $PROJECT_ID"
Write-Host "  Service: $SERVICE_NAME"
Write-Host "  Region: $REGION"
Write-Host "  Memory: $MEMORY"
Write-Host "  CPU: $CPU"
Write-Host ""

# Check if gcloud is installed
Write-Host "🔍 Checking Google Cloud SDK..." -ForegroundColor Cyan
try {
    $gcloudVersion = gcloud version 2>&1 | Select-String "Google Cloud SDK"
    Write-Host "  ✅ Google Cloud SDK is installed" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Google Cloud SDK not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "  Please install it from: https://cloud.google.com/sdk/docs/install" -ForegroundColor Yellow
    exit 1
}

# Set project
Write-Host ""
Write-Host "🔧 Setting up project..." -ForegroundColor Cyan
gcloud config set project $PROJECT_ID

# Enable required APIs
Write-Host ""
Write-Host "🔌 Enabling required APIs..." -ForegroundColor Cyan
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Deploy to Cloud Run
Write-Host ""
Write-Host "🚢 Deploying to Cloud Run (this may take 5-10 minutes)..." -ForegroundColor Cyan
Write-Host ""

gcloud run deploy $SERVICE_NAME `
  --source . `
  --platform managed `
  --region $REGION `
  --allow-unauthenticated `
  --memory $MEMORY `
  --cpu $CPU `
  --min-instances $MIN_INSTANCES `
  --max-instances $MAX_INSTANCES `
  --timeout $TIMEOUT `
  --set-env-vars "NODE_ENV=production"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Deployment successful!" -ForegroundColor Green
    Write-Host ""
    Write-Host "🌐 Your application is now live on Google Cloud Run!" -ForegroundColor Cyan
    Write-Host ""
    
    # Get service URL
    $serviceUrl = gcloud run services describe $SERVICE_NAME --region $REGION --format "value(status.url)"
    Write-Host "🔗 Service URL: $serviceUrl" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "📊 View in Console: https://console.cloud.google.com/run/detail/$REGION/$SERVICE_NAME/metrics?project=$PROJECT_ID" -ForegroundColor Yellow
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Deployment failed!" -ForegroundColor Red
    Write-Host "Please check the error messages above." -ForegroundColor Yellow
    exit 1
}
