let panelCreated = false

function createPanel() {
    chrome.devtools.panels.create('RuleGenerator', 'icons/icon.png', 'html/devtools-panel.html', panel => {
        console.log(panel)
        panelCreated = true
    })
}

createPanel()
