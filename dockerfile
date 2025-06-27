# Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Final Stage
FROM node:20-alpine

ARG NODE_ENV=${NODE_ENV}
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json ./

RUN npm install --only=production
RUN npm install -g pm2

# Copy build output 
COPY --from=builder /app/dist ./dist

# Copy correct env file
COPY .env.${NODE_ENV} .env

EXPOSE ${PORT}

CMD ["npm", "run", "dist/main"]


