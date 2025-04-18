# Gunakan image yang ringan dan aman
FROM docker-language-server:slim

# Set direktori kerja
WORKDIR /app

# Install openssl (dibutuhkan Prisma)
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Salin file dependensi terlebih dahulu (untuk caching)
COPY package*.json ./

# Install dependensi aplikasi
RUN npm install

# Salin semua source code ke container
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Buka port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
