chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.executeScript(tab.id, { file: "build/inject.js" }, () => {
        if (chrome.extension.lastError) {
            console.log(chrome.extension.lastError);
        }
    })
})