#!/bin/bash

# ==============================================================================
# Vercel Deployment Script
# ==============================================================================
# This script automates Vercel deployment with environment checks and validation
# Supports production and preview deployments
# ==============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# ------------------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------------------
ENVIRONMENT="${ENVIRONMENT:-production}"
PROJECT_NAME="${PROJECT_NAME:-}"
VERCEL_ORG_ID="${VERCEL_ORG_ID:-}"
VERCEL_PROJECT_ID="${VERCEL_PROJECT_ID:-}"
VERCEL_TOKEN="${VERCEL_TOKEN:-}"
BUILD_ENV="${BUILD_ENV:-.env.production}"
PROMOTE="${PROMOTE:-true}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# ------------------------------------------------------------------------------
# Helper Functions
# ------------------------------------------------------------------------------

log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

check_command() {
    if ! command -v "$1" &> /dev/null; then
        error "$1 is required but not installed. Please install $1."
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# Validation
# ------------------------------------------------------------------------------

validate_environment() {
    log "Validating environment..."

    check_command vercel
    check_command node
    check_command npm

    if [ -z "$VERCEL_TOKEN" ]; then
        error "VERCEL_TOKEN is required. Set it in your environment or .env file"
        exit 1
    fi

    if [ ! -f "package.json" ]; then
        error "package.json not found. Are you in the project directory?"
        exit 1
    fi

    success "Environment validation complete"
}

# ------------------------------------------------------------------------------
# Install Dependencies
# ------------------------------------------------------------------------------

install_dependencies() {
    log "Installing dependencies..."

    if [ -f "package-lock.json" ]; then
        npm ci
    elif [ -f "yarn.lock" ]; then
        check_command yarn
        yarn install --frozen-lockfile
    elif [ -f "pnpm-lock.yaml" ]; then
        check_command pnpm
        pnpm install --frozen-lockfile
    else
        npm install
    fi

    success "Dependencies installed"
}

# ------------------------------------------------------------------------------
# Run Tests
# ------------------------------------------------------------------------------

run_tests() {
    log "Running tests..."

    if npm run test --if-present; then
        success "Tests passed"
    else
        warning "Tests failed or not configured"
    fi
}

# ------------------------------------------------------------------------------
# Build Locally (optional)
# ------------------------------------------------------------------------------

build_locally() {
    log "Building locally for validation..."

    if npm run build --if-present; then
        success "Local build successful"
    else
        warning "Local build failed or not configured"
    fi
}

# ------------------------------------------------------------------------------
# Load Environment Variables
# ------------------------------------------------------------------------------

load_env_vars() {
    log "Loading environment variables for $ENVIRONMENT..."

    ENV_ARGS=()

    # Load from .env file if it exists
    if [ -f "$BUILD_ENV" ]; then
        log "Loading variables from $BUILD_ENV"
        while IFS='=' read -r key value; do
            # Skip comments and empty lines
            [[ "$key" =~ ^#.*$ ]] && continue
            [[ -z "$key" ]] && continue

            # Remove quotes if present
            value="${value%\"}"
            value="${value#\"}"

            # Add to Vercel deployment
            ENV_ARGS+=("--build-env" "$key=$value")
            ENV_ARGS+=("--env" "$key=$value")
        done < "$BUILD_ENV"
    fi

    log "Environment variables loaded: ${#ENV_ARGS[@]} variables"
}

# ------------------------------------------------------------------------------
# Deploy to Vercel
# ------------------------------------------------------------------------------

deploy_to_vercel() {
    log "Deploying to Vercel ($ENVIRONMENT)..."

    # Base deployment arguments
    DEPLOY_ARGS=(
        --token "$VERCEL_TOKEN"
        --yes
    )

    # Add project configuration if available
    if [ -n "$VERCEL_ORG_ID" ]; then
        DEPLOY_ARGS+=("--scope" "$VERCEL_ORG_ID")
    fi

    # Add environment-specific arguments
    if [ "$ENVIRONMENT" = "production" ]; then
        log "Deploying to PRODUCTION"
        DEPLOY_ARGS+=("--prod")
    else
        log "Deploying PREVIEW for $ENVIRONMENT"
    fi

    # Add environment variables
    DEPLOY_ARGS+=("${ENV_ARGS[@]}")

    # Deploy
    DEPLOYMENT_URL=$(vercel "${DEPLOY_ARGS[@]}")

    if [ -z "$DEPLOYMENT_URL" ]; then
        error "Deployment failed - no URL returned"
        exit 1
    fi

    success "Deployment successful!"
    log "Deployment URL: $DEPLOYMENT_URL"

    # Export for other scripts
    export DEPLOYMENT_URL
}

# ------------------------------------------------------------------------------
# Health Check
# ------------------------------------------------------------------------------

health_check() {
    log "Running health check on deployment..."

    # Wait for deployment to be ready
    sleep 10

    if command -v curl &> /dev/null; then
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$DEPLOYMENT_URL/")

        if [ "$HTTP_CODE" = "200" ]; then
            success "Health check passed (HTTP $HTTP_CODE)"
        else
            error "Health check failed (HTTP $HTTP_CODE)"
            exit 1
        fi
    else
        warning "curl not available, skipping health check"
    fi
}

# ------------------------------------------------------------------------------
# Promote to Production (if preview)
# ------------------------------------------------------------------------------

promote_to_production() {
    if [ "$ENVIRONMENT" != "production" ] && [ "$PROMOTE" = "true" ]; then
        log "Would you like to promote this deployment to production?"
        warning "This will make it the production URL"

        # In CI/CD, skip interactive prompt
        if [ -n "${CI:-}" ]; then
            log "Running in CI, skipping promotion"
            return
        fi

        read -p "Promote to production? (y/N) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            log "Promoting to production..."
            vercel promote "$DEPLOYMENT_URL" --token "$VERCEL_TOKEN" --yes
            success "Promoted to production!"
        fi
    fi
}

# ------------------------------------------------------------------------------
# Show Deployment Info
# ------------------------------------------------------------------------------

show_deployment_info() {
    log "Deployment Information:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Environment:     $ENVIRONMENT"
    echo "Deployment URL:  $DEPLOYMENT_URL"
    echo "Project:         ${PROJECT_NAME:-$(basename "$(pwd)")}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [ "$ENVIRONMENT" = "production" ]; then
        success "Your app is now live in PRODUCTION! 🚀"
    else
        success "Preview deployment ready for testing! 🔍"
    fi
}

# ------------------------------------------------------------------------------
# Cleanup
# ------------------------------------------------------------------------------

cleanup() {
    log "Cleaning up..."

    # Remove any temporary files
    rm -rf .vercel/output 2>/dev/null || true

    success "Cleanup complete"
}

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

main() {
    log "Starting Vercel deployment script"
    log "Environment: $ENVIRONMENT"

    validate_environment
    install_dependencies
    # run_tests  # Uncomment to run tests before deployment
    # build_locally  # Uncomment to build locally before deployment
    load_env_vars
    deploy_to_vercel
    health_check
    promote_to_production
    show_deployment_info
    cleanup

    success "Vercel deployment completed successfully!"
}

# ------------------------------------------------------------------------------
# Error Handler
# ------------------------------------------------------------------------------

trap 'error "Deployment failed at line $LINENO. Exit code: $?"' ERR

# ------------------------------------------------------------------------------
# Execute
# ------------------------------------------------------------------------------

main "$@"
