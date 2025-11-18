FROM node:18-slim

# Install LibreOffice
RUN apt-get update && \
    apt-get install -y libreoffice && \
    apt-get clean

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Build the NestJS project
RUN npm run build

# Expose port if your app uses one (e.g., 3000)
EXPOSE 4000

CMD ["node", "dist/main.js"]
