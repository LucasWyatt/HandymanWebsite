output "vercel_project_id" {
  description = "Vercel project ID"
  value       = vercel_project.hometown-handyman_web.id
}

output "vercel_deployment_url" {
  description = "Vercel deployment URL"
  value       = "https://${vercel_project.hometown-handyman_web.name}.vercel.app"
}

output "custom_domain" {
  description = "Custom domain URL"
  value       = "https://${var.site_domain}"
}

output "r2_bucket_name" {
  description = "Cloudflare R2 bucket name"
  value       = cloudflare_r2_bucket.hometown-handyman_uploads.name
}

output "r2_endpoint" {
  description = "Cloudflare R2 endpoint URL"
  value       = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
}

# Database outputs
output "database_url" {
  description = "Neon Postgres database connection URL"
  value       = var.database_url
  sensitive   = true
}

# Turnstile outputs (from variables)
output "turnstile_site_key" {
  description = "Cloudflare Turnstile site key (public)"
  value       = var.turnstile_site_key
}

output "turnstile_secret_key" {
  description = "Cloudflare Turnstile secret key (private)"
  value       = var.turnstile_secret_key
  sensitive   = true
}

# Environment variables summary
output "environment_variables" {
  description = "Summary of all environment variables configured"
  value = {
    DATABASE_URL         = "Set from Neon project"
    R2_BUCKET_NAME       = cloudflare_r2_bucket.hometown-handyman_uploads.name
    R2_ENDPOINT          = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
    R2_ACCESS_KEY_ID     = "Set from variable"
    R2_SECRET_ACCESS_KEY = "Set from variable (sensitive)"
    TURNSTILE_SITE_KEY   = "Set from Turnstile widget"
    TURNSTILE_SECRET_KEY = "Set from Turnstile widget (sensitive)"
    RESEND_API_KEY       = "Set from variable (sensitive)"
  }
}