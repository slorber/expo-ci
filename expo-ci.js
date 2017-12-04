const path = require("path");

const {Project, Doctor, PackagerLogsStream} = require('xdl');


function setupLogger(projectDir) {
  const packagerLogsStream = new PackagerLogsStream({
    projectRoot: projectDir,
    onStartBuildBundle: () => {
      console.log("onStartBuildBundle")
    },
    onProgressBuildBundle: percent => {
      if (percent % 20 === 0) {
        console.log("onProgressBuildBundle", percent);
      }
    },
    onFinishBuildBundle: (err, startTime, endTime) => {
      console.log("onFinishBuildBundle", err);
    },
    updateLogs: updater => {
      let newLogChunks = updater([]);
      newLogChunks.forEach(newLogChunk => {
        console.log("newLogChunk", newLogChunk.msg)
      });
    },
  });
}


function addUrlReleaseChannel(url, releaseChannel) {
  if (url.indexOf("?") === -1) {
    return url + "?release-channel=" + encodeURIComponent(releaseChannel);
  }
  else {
    return url;
  }
}


function publish({
                   projectDir,
                   releaseChannel,
                 }) {

  if (projectDir) {
    projectDir = path.resolve(process.cwd(), projectDir);
  } else {
    projectDir = process.cwd();
  }

  console.log("projectDir", projectDir);
  console.log("releaseChannel", releaseChannel);

  // setupLogger(projectDir);

  return Doctor.validateLowLatencyAsync(projectDir)
    .then(status => {
      if (status === Doctor.FATAL) {
        throw new Error(`There is an error with your project. Maybe projectDir is wrong?`);
      }
    })
    .then(() => {
      console.log("starting packager");
      return Project.startAsync(projectDir, {}, true)
        .then(() => {
          console.log("packager started. building...");
          return Project
            .publishAsync(projectDir, {
              releaseChannel: releaseChannel,
            })
        })
        .then((result) => {
          const url = addUrlReleaseChannel(result.url, releaseChannel);
          console.log("Expo project published", url);
          return Project.stopAsync(projectDir).then(() => {
            console.log("packager stopped");
            return url;
          });
        });
    });
}

exports.publish = publish;




