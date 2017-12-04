const ExpoCI = require("./expo-ci");


ExpoCI.publish({
  projectDir: "expo-ci-example",
  releaseChannel: "master",
}).then(
  () => {
    console.log("cli end");
  },
  e => {
    console.error("cli error", e);
  }
);