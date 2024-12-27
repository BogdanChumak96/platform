FROM node:16-alpine as development

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

FROM node:16-alpine as production

WORKDIR /usr/src/app

COPY package.json package-lock.json ./
RUN npm install --only=production

COPY --from=development /usr/src/app/dist ./dist

CMD ["node", "dist/apps/app/main.js"]