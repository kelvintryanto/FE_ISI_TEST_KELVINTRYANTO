#!/bin/sh

# Tunggu database siap
echo "Waiting for database to be ready..."
until nc -z database 5432; do
  sleep 1
done
echo "Database is ready! ✅"

if [ "$NODE_ENV" != "production" ]; then
  npx prisma migrate reset --force
fi

# Jalankan migrate dev
npx prisma migrate dev --name init

# Lanjutkan dengan start server
npm run dev
