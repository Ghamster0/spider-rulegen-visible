export function getUrls(cssSelector) {
    if (!cssSelector) {
        return []
    }
    const domList = document.querySelectorAll(cssSelector)
    const urls = new Set()
    const hasSeen = new Set()

    function cb(node) {
        if (hasSeen.has(node)) {
            return false
        } else {
            hasSeen.add(node)
            if (node.nodeName === 'A') {
                const url = (node.href || '').trim()
                if (url) {
                    urls.add(url)
                }
                return false
            } else {
                return true
            }
        }
    }

    for (const domItem of domList) {
        domTraverse(domItem, cb)
    }
    return Array.from(urls);
}

function domTraverse(domItem, cb) {
    const goInto = cb(domItem)
    if (goInto && domItem.childNodes) {
        for (const node of domItem.childNodes) {
            domTraverse(node, cb)
        }
    }
}