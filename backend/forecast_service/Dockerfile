FROM node:20-slim

WORKDIR /app

RUN apt-get update && apt-get install -y openssl

COPY package*.json ./
RUN npm install

COPY prisma ./prisma/
RUN npx prisma generate || echo "No prisma schema found, skipping..."

COPY . .

ENV PORT 8080
EXPOSE 8080

CMD ["npx", "ts-node", "src/server.ts"]
