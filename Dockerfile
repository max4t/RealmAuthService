FROM node:alpine as tester

WORKDIR /app
COPY package.json ./
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache --virtual .build-deps python make g++ \
    && npm install \
    && apk del .build-deps
COPY *.js test ./

USER node

RUN cd test && ./run.sh



FROM node:alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=tester /app/*.js /app/node_modules ./

USER node
EXPOSE 8080

CMD ["node", "./index.js"]
