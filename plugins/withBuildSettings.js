const {
  withAppBuildGradle,
  withGradleProperties,
} = require("expo/config-plugins");
module.exports = function withAvenBuildSettings(config) {
  config = withGradleProperties(config, (config) => {
    const settings = {
      "org.gradle.jvmargs":
        "-Xmx1536m -XX:MaxMetaspaceSize=512m -XX:ReservedCodeCacheSize=128m -XX:CICompilerCount=2",
      "org.gradle.parallel": "false",
      "org.gradle.workers.max": "2",
      "kotlin.compiler.execution.strategy": "in-process",
    };
    for (const [key, value] of Object.entries(settings)) {
      config.modResults = config.modResults.filter(
        (item) => item.type !== "property" || item.key !== key,
      );
      config.modResults.push({ type: "property", key, value });
    }
    return config;
  });
  return withAppBuildGradle(config, (config) => {
    const marker = "// AVEN: keep native object paths short on Windows";
    if (!config.modResults.contents.includes(marker))
      config.modResults.contents +=
        "\n" +
        marker +
        '\nandroid { defaultConfig { externalNativeBuild { cmake { arguments "-DCMAKE_OBJECT_PATH_MAX=240", "-DCMAKE_JOB_POOLS=aven_compile=2", "-DCMAKE_JOB_POOL_COMPILE=aven_compile" } } } }\n';
    return config;
  });
};

