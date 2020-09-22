// the background script runs all the time and serves as a central message
// hub for each vue devtools (panel + backend) instance.

const ports = {}

chrome.runtime.onConnect.addListener(port => {
    let tab
    let name
    if (isNumeric(port.name)) {
        tab = port.name
        name = 'devtools'
        injectBackend(+port.name)
    } else {
        tab = port.sender.tab.id
        name = 'backend'
    }

    if (!ports[tab]) {
        ports[tab] = {
            devtools: null,
            backend: null
        }
    }
    ports[tab][name] = port

    if (ports[tab].devtools && ports[tab].backend) {
        doublePipe(tab, ports[tab].devtools, ports[tab].backend)
    }
})

function isNumeric(str) {
    return +str + '' === str
}

function injectBackend(tabId) {
    chrome.tabs.executeScript(tabId, {
        file: 'build/backend.js'
    }, function (res) {
        console.log(res)
    })
}

function doublePipe(id, one, two) {
    one.onMessage.addListener(lOne)
    function lOne(message) {
        if (message.event === 'log') {
            return console.log('tab ' + id, message.payload)
        }
        console.log('devtools -> backend', message)
        two.postMessage(message)
    }
    two.onMessage.addListener(lTwo)
    function lTwo(message) {
        if (message.event === 'log') {
            return console.log('tab ' + id, message.payload)
        }
        console.log('backend -> devtools', message)
        one.postMessage(message)
    }
    function shutdown() {
        console.log('tab ' + id + ' disconnected.')
        one.onMessage.removeListener(lOne)
        two.onMessage.removeListener(lTwo)
        one.disconnect()
        two.disconnect()
        ports[id] = null
    }
    one.onDisconnect.addListener(shutdown)
    two.onDisconnect.addListener(shutdown)
    console.log('tab ' + id + ' connected.')
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    console.log("request: ", request)
    console.log("sender: ", sender)
})