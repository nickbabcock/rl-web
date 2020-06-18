FROM node:lts

# Install zopfli for a better gzip and sponge from moreutils
RUN apt-get update && apt-get install --no-install-recommends -y moreutils zopfli && rm -rf /var/lib/apt/lists/*

RUN curl -O -L https://github.com/gohugoio/hugo/releases/download/v0.68.3/hugo_extended_0.68.3_Linux-64bit.deb && \
    dpkg -i hugo_extended_0.68.3_Linux-64bit.deb 

# Install rust
RUN set -eux; curl https://sh.rustup.rs -sSf | sh -s -- --profile minimal -y && \
  . ~/.cargo/env && \
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh -s

# Build rust dependencies
COPY ./crate /usr/src/rl-web/crate
RUN . ~/.cargo/env && cd /usr/src/rl-web/crate && wasm-pack build --release

WORKDIR /usr/src/rl-web

# Gather js dependencies
COPY package.json package-lock.json ./
RUN CYPRESS_INSTALL_BINARY=0 npm ci

COPY . .

# First we build the wasm bundle with our optimizations. Then we create the
# hashed filename version and modify the source code directly. We have to
# modify the source as else parcel will derive the same hash when only the
# /crate directory has been modified.
RUN set -eux; . ~/.cargo/env && \
  npm run build && \
  find public -iname "*.js" -o -iname "*.wasm" -o -iname "*.html" -o -iname "*.png" -o -iname "*.replay" | xargs zopfli

FROM nginx:stable-alpine
COPY --from=0 /usr/src/rl-web/public /usr/share/nginx/html
COPY dev/nginx.conf /etc/nginx/conf.d/default.conf
