import normalizeTemplate, { unNormalizeTemplate } from "./normalizeTemplate";
import { v4 as uuidv4 } from 'uuid'

const version = require('../../package.json').version

export const configPageReg = /crawl\/.+\/config/

export function getDatabusTabId() {
    return new Promise(r => {
        /* global chrome*/
        chrome.tabs.query({}, (tabs) => {
            for (const tab of tabs) {
                if (tab.url.match(configPageReg)) {
                    r(tab.id)
                    return
                }
            }
            r()
        });
    })
}

export function databusTabUrl(id) {
    return new Promise(r => {
        /* global chrome*/
        chrome.tabs.query({}, (tabs) => {
            const tab = tabs.find(i => i.id === id)
            r(tab ? tab.url : "")
        })
    })
}

const ensureDatabusReady = tabId => {
    chrome.tabs.executeScript(tabId, {
        code: `
        if(!window.RULEGEN_INITED){
          window.RULEGEN_INITED=true
          chrome.runtime.onMessage.addListener(function(request){
            if(request.type==="rulegen-to-databus"){
              window.postMessage(request)
            }
          })
          window.addEventListener("message", e=>{
            if(e.data.type==="databus-to-rulegen"){
              chrome.runtime.sendMessage(e.data)
            }
          })
        }
        `,
    });
}

export const normalizeTemplatesNamed = (groups) => {
    for (const group of groups) {
        for (const rule of group.rules) {
            if (rule.contentsConf) {
                rule.contentsConf = normalizeTemplate(rule.contentsConf)
            }
        }
    }
}

export const initDatabusListener = (store) => {
    /* global bridge*/
    bridge.on("databus-to-rulegen", e => {
        console.log("databus -> rulegen", e)
        if (e.err) {
            window.alert(e.err)
            return
        }
        if (window.confirm("从Databus平台导入配置？")) {
            if (e.mode === "multi") {
                const groups = e.groups
                for (const group of groups) {
                    for (const rule of group.rules) {
                        if (rule.contentsConf) {
                            rule.contentsConf = unNormalizeTemplate(rule.contentsConf)
                        }
                    }
                }
                store.dispatch("loadMulti", { groups, indicator: e.indicator })
            } else {
                const rule = e.rule
                rule.id = uuidv4()
                if (rule.contentsConf) {
                    rule.contentsConf = unNormalizeTemplate(rule.contentsConf)
                }
                store.dispatch("loadSingle", { rule, indicator: e.indicator })
            }
        }
    })
}

export function sendToDatabus(msg, tabId) {
    if (!tabId) {
        return
    }
    ensureDatabusReady(tabId)
    msg.tabId = tabId
    msg.version = version
    window.bridge.emit("rulegen-to-databus", msg)
}

export const getNetlocName = (netloc) => {
    let str = netloc.scheme ? netloc.scheme + "://" + netloc.host : netloc.host;
    str = netloc.port ? str + ":" + netloc.port : str;
    return str;
};