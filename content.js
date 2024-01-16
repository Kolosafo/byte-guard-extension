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

chrome.runtime.onMessage.addListener(async function (request, sender, sendResponse) {
  if (request.action === "extractPrivacyPolicy") {
    const privacyPolicyElement =
      document.querySelector('a[href*="privacy"]') ||
      document.querySelector('a[href*="terms"]');

    if (privacyPolicyElement) {
      const privacyPolicyURL = privacyPolicyElement.href;
      // Now you can fetch or extract content from the privacy policy URL as needed
      const response = await postData({ url: privacyPolicyURL });
      console.log("Response -->", response);
    } else {
      console.log("Privacy Policy not found on this page.");
    }
  }
});
