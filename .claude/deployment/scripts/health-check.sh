#!/bin/bash

# ==============================================================================
# Universal Health Check Script
# ==============================================================================
# This script performs comprehensive health checks on deployed applications
# Supports HTTP endpoints, databases, and external services
# ==============================================================================

set -e  # Exit on error
set -u  # Exit on undefined variable
set -o pipefail  # Exit on pipe failure

# ------------------------------------------------------------------------------
# Configuration
# ------------------------------------------------------------------------------
URL="${URL:-http://localhost:3000}"
HEALTH_ENDPOINT="${HEALTH_ENDPOINT:-/health}"
READY_ENDPOINT="${READY_ENDPOINT:-/ready}"
MAX_RETRIES="${MAX_RETRIES:-30}"
RETRY_INTERVAL="${RETRY_INTERVAL:-2}"
TIMEOUT="${TIMEOUT:-10}"
CHECK_DATABASE="${CHECK_DATABASE:-false}"
CHECK_REDIS="${CHECK_REDIS:-false}"
VERBOSE="${VERBOSE:-false}"

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
    echo -e "${GREEN}[✓]${NC} $1"
}

error() {
    echo -e "${RED}[✗]${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

verbose() {
    if [ "$VERBOSE" = "true" ]; then
        log "$1"
    fi
}

# ------------------------------------------------------------------------------
# HTTP Health Check
# ------------------------------------------------------------------------------

check_http_health() {
    local endpoint="$1"
    local url="${URL}${endpoint}"

    verbose "Checking HTTP endpoint: $url"

    HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$url" || echo "000")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$url" 2>/dev/null || echo "0")

    if [ "$HTTP_CODE" = "200" ]; then
        success "HTTP health check passed (${HTTP_CODE}) - Response time: ${RESPONSE_TIME}s"
        return 0
    else
        error "HTTP health check failed (${HTTP_CODE})"
        return 1
    fi
}

# ------------------------------------------------------------------------------
# HTTP Health Check with Retries
# ------------------------------------------------------------------------------

check_http_with_retries() {
    local endpoint="$1"
    local url="${URL}${endpoint}"

    log "Checking HTTP health: $url"
    log "Max retries: $MAX_RETRIES, Retry interval: ${RETRY_INTERVAL}s"

    for i in $(seq 1 "$MAX_RETRIES"); do
        verbose "Attempt $i/$MAX_RETRIES..."

        if check_http_health "$endpoint"; then
            success "Service is healthy after $i attempt(s)"
            return 0
        fi

        if [ "$i" -lt "$MAX_RETRIES" ]; then
            verbose "Waiting ${RETRY_INTERVAL}s before retry..."
            sleep "$RETRY_INTERVAL"
        fi
    done

    error "Service failed health check after $MAX_RETRIES attempts"
    return 1
}

# ------------------------------------------------------------------------------
# Database Health Check
# ------------------------------------------------------------------------------

check_database() {
    if [ "$CHECK_DATABASE" = "true" ]; then
        log "Checking database connectivity..."

        if [ -z "${DATABASE_URL:-}" ]; then
            warning "DATABASE_URL not set, skipping database check"
            return 0
        fi

        # PostgreSQL
        if [[ "$DATABASE_URL" =~ ^postgres ]]; then
            if command -v psql &> /dev/null; then
                if psql "$DATABASE_URL" -c "SELECT 1;" &> /dev/null; then
                    success "PostgreSQL connection successful"
                else
                    error "PostgreSQL connection failed"
                    return 1
                fi
            else
                warning "psql not available, skipping PostgreSQL check"
            fi
        fi

        # MySQL
        if [[ "$DATABASE_URL" =~ ^mysql ]]; then
            if command -v mysql &> /dev/null; then
                if mysql -e "SELECT 1;" &> /dev/null; then
                    success "MySQL connection successful"
                else
                    error "MySQL connection failed"
                    return 1
                fi
            else
                warning "mysql not available, skipping MySQL check"
            fi
        fi

        # MongoDB
        if [[ "$DATABASE_URL" =~ ^mongodb ]]; then
            if command -v mongosh &> /dev/null; then
                if mongosh "$DATABASE_URL" --eval "db.adminCommand('ping')" &> /dev/null; then
                    success "MongoDB connection successful"
                else
                    error "MongoDB connection failed"
                    return 1
                fi
            else
                warning "mongosh not available, skipping MongoDB check"
            fi
        fi
    fi

    return 0
}

# ------------------------------------------------------------------------------
# Redis Health Check
# ------------------------------------------------------------------------------

check_redis() {
    if [ "$CHECK_REDIS" = "true" ]; then
        log "Checking Redis connectivity..."

        if [ -z "${REDIS_URL:-}" ]; then
            warning "REDIS_URL not set, skipping Redis check"
            return 0
        fi

        if command -v redis-cli &> /dev/null; then
            # Extract host and port from REDIS_URL
            REDIS_HOST=$(echo "$REDIS_URL" | sed -E 's|redis://([^:]+):.*|\1|')
            REDIS_PORT=$(echo "$REDIS_URL" | sed -E 's|redis://[^:]+:([0-9]+).*|\1|')

            if redis-cli -h "$REDIS_HOST" -p "$REDIS_PORT" ping &> /dev/null; then
                success "Redis connection successful"
            else
                error "Redis connection failed"
                return 1
            fi
        else
            warning "redis-cli not available, skipping Redis check"
        fi
    fi

    return 0
}

# ------------------------------------------------------------------------------
# SSL Certificate Check
# ------------------------------------------------------------------------------

check_ssl_certificate() {
    if [[ "$URL" =~ ^https ]]; then
        log "Checking SSL certificate..."

        DOMAIN=$(echo "$URL" | sed -E 's|https://([^/]+).*|\1|')

        if command -v openssl &> /dev/null; then
            CERT_EXPIRY=$(echo | openssl s_client -servername "$DOMAIN" -connect "$DOMAIN:443" 2>/dev/null | \
                         openssl x509 -noout -enddate 2>/dev/null | cut -d= -f2)

            if [ -n "$CERT_EXPIRY" ]; then
                success "SSL certificate is valid until: $CERT_EXPIRY"

                # Check if certificate expires soon (within 30 days)
                EXPIRY_SECONDS=$(date -d "$CERT_EXPIRY" +%s 2>/dev/null || date -j -f "%b %d %H:%M:%S %Y %Z" "$CERT_EXPIRY" +%s 2>/dev/null)
                CURRENT_SECONDS=$(date +%s)
                DAYS_UNTIL_EXPIRY=$(( (EXPIRY_SECONDS - CURRENT_SECONDS) / 86400 ))

                if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
                    warning "SSL certificate expires in $DAYS_UNTIL_EXPIRY days!"
                fi
            else
                warning "Could not verify SSL certificate"
            fi
        else
            verbose "openssl not available, skipping SSL check"
        fi
    fi
}

# ------------------------------------------------------------------------------
# Performance Metrics
# ------------------------------------------------------------------------------

check_performance() {
    log "Checking performance metrics..."

    if command -v curl &> /dev/null; then
        # Get detailed timing information
        curl -s -o /dev/null -w "\
DNS Lookup:        %{time_namelookup}s
TCP Connection:    %{time_connect}s
TLS Handshake:     %{time_appconnect}s
Time to First Byte: %{time_starttransfer}s
Total Time:        %{time_total}s
Download Speed:    %{speed_download} bytes/s
" "$URL$HEALTH_ENDPOINT"

        success "Performance metrics collected"
    fi
}

# ------------------------------------------------------------------------------
# Summary Report
# ------------------------------------------------------------------------------

generate_report() {
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "Health Check Summary"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "URL:              $URL"
    echo "Health Endpoint:  $HEALTH_ENDPOINT"
    echo "Timestamp:        $(date -u +"%Y-%m-%d %H:%M:%S UTC")"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# ------------------------------------------------------------------------------
# Main
# ------------------------------------------------------------------------------

main() {
    log "Starting health check script"

    # HTTP health checks
    check_http_with_retries "$HEALTH_ENDPOINT"
    HEALTH_STATUS=$?

    # Readiness check (optional)
    if [ -n "$READY_ENDPOINT" ]; then
        check_http_health "$READY_ENDPOINT" || true
    fi

    # Additional checks
    check_database
    check_redis
    check_ssl_certificate
    check_performance

    # Generate report
    generate_report

    # Exit with appropriate code
    if [ $HEALTH_STATUS -eq 0 ]; then
        success "All health checks passed! ✓"
        exit 0
    else
        error "Health checks failed! ✗"
        exit 1
    fi
}

# ------------------------------------------------------------------------------
# Execute
# ------------------------------------------------------------------------------

main "$@"
