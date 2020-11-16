import { initBackend } from '@spider-rulegen/app-backend'

const port = chrome.runtime.connect({
    name: 'content-script'
})

function sendMessage(msg) {
    port.postMessage(msg)
}

function handlers(onMessage, onDisconnect) {
    port.onMessage.addListener(onMessage)
    port.onDisconnect.addListener(onDisconnect)
}

initBackend(sendMessage, handlers)