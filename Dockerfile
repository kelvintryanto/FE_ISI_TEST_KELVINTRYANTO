# Gunakan base image yang lebih stabil dan bisa pakai openssl
FROM node:22-slim

# Set direktori kerja
WORKDIR /app

# Salin file dependensi terlebih dahulu (agar layer caching lebih efisien)
COPY package*.json ./ 
COPY prisma/schema.prisma ./prisma/schema.prisma @prisma/

# Install dependensi Node.js
RUN npm install

# Salin seluruh isi project ke dalam container
COPY . .

# Generate Prisma Client di dalam container
RUN npx prisma generate

# Ekspos port aplikasi Next.js
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "run", "start"]
