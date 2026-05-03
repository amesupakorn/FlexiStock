#!/bin/bash
# Script to seed data for FlexiStock
DB_URL="postgresql://postgres:6743@136.110.11.74:5432/flexistock"

echo "🌱 Seeding main forecast data..."
psql "$DB_URL" -f seed_forecast.sql

echo "📉 Seeding slow-selling product for demonstration..."
psql "$DB_URL" -f seed_slow_product.sql

echo "✅ Done!"
