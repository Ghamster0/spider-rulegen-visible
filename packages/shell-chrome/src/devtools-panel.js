import { initApp } from "@spider-rulegen/app-frontend"
import { EventEmitter } from "events"

initApp(createBridge(), 'app')

function createBridge() {
    let port = connectToBg()
    let connected = true

    const emitter = new EventEmitter()
    let oldEmit = emitter.emit
    emitter.emit = function () {
        let emitArgs = arguments
        if (emitArgs[0] === 'msg-to-backend') {
            connected && port.postMessage(emitArgs[1])
        } else {
            oldEmit.apply(emitter, emitArgs)
        }
    }

    function onConnected(p) {
        p.onMessage.addListener(e => {
            oldEmit.apply(emitter, ['msg-from-backend', e])
        })
        p.onDisconnect.addListener(() => {
            connected = false
        })
    }
    onConnected(port)

    function reConnect() {
        port = connectToBg()
        connected = true
        onConnected(port)
    }

    chrome.devtools.network.onNavigated.addListener(() => {
        if (connected) {
            const itvl = setInterval(() => {
                console.log("Interval onNavigated run")
                if (!connected) {
                    reConnect()
                    clearInterval(itvl)
                }
            }, 50)
        } else {
            reConnect()
        }
    })
    return emitter
}

function connectToBg() {
    return chrome.runtime.connect({
        name: '' + chrome.devtools.inspectedWindow.tabId
    })
}