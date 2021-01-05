import { initApp } from "@spider-rulegen/app-frontend"
import { EventEmitter } from "events"

initApp(createBridge(), 'app')

function createBridge() {
    const emitter = new EventEmitter()
    emitter.oldEmit = emitter.emit

    function listenPort(port) {
        let disConnected = false
        port.onMessage.addListener(msg => emitter.oldEmit.apply(emitter, ['msg-from-backend', msg]))
        port.onDisconnect.addListener(() => { disConnected = true })

        emitter.emit = function () {
            if (arguments[0] === 'msg-to-backend') {
                !disConnected && port.postMessage(arguments[1])
            } else {
                emitter.oldEmit.apply(emitter, arguments)
            }
        }
    }

    connectToBg(listenPort)
    // onNavigate, reconnect
    chrome.devtools.network.onNavigated.addListener(() => { connectToBg(listenPort) })

    return emitter
}

function connectToBg(cb) {
    const port = chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
    })
    cb(port)
}