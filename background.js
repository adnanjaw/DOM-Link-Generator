chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === "showOptions") {
        chrome.runtime.openOptionsPage();
    }
});

chrome.runtime.onInstalled.addListener(function () {
    chrome.runtime.openOptionsPage();
});