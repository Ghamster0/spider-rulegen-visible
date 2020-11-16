import { SelectorGadget } from "@spider-rulegen/vendor"
import { EventEmitter } from 'events'
import { getUrls } from "./utils"
import extractor from "./extractor"

const emitter = new EventEmitter()
SelectorGadget.prototype.emitter = emitter

let pathStore = ''
emitter.on("setPath", (e) => {
    if (pathStore !== e) {
        pathStore = e
        sendMessage({ type: "selector:update", value: e })
    }
})

function onExtractUrls(cssSelector) {
    sendMessage({ type: "extracted:urls", value: getUrls(cssSelector) })
}

async function onExtractContents(template) {
    const content = await extractor(template, 0)
    sendMessage({ type: "extracted:contents", value: content })
}

function onMessage(e) {
    switch (e.type) {
        case "selector:load":
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
            onExtractUrls(e.value)
            break
        case "extract:contents":
            onExtractContents(e.value)
            break
    }
}

function onDisconnect() {
    SelectorGadget.toggleClose()
}

export function initBackend(sendMessage, handlers) {
    window.sendMessage = sendMessage
    handlers(onMessage, onDisconnect)
}
