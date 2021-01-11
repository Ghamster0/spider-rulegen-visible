import { initApp } from "@spider-rulegen/app-frontend"
import { EventEmitter } from "events"

initApp(createBridge(), 'app')

function createBridge() {
    const emitter = new EventEmitter()
    emitter.oldEmit = emitter.emit

    function listenPort(port) {
        let disConnected = false
        port.onMessage.addListener(msg => {
            if (msg.type === "msg-from-backend" || msg.type === "databus-to-rulegen") {
                emitter.oldEmit.apply(emitter, [msg.type, msg.data])
            }
        })
        port.onDisconnect.addListener(() => { disConnected = true })

        emitter.emit = function () {
            const args = arguments
            if (args[0] === 'msg-to-backend' || args[0] === 'rulegen-to-databus') {
                !disConnected && port.postMessage({ type: args[0], data: args[1] })
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