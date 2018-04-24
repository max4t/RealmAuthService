FROM node:alpine

WORKDIR /app

COPY package.json ./
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache --virtual .build-deps python make g++ \
    && npm install \
    && apk del .build-deps

COPY index.js config.js ./

USER node

EXPOSE 8080

CMD ["npm", "start"]
