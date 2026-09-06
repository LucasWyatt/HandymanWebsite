variable "github_repo" {
  description = "GitHub repository in the format 'username/repo-name'"
  type        = string
}

variable "vercel_team_id" {
  description = "Vercel team ID (optional, for team accounts)"
  type        = string
  default     = null
}

variable "cloudflare_account_id" {
  description = "Cloudflare account ID"
  type        = string
}

variable "database_url" {
  description = "Database connection URL (Neon, Supabase, etc.)"
  type        = string
  sensitive   = true
}

variable "r2_access_key_id" {
  description = "Cloudflare R2 access key ID"
  type        = string
  sensitive   = true
}

variable "r2_secret_access_key" {
  description = "Cloudflare R2 secret access key"
  type        = string
  sensitive   = true
}

variable "site_domain" {
  description = "Main domain for the site (used for Turnstile configuration)"
  type        = string
  default     = "example.com"
}

variable "resend_api_key" {
  description = "Resend API key for email services"
  type        = string
  sensitive   = true
}

variable "turnstile_site_key" {
  description = "Cloudflare Turnstile site key (public)"
  type        = string
}

variable "turnstile_secret_key" {
  description = "Cloudflare Turnstile secret key (private)"
  type        = string
  sensitive   = true
}