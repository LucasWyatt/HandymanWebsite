# Infrastructure Configuration

This directory contains Terraform configuration for provisioning the Hometown Handyman infrastructure on Vercel and Cloudflare.

## Resources Provisioned

- **Vercel Project**: Next.js application deployment with preview/production environments
- **Vercel Domain**: Custom domain configuration (example.com)
- **Neon Postgres**: Serverless PostgreSQL database
- **Cloudflare R2 Bucket**: File storage for uploads (hometown-handyman-uploads)
- **Cloudflare Turnstile**: CAPTCHA-free bot protection
- **Resend Integration**: Modern email service configuration
- **Environment Variables**: Secure configuration for all services

## Prerequisites

1. **Terraform** installed (>= 1.0)
2. **API Tokens**:
   - Vercel API Token: [Create here](https://vercel.com/account/tokens)
   - Cloudflare API Token: [Create here](https://dash.cloudflare.com/profile/api-tokens)
   - Neon API Key: [Create here](https://console.neon.tech/app/settings/api-keys)
3. **Service API Keys**:
   - Resend API Key: [Create here](https://resend.com/api-keys)
   - Cloudflare R2 Access Keys: From R2 dashboard

## Environment Variables

Set these environment variables before running Terraform:

```bash
# Provider Authentication
export VERCEL_API_TOKEN="your_vercel_token"
export CLOUDFLARE_API_TOKEN="your_cloudflare_token"
export NEON_API_KEY="your_neon_api_key"

# Terraform Variables
export TF_VAR_github_repo="username/hometown-handyman"
export TF_VAR_cloudflare_account_id="your_cloudflare_account_id"
export TF_VAR_r2_access_key_id="your_r2_access_key"
export TF_VAR_r2_secret_access_key="your_r2_secret"
export TF_VAR_resend_api_key="your_resend_api_key"
export TF_VAR_site_domain="example.com"
export TF_VAR_turnstile_site_key="your_turnstile_site_key"
export TF_VAR_turnstile_secret_key="your_turnstile_secret_key"
```

## Usage

```bash
# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the configuration
terraform apply

# View outputs
terraform output
```

## Outputs

- `vercel_project_id`: Vercel project identifier
- `vercel_deployment_url`: Default Vercel deployment URL
- `custom_domain`: Custom domain URL (example.com)
- `database_url`: Neon Postgres connection string (sensitive)
- `r2_bucket_name`: Name of the created R2 bucket (hometown-handyman-uploads)
- `r2_endpoint`: R2 storage endpoint URL
- `turnstile_site_key`: Cloudflare Turnstile public site key
- `turnstile_secret_key`: Cloudflare Turnstile private secret key (sensitive)
- `environment_variables`: Summary of all configured environment variables

## Security Notes

- All sensitive variables are marked as sensitive in Terraform
- Environment variables are only available in production and preview environments
- Database connection string is securely managed by Neon
- R2 bucket access is restricted to the application via API keys
- Turnstile secret key is kept secure and only used for server-side validation
- Resend API key is encrypted and only available to the application runtime
