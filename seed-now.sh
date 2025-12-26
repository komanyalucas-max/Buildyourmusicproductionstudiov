#!/bin/bash

echo "🌱 Starting Database Seeding Process..."
echo "========================================="
echo ""

# Make the API call to seed demo data
response=$(curl -X POST \
  https://hetkbfmltdayxjcjlcow.supabase.co/functions/v1/make-server-bbbda4f3/seed-demo-data \
  -H "Content-Type: application/json" \
  -w "\n%{http_code}" \
  -s)

# Extract HTTP status code (last line)
http_code=$(echo "$response" | tail -n 1)

# Extract response body (everything except last line)
body=$(echo "$response" | sed '$d')

echo "HTTP Status: $http_code"
echo ""

if [ "$http_code" = "200" ]; then
    echo "✅ SUCCESS! Database seeded successfully!"
    echo ""
    echo "Response:"
    echo "$body" | jq '.' 2>/dev/null || echo "$body"
else
    echo "❌ ERROR! Seeding failed"
    echo ""
    echo "Response:"
    echo "$body"
fi

echo ""
echo "========================================="
echo "Done!"
