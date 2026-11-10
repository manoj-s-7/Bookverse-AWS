
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_DATA_MODE=live
ARG VITE_GOOGLE_BOOKS_API_KEY

ENV VITE_DATA_MODE=${VITE_DATA_MODE}
ENV VITE_GOOGLE_BOOKS_API_KEY=${VITE_GOOGLE_BOOKS_API_KEY}

RUN npm run build

FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
