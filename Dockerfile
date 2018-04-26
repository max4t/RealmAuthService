FROM node:alpine as tester

WORKDIR /app
COPY package.json ./
RUN apk add --no-cache libc6-compat \
    && apk add --no-cache --virtual .build-deps python make g++ \
    && npm install \
    && apk del .build-deps

RUN chown node .

USER node
COPY *.js ./
COPY test ./test

RUN cd test && ./run.sh



FROM node:alpine

WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY --from=tester /app/*.js ./
COPY --from=tester /app/node_modules/ ./node_modules/

RUN chown node .
USER node
EXPOSE 8080

CMD ["node", "./index.js"]
