FROM node:20 AS build

WORKDIR /app

RUN npm install -g @angular/cli@21.2.5

RUN npm install -g @ionic/cli@7.2.1

RUN rm -rf node_modules

COPY package*.json ./

RUN npm install --force

COPY . .

RUN ionic build --prod

FROM node:20 AS final

WORKDIR /usr/src/app

COPY --from=build /app/www/browser ./www/ml

COPY --from=build /app/www/browser/index.html ./www/index.html

COPY src/assets/env/env.js ./www/ml/assets/env/env.js

RUN npm install --force -g serve

EXPOSE 7007

CMD ["serve", "-s", "www", "-p", "7007"]
