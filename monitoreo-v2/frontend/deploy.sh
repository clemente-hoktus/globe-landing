#!/usr/bin/env bash
set -euo pipefail

BUCKET="power-monitor-frontend"
DISTRIBUTION="E1SNFETXON2VSI"
REGION="us-east-1"

cd "$(dirname "$0")"

echo "▸ Building..."
npm run build

echo "▸ Syncing assets to S3 (excluding docs/)..."
aws s3 sync dist/ "s3://${BUCKET}/" --exclude "docs/*" --region "$REGION"

echo "▸ Setting no-cache on index.html..."
aws s3 cp "s3://${BUCKET}/index.html" "s3://${BUCKET}/index.html" \
  --cache-control "no-cache, no-store, must-revalidate" \
  --content-type "text/html" \
  --metadata-directive REPLACE \
  --region "$REGION"

echo "▸ Invalidating CloudFront..."
aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION" \
  --paths "/*" \
  --region "$REGION" \
  --output text --query 'Invalidation.Id'

echo "✓ Deployed to power-monitor.cloud"
