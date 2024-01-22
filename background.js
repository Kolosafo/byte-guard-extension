/* 
BLOCK ALL URLS UNDER THE LIST LABELED HARMFUL TO CHILDREN
This is for the child protection feature
*/
import { sitesToBlock } from "./utils/sitesToBlock.js";

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  chrome.storage.local.get(["isChecked"], function (status) {
    console.log("CHECKBOXER", status.isChecked);
    // BLOVK SITES ONLY WHEN CHECKED
    if (status.isChecked) {
      const blockedSiteFound = sitesToBlock.some((blockedSite) => {
        return details.url.includes(blockedSite);
      });

      if (blockedSiteFound) {
        console.log("BLOCKING!!");
        chrome.tabs.update(details.tabId, {
          url: "https://www.google.com",
        });
      }
    }
  });
});

/*


PRIVACY POLICY AI SUMMARY FEATURE


*/
const filter = {
  url: [{ urlMatches: "https://www.google.com/" }],
};

// EXTRACTING PRIVACY POLICY DATA
chrome.webNavigation.onCompleted.addListener(
  () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {
        action: "extractPrivacyPolicy",
        data: tabs[0].url, // THIS DATA WILL BE THE SOURCES URL I WILL USE TO DETERMINE
        //WHETHER TI SHOW STORE INFO FOR THE RIGHT PAGE
      });
    });
    console.log("I am working apparently, new worker");
  },
  { urls: ["<all_urls>"] }
);

// POP UP TO DISPLAY SUMARRIZED PRIVACY POLICY INFO

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "initiatePopup") {
    // Forward the JSON data to the popup script
    chrome.runtime.sendMessage({
      action: "updatePopupContent",
      data: request.data,
    });

    // Optional: Send a response back to the content script
    sendResponse({
      message: `Initiating popup with JSON data in the background script - ${request.data}`,
    });
  }
});
