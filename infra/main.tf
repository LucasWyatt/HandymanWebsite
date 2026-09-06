terraform {
  required_version = ">= 1.0"
  required_providers {
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    neon = {
      source  = "kislerdm/neon"
      version = "~> 0.9"
    }
  }
}

# Vercel Provider Configuration
provider "vercel" {
  # API Token will be provided via VERCEL_API_TOKEN environment variable
}

# Cloudflare Provider Configuration  
provider "cloudflare" {
  # API Token will be provided via CLOUDFLARE_API_TOKEN environment variable
}

# Neon Provider Configuration
provider "neon" {
  # API Key will be provided via NEON_API_KEY environment variable
}

# Vercel Project
resource "vercel_project" "hometown-handyman_web" {
  name      = "hometown-handyman"
  framework = "nextjs"

  git_repository = {
    type = "github"
    repo = var.github_repo # e.g., "username/hometown-handyman"
  }

  build_command    = "pnpm build"
  output_directory = ".next"
  install_command  = "pnpm install"

  environment = [
    {
      key    = "NODE_ENV"
      value  = "production"
      target = ["production"]
    },
    {
      key    = "NEXT_TELEMETRY_DISABLED"
      value  = "1"
      target = ["production", "preview"]
    }
  ]
}

# Vercel Project Domain (Custom Domain)
# Note: Domain must be added to Vercel manually first
resource "vercel_project_domain" "hometown-handyman_project_domain" {
  project_id = vercel_project.hometown-handyman_web.id
  domain     = var.site_domain
}

# Neon Postgres (Serverless) Project
resource "neon_project" "hometown-handyman_db" {
  name      = "hometown-handyman"
  region_id = "aws-us-east-1"
}

# Neon Database
resource "neon_database" "hometown-handyman_main" {
  project_id = neon_project.hometown-handyman_db.id
  branch_id  = neon_project.hometown-handyman_db.default_branch_id
  name       = "hometown-handyman"
  owner_name = "neondb_owner"
}

# Cloudflare R2 Bucket for file uploads
resource "cloudflare_r2_bucket" "hometown-handyman_uploads" {
  account_id = var.cloudflare_account_id
  name       = "hometown-handyman-uploads"
  location   = "ENAM" # Eastern North America
}

# NOTE: Cloudflare Turnstile widgets must be created manually via dashboard
# The cloudflare_turnstile_widget resource does not exist in the provider
# Create widget at: https://dash.cloudflare.com/profile/turnstile
# Then add the keys as variables below

# Environment variables for the web app
resource "vercel_project_environment_variable" "database_url" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "DATABASE_URL"
  value      = var.database_url
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "r2_endpoint" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "R2_ENDPOINT"
  value      = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "r2_bucket_name" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "R2_BUCKET_NAME"
  value      = cloudflare_r2_bucket.hometown-handyman_uploads.name
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "r2_access_key_id" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "R2_ACCESS_KEY_ID"
  value      = var.r2_access_key_id
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "r2_secret_access_key" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "R2_SECRET_ACCESS_KEY"
  value      = var.r2_secret_access_key
  target     = ["production", "preview"]
}

# Turnstile Environment Variables  
resource "vercel_project_environment_variable" "turnstile_site_key" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "TURNSTILE_SITE_KEY"
  value      = var.turnstile_site_key
  target     = ["production", "preview"]
}

resource "vercel_project_environment_variable" "turnstile_secret_key" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "TURNSTILE_SECRET_KEY"
  value      = var.turnstile_secret_key
  target     = ["production", "preview"]
}

# Resend Environment Variable
resource "vercel_project_environment_variable" "resend_api_key" {
  project_id = vercel_project.hometown-handyman_web.id
  key        = "RESEND_API_KEY"
  value      = var.resend_api_key
  target     = ["production", "preview"]
}