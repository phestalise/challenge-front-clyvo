const { getDefaultConfig } = require("expo/metro-config");
const { createProxyMiddleware } = require("http-proxy-middleware");

const config = getDefaultConfig(__dirname);

// A API (clyvovet-api-nnke.onrender.com) ainda não libera CORS, então o
// navegador bloqueia fetch direto nela quando rodamos "expo start --web".
// Esse proxy só existe no servidor de desenvolvimento: o browser chama
// "/api-proxy/..." (mesma origem, sem CORS) e o Metro repassa a chamada pra
// API real por fora do navegador (servidor-a-servidor, onde CORS não se
// aplica). Não afeta iOS/Android — lá o fetch já vai direto pra API, sem
// passar por isso.
const API_TARGET = "https://clyvovet-api-nnke.onrender.com";

config.server = {
  ...config.server,
  enhanceMiddleware: (middleware, metroServer) => {
    const proxy = createProxyMiddleware({
      target: API_TARGET,
      changeOrigin: true,
      pathRewrite: { "^/api-proxy": "" },
      logger: console,
    });

    return (req, res, next) => {
      if (req.url && req.url.startsWith("/api-proxy")) {
        proxy(req, res, next);
        return;
      }

      middleware(req, res, next);
    };
  },
};

module.exports = config;
