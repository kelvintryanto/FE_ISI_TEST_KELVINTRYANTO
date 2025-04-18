# Gunakan base image Bun
FROM oven/bun:1

# Set working directory di dalam container
WORKDIR /src

# Salin semua file dari direktori lokal ke dalam container
COPY . .

# Install dependencies
RUN bun install

# Jalankan migrate Prisma (opsional, jika ingin otomatis saat build)
# RUN bunx prisma migrate deploy

# Build aplikasi Next.js
RUN bun run build

# Jalankan aplikasi Next.js
CMD ["bun", "run", "start"]
