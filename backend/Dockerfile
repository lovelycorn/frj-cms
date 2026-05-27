ARG NPM_REGISTRY=https://registry.npmjs.org

FROM node:20-bookworm-slim AS deps
ARG NPM_REGISTRY
WORKDIR /app
ENV npm_config_optional=true
ENV CI=true
COPY package*.json ./
RUN npm config set registry ${NPM_REGISTRY} \
  && npm ci --include=optional \
  && npm cache clean --force

FROM node:20-bookworm-slim AS builder
WORKDIR /app
ENV NODE_ENV=production
ENV npm_config_optional=true
ENV CI=true
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm cache clean --force \
  && npm run build

FROM node:20-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV npm_config_optional=true
ENV CI=true
COPY --from=builder /app ./
EXPOSE 1337
CMD ["npm", "run", "start"]
