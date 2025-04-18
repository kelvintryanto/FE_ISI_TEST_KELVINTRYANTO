# Gunakan image resmi Node.js
FROM node:18-slim

# Set direktori kerja
WORKDIR /app

# Install dependensi sistem yang diperlukan Prisma
RUN apt-get update -y && apt-get install -y openssl

# Salin semua file ke dalam image
COPY . .

# Install dependensi project
RUN npm install

# Generate Prisma client
RUN npx prisma generate

# Ekspos port aplikasi
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
