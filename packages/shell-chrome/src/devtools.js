let panelCreated = false


chrome.browserAction.onClicked.addListener(function (tab) {
    console.log(tab)
    !panelCreated && createPanel()
})

function createPanel() {
    chrome.devtools.panels.create('RuleGenerator', 'icons/icon.png', 'html/devtools-panel.html', panel => {
        console.log(panel)
        panelCreated = true
    })
}

