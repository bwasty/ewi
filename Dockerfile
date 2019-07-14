FROM node:10.16.0-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:1.17
COPY --from=0 /app/build /usr/share/nginx/html
