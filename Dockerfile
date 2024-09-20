FROM node:18 AS build

WORKDIR /app

RUN npm install -g @angular/cli@17.0.2

RUN npm install -g @ionic/cli@7.0.0

RUN rm -rf node_modules

COPY package*.json ./

RUN npm install --force

COPY . .

RUN ionic build --prod

FROM node:18 AS final

WORKDIR /usr/src/app

COPY --from=build /app/www ./www

RUN npm install --force -g serve

EXPOSE 7007

CMD ["serve", "-s", "www", "-p", "7007"]