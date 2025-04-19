# Gunakan base image yang lebih stabil dan bisa pakai openssl
FROM node:22-slim

# Set direktori kerja
WORKDIR /app

RUN apt-get update -y && apt-get install -y openssl netcat-openbsd
# Salin file dependensi terlebih dahulu (agar layer caching lebih efisien)
COPY package*.json ./ 
COPY prisma ./prisma

# Install dependensi Node.js
RUN npm install

# Generate Prisma Client di dalam container
RUN npx prisma generate

# Salin seluruh isi project ke dalam container
COPY . .

COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

# Ekspos port aplikasi Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["./entrypoint.sh"]