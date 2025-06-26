FROM node:20-alpine AS builder

WORKDIR /app

COPY ./package.json ./

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install; \
        else npm install --only=production; \
        fi
        
COPY --from=builder /app/dist ./dist

EXPOSE $PORT

CMD ["node", "dist/main"]