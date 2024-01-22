// THIS FILE IS FOR WILL HANDLE ONLY DOM UPDATES UNRELATED TO CHROME API

const myCheckbox = document.getElementById("myCheckbox"); // CHECK BOX
chrome.storage.local.get(["isChecked"], function (status) {
  myCheckbox.checked = status.isChecked;
});
let initialCheckStatus = myCheckbox.checked;
myCheckbox.addEventListener("change", (e) => {
  const isChecked = e.target.checked;
  myCheckbox.checked = isChecked;
  chrome.storage.local.set({ isChecked });
});

// DROPDOWN MENU
const openBtn = document.querySelector(".open-btn");
const summaryDropdown = document.querySelector(".summary-dropdown");

openBtn.addEventListener("click", () => {
  summaryDropdown.classList.toggle("open");
});
