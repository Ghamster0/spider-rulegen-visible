import { SelectorGadget } from "@spider-rulegen/vendor"
import { EventEmitter } from 'events'

const emitter = new EventEmitter()
SelectorGadget.prototype.emitter = emitter

const port = chrome.runtime.connect({
    name: 'content-script'
})

port.onMessage.addListener(handleMessageFromDevtools)
port.onDisconnect.addListener(handleDisconnect)

let pathStore = ''

emitter.on("setPath", (e) => {
    console.log(e)
    if (pathStore !== e) {
        pathStore = e
        sendMessageToDevtools({ type: "selector:update", value: e })
    }
})

function sendMessageToDevtools(msg) {
    port.postMessage(msg)
}

function handleMessageFromDevtools(e) {
    if (e.type === "selector:load") {
        console.log("backend - load path: ", e.value)
        // ensure open
        const sg = SelectorGadget.toggleOpen()
        pathStore = sg.refreshFromPath({ value: e.value })
    } else if (e.type === "selector:deactive") {
        SelectorGadget.toggleClose()
    }
}

function handleDisconnect() {
    SelectorGadget.toggleClose()
}

