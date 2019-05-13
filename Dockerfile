FROM node

# Install rust
RUN set -eux; curl https://sh.rustup.rs -sSf | sh -s -- -y && \
  . ~/.cargo/env && \
  cargo install wasm-pack

# Install zopfli for a better gzip
RUN apt-get update && apt-get install -y zopfli && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/src/rl-web
COPY . .
RUN set -eux; . ~/.cargo/env && \
  cd crate && \
  wasm-pack build --release && \
  cd .. && \
  npm ci && \
  npm run build && \
  zopfli dist/*.js dist/*.wasm dist/*.css dist/*.html

FROM nginx:stable-alpine
COPY --from=0 /usr/src/rl-web/dist /usr/share/nginx/html
COPY assets/nginx.conf /etc/nginx/conf.d/default.conf
