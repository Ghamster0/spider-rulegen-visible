export function getUrls(cssSelector) {
    const domList = document.querySelectorAll(cssSelector)
    const urls = []
    const hasSeen = new Set()

    function cb(node) {
        if (hasSeen.has(node)) {
            return false
        } else {
            hasSeen.add(node)
            if (node.nodeName === 'A') {
                const url = (node.href || '').trim()
                if (url) {
                    urls.push(url)
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
    return urls;
}

function domTraverse(domItem, cb) {
    const nodes = domItem.childNodes
    if (nodes) {
        for (const node of nodes) {
            const goInto = cb(node)
            if (goInto) {
                domTraverse(node, cb)
            }
        }
    }
}