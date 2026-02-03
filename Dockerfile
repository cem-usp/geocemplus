# Estágio de Base
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /usr/src/app
# Aqui copiamos apenas os pacotes para aproveitar o cache do npm install
COPY package*.json ./

# Estágio de Build (Ajustado)
FROM base AS build
RUN npm install
# O segredo: Esta linha invalida o cache se qualquer arquivo mudar!
COPY . . 
RUN npm run build

# Estágio de Produção
FROM node:18-alpine AS production
WORKDIR /usr/src/app
# Ele pega o resultado do estágio acima, que agora foi forçado a atualizar
COPY --from=build /usr/src/app/build ./build
RUN npm install -g serve 
CMD ["serve", "-s", "build"]