import { initApp } from "@spider-rulegen/app-frontend"
import { EventEmitter } from "events"

const port = chrome.runtime.connect({
    name: '' + chrome.devtools.inspectedWindow.tabId
})

initApp(createBridge(), 'app')

// setTimeout(() => {
//     port.postMessage({ type: 'selector:load', value: '.body' })
//     setTimeout(() => {
//         port.postMessage({ type: 'selector:deactive' })
//     }, 5000);
// }, 1000)

function createBridge() {
    const emitter = new EventEmitter()

    let oldEmit = emitter.emit
    emitter.emit = function () {
        let emitArgs = arguments
        console.log(emitArgs)
        if (emitArgs[0] === 'msg-to-backend') {
            port.postMessage(emitArgs[1])
        } else {
            oldEmit.apply(emitter, emitArgs)
        }
    }

    port.onMessage.addListener(e => {
        oldEmit.apply(emitter, ['msg-from-backend', e])
    })
    return emitter
}