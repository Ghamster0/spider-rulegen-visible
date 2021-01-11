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
        connectToDatabus(port)
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
        console.log("Inject backend finish: ", res)
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

function connectToDatabus(port) {
    function handler(msg) {
        if (msg.type === "rulegen-to-databus") {
            msg.portId = port.name
            chrome.tabs.sendMessage(msg.data.tabId, msg)
        }
    }
    port.onMessage.addListener(handler)
    port.onDisconnect.addListener(() => port.onMessage.removeListener(handler))
}

chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "databus-to-rulegen") {
        if (ports[request.portId]) {
            const port = ports[request.portId]["devtools"]
            port.postMessage(request)
        }
    }
})
