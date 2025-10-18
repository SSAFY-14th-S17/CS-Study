FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install

EXPOSE 3000

CMD ["yarn", "dev", "--host"]