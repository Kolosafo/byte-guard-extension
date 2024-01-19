// Listen for messages from the background script

// THIS FUNCTION GO HELP US EXECUTE THE POPUP ACTION
function updatePopupContent(data) {
  const dataContainer = document.getElementById("data-container");
  dataContainer.style.display = "block";
  const privacySummaryContainer = document.getElementById(
    "privacy-summary-list-cont"
  );

  // IF NO DATA (false) THEN SET SUMMARY TO NO DATA
  if (!data) privacySummaryContainer.textContent = "No privacy data available";

  chrome.storage.local.get(["privacyPolicyData"], function (result) {
    if (result.privacyPolicyData.summary === "null") {
      dataContainer.style.display = "none";
      loading.textContent =
        "BE CAREFUL! We couldn't find privacy policy information for this website.";
      return;
    }

    let savedText = result.privacyPolicyData;

    const privacySummaryContainer = document.getElementById(
      "privacy-summary-list-cont"
    );
    const dataCollectedList = document.getElementById("data-list-cont");
    // Check if there is saved text data | Because chrome removes data when you close and open the pop up
    if (savedText) {
      privacySummaryContainer.textContent = JSON.stringify(
        savedText.summary,
        null,
        2
      );
      dataCollectedList.textContent = JSON.stringify(
        savedText.data_collected,
        null,
        2
      );
    } else {
      privacySummaryContainer.textContent = "No privacy data available";
    }
  });
}

// GET STORED PRIVACY INFO
window.onload = function () {
  const dataContainer = document.getElementById("data-container");
  const privacySiteHeader = document.getElementById("privacy-summary-header");
  chrome.runtime.onMessage.addListener(function (request) {
    if (request.action === "initiateLoading") {
      // Forward the JSON data to the popup script
      dataContainer.style.display = "none";
      const loading = document.getElementById("loading");
      loading.textContent = "Loading...";
    }
  });

  // THE REASON FOR THE FUNCTION BELOW IS TO NOT MAKE AN API CALL JUST BECAUSE USER IS IN ANOTHER PART OF THE WEBSITE LIKE /something
  // WE HAVE TO CLEAN THE URL TO KNOW IF THE CURRENT TAB IS A CHILD OF THE SAME URL WE ALREADY SUMMARIZED THEIR
  //PRIVACY POLICY DATA.
  function areSameParentDomains(url1, url2) {
    // Function to extract base domain
    function getBaseDomain(url) {
      // Remove protocol (http:// or https:// and www) if present
      let withoutProtocol = url.replace(/^https?:\/\//, "");
      let domain = withoutProtocol.split("/")[0];
      domain = domain.replace(/^www\./, "");

      return domain;
    }
    privacySiteHeader.textContent = `${getBaseDomain(
      url1
    )}'s privacy summary and User Data Collected`;

    // Extract base domains
    let baseDomain1 = getBaseDomain(url1);
    let baseDomain2 = getBaseDomain(url2);
    // Compare base domains
    return baseDomain1 === baseDomain2;
  }
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.local.get(["privacyPolicyData"], function (result) {
      let savedText = result.privacyPolicyData;
      const sameWebsite = areSameParentDomains(
        tabs[0].url,
        savedText.source_url
      );
      console.log(tabs[0].url === savedText.source_url);
      if (sameWebsite) {
        updatePopupContent(true);
        loading.textContent = "";
        dataContainer.style.display = "block";
      } else {
        dataContainer.style.display = "none";
        loading.textContent =
          "Refresh page to get this website's privacy summary. Then allow the page to finish loading so we can fully analyze.";
      }
    });
  });
};
