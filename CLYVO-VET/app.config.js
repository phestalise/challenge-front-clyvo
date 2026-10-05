const { execSync } = require("child_process");

// O hash do commit é embutido no app na hora do build para a tela "Sobre o
// App" mostrar exatamente de qual versão do código o APK foi gerado.
// Ordem: variável COMMIT_HASH (build manual) → EAS_BUILD_GIT_COMMIT_HASH
// (build no EAS) → git local.
function getCommitHash() {
  const fromEnv =
    process.env.COMMIT_HASH || process.env.EAS_BUILD_GIT_COMMIT_HASH;
  if (fromEnv) return fromEnv.trim();

  try {
    return execSync("git rev-parse HEAD", {
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString()
      .trim();
  } catch {
    return "desconhecido";
  }
}

module.exports = ({ config }) => ({
  ...config,
  extra: {
    ...config.extra,
    commitHash: getCommitHash(),
    buildDate: new Date().toISOString(),
  },
});
