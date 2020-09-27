import { initApp } from "@spider-rulegen/app-frontend"
import { EventEmitter } from "events"

initApp(createBridge(), 'app')

function createBridge() {
    const emitter = new EventEmitter()
    emitter.oldEmit = emitter.emit
    let connected = false

    function cb(port) {
        connected = true
        port.onDisconnect.addListener(() => {
            connected = false
        })
        port.onMessage.addListener(e => {
            emitter.oldEmit.apply(emitter, ['msg-from-backend', e])
        })
        emitter.emit = function () {
            let emitArgs = arguments
            if (emitArgs[0] === 'msg-to-backend') {
                connected && port.postMessage(emitArgs[1])
            } else {
                emitter.oldEmit.apply(emitter, emitArgs)
            }
        }
    }

    connectToBg(cb)
    // onNavigate, reconnect
    chrome.devtools.network.onNavigated.addListener(() => { connectToBg(cb) })

    return emitter
}

function connectToBg(cb) {
    const port = chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
    })
    cb(port)
}