const filter = {
  url: [{ urlMatches: "https://www.google.com/" }],
};

chrome.webNavigation.onCompleted.addListener(
  () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "extractPrivacyPolicy" });
    });
    console.log("I am working apparently, new worker");
  },
  { urls: ["<all_urls>"] }
);
