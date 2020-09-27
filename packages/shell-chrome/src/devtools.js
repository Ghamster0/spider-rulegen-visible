let panelCreated = false

function createPanel() {
    chrome.devtools.panels.create('RuleGenerator', 'icons/icon.png', 'html/devtools-panel.html', panel => {
        panelCreated = true
    })
}

createPanel()
