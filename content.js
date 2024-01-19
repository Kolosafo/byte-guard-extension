async function postData(data) {
  try {
    const response = await fetch("http://127.0.0.1:8000/api/index/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Add any additional headers if needed
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const jsonResponse = await response.json();
    return jsonResponse;
  } catch (error) {
    console.error("Error:", error.message);
    throw error;
  }
}

chrome.runtime.onMessage.addListener(async function (
  request,
  sender,
  sendResponse
) {
  if (request.action === "extractPrivacyPolicy") {
    const privacyPolicyElement =
      document.querySelector('a[href*="privacy"]') ||
      document.querySelector('a[href*="terms"]');

    if (privacyPolicyElement) {
      // If we have a privacy policy start loading
      chrome.runtime.sendMessage({ action: "initiateLoading" });
      const privacyPolicyURL = privacyPolicyElement.href;
      const response = await postData({
        policyUrl: privacyPolicyURL,
        sourceUrl: request.data,
      });

      // store response in local storage to persist state
      chrome.storage.local.set({ privacyPolicyData: response }, function () {
        console.log("Text data saved after API call", response);
      });
    } else {
      console.log("Privacy Policy not found on this page.");
      // store response in local storage to persist state
      chrome.storage.local.set(
        {
          privacyPolicyData: {
            data_collected: "null",
            summary: "null",
            source_url: request.data,
          },
        },
        function () {
          console.log("Text data saved after API call", response);
        }
      );
    }
    // Send a message to the background script with AI summarized privacy policy data or null in a case where we cant find policy data for a site

    chrome.runtime.sendMessage(
      { action: "initiatePopup", data: true },
      function (response) {
        console.log(response.message);
      }
    );
  }
});
