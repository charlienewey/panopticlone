// --------- Helper functions

var sanitise = function (str) {
  // sanitise file names/directory names
  return str.replace(/[ ,;:\/\\\.]/g, "_").replace(/(-|_)+/g, "$1");
};


// --------- Chrome API interaction

var createNotification = function (message, title) {
  // lazy way of sending lots of similar notifications
  if (! title) {
    title = "Panopticlone";
  }

  chrome.notifications.create(null, {
    "iconUrl": "../../res/img/icon_64.png",
    "message": message,
    "title": title,
    "type": "basic"
  });
};

var download = function (sessions) {
  var session;
  for (var i = 0; i < sessions.length; i += 1) {
    session = sessions[i];

    // make download parameters
    folderName = sanitise(session.folderName);
    sessionName = sanitise(session.sessionName);
    filename = Math.round(session.date / 1000) + "-" + sessionName + ".mp4";

    // send the download request
    chrome.downloads.download({
      "conflictAction": "prompt",
      "filename": folderName + "/" + filename,
      "method": "GET",
      "url": session.videoURL.replace("Embed", "Social")
    });

    // send a notification
    createNotification("Downloading \"" + session.sessionName + "\"...");
  }
}


// --------- Message handling

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.download) {
    download(message.download);
  }
});
