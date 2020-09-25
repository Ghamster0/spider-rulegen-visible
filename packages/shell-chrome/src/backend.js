import { SelectorGadget } from "@spider-rulegen/vendor"
import { EventEmitter } from 'events'
import { getUrls } from "./utils"

const emitter = new EventEmitter()
SelectorGadget.prototype.emitter = emitter

const port = chrome.runtime.connect({
    name: 'content-script'
})

port.onMessage.addListener(handleMessageFromDevtools)
port.onDisconnect.addListener(handleDisconnect)

let pathStore = ''

emitter.on("setPath", (e) => {
    if (pathStore !== e) {
        pathStore = e
        sendMessageToDevtools({ type: "selector:update", value: e })
    }
})

function sendMessageToDevtools(msg) {
    port.postMessage(msg)
}

function handleMessageFromDevtools(e) {
    switch (e.type) {
        case "selector:load":
            console.log("backend - load path: ", e.value)
            // ensure open
            const sg = SelectorGadget.toggleOpen()
            pathStore = sg.refreshFromPath({ value: e.value })
            break
        case "selector:deactive":
            SelectorGadget.toggleClose()
            break
        case "location:href":
            window.location.href = e.value
            break
        case "extract:urls":
            sendMessageToDevtools({ type: "extracted:urls", value: getUrls(e.value) })
    }
}

function handleDisconnect() {
    SelectorGadget.toggleClose()
}

