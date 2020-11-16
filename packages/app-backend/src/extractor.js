
import domParser from './domParser';
import str2time from './timeFormat';

let getTextNode = (dom) => {
    if (!dom) {
        return '';
    }
    let nodes = [...dom.childNodes]
        .map(
            (node) => {
                return node.nodeValue
            }
        );
    return nodes.join('').trim();
};

let queryDirectSelectorAll = function (dom, selector) {
    if (!dom || !selector) {
        return [];
    }
    if (/^meta([^a-z]+|$)/i.test(selector)) {
        dom = document.head;
    }
    let deep = selector.split(/\s*>\s*/).length;
    let result = [];
    let domeList = dom.querySelectorAll(selector);
    for (let i = 0, len = domeList.length; i < len; i++) {
        let domItem = domeList[i];
        // if (getDomDeep(dom, domItem) === deep) {
        //     result.push(domItem);
        // }
        result.push(domItem);
    }
    return result;
};

let queryDirectSelector = function (dom, selector) {
    return queryDirectSelectorAll(dom, selector)[0] || null;
};


let template2Data = async function (template, parentDom, waiteTime = 0) {
    if (!template || !template.method) {
        return [];
    }
    let selectorExist = false;
    if (template.method === 'object') {
        selectorExist = await waitSelector(template.selector, parentDom, waiteTime);
    } else if (template.method === 'table') {
        selectorExist = await waitSelector(template.selector, parentDom, waiteTime * 3);
    } else {
        selectorExist = await waitSelector(template.selector, parentDom, waiteTime);
    }
    waiteTime = waiteTime * 0.5;
    if (!selectorExist) {
        if (template.method === 'object') {
            return {};
        } else if (template.method === 'table') {
            return [];
        } else {
            return '';
        }
    }
    if (template.method === 'object') {
        let domObj;
        if (template.selector) {
            domObj = queryDirectSelector(parentDom, template.selector);
        } else {
            domObj = parentDom;
        }
        let result = {};
        for (let tpl of template.listData) {
            let value = await template2Data(tpl, domObj, waiteTime);
            if (!isEmpty(value)) {
                if (result[tpl.listName]) {
                    if (Array.isArray(value) && Array.isArray(result[tpl.listName])) {
                        result[tpl.listName] = result[tpl.listName].concat(value);
                    } else if (typeof value === 'object' && typeof result[tpl.listName] === 'object') {
                        result[tpl.listName] = Object.assign(result[tpl.listName], value);
                    } else if (typeof value === 'string' && typeof result[tpl.listName] === 'string') {
                        result[tpl.listName] = result[tpl.listName] + '\n' + value;
                    } else {
                        result[tpl.listName] = value;
                    }
                } else {
                    result[tpl.listName] = value;
                }
            }
        }
        return result;
    } else if (template.method === 'table') {
        let domObjList;
        if (template.selector) {
            domObjList = queryDirectSelectorAll(parentDom, template.selector);
        } else {
            domObjList = [parentDom];
        }
        let result = [];
        for (let i = 0, len = domObjList.length; i < len; i++) {
            let subDom = domObjList[i];
            let obj = {};
            let wt = i === 0 ? waiteTime : 0;
            for (let tpl of template.listData) {
                let value = await template2Data(tpl, subDom, wt);
                if (!isEmpty(value)) {
                    if (obj[tpl.listName]) {
                        if (Array.isArray(value) && Array.isArray(obj[tpl.listName])) {
                            obj[tpl.listName] = obj[tpl.listName].concat(value);
                        } else if (typeof value === 'object' && typeof obj[tpl.listName] === 'object') {
                            obj[tpl.listName] = Object.assign(obj[tpl.listName], value);
                        } else if (typeof value === 'string' && typeof obj[tpl.listName] === 'string') {
                            obj[tpl.listName] = obj[tpl.listName] + '\n' + value;
                        } else {
                            obj[tpl.listName] = value;
                        }
                    } else {
                        obj[tpl.listName] = value;
                    }
                }
            }
            if (!isEmpty(obj)) {
                result.push(obj);
            }
        }
        return result;
    } else {
        let domList;
        if (template.selector) {
            domList = queryDirectSelectorAll(parentDom, template.selector);
        } else {
            domList = [parentDom];
        }
        if (template.method === 'text' || template.method === 'nodetext') {
            let textList = [];
            let { attribute } = template, regexp;

            try {
                if (template.regexp) {
                    regexp = new RegExp(template.regexp);
                }
            } catch (e) {
            }

            for (let domItem of domList) {
                let textValue = '';
                if (attribute) {
                    let attrtxt = (domItem.getAttribute(attribute) || '').trim()
                    if (attrtxt) {
                        if (regexp && regexp.test(attrtxt)) {
                            textValue = attrtxt
                        }
                        else {
                            textValue = attrtxt
                        }
                    }
                }
                else if (domItem.nodeName === 'IMG') {
                    textValue = (domItem.src || '').trim();
                } else {
                    let _textValue = '';
                    if (template.method === 'text') {
                        _textValue = (domItem.innerText || domItem.textContent || '').trim();
                    }
                    else if (template.method === 'nodetext') {
                        _textValue = getTextNode(domItem);
                    }
                    if (regexp) {
                        regexp.test(_textValue) && (textValue = _textValue);
                    }
                    else {
                        textValue = _textValue;
                    }
                }
                if (textValue) {
                    textList.push(textValue);
                }
            }
            return textList.join('\n');
        } else if (template.method === 'number') {
            for (let domItem of domList) {
                let number = parseFloat((domItem.innerText || domItem.textContent || '').trim().replace(/^[^\d]*/, '').replace(/,/g, ''));
                if (!isNaN(number)) {
                    return number;
                }
            }
            return 0;
        } else if (template.method === 'html') {
            let htmlList = [];
            for (let domItem of domList) {
                htmlList.push((domItem.outerHTML || '').trim());
            }
            return htmlList.join('\n');
        } else if (template.method === 'img') {
            let imgList = [];
            let value;
            for (let domItem of domList) {
                if (domItem.nodeName === 'IMG') {
                    value = (domItem.src || '').trim();
                    if (value) {
                        imgList.push(value);
                    }
                } else {
                    let innerImgs = domItem.querySelectorAll('img');
                    for (let innerDom of innerImgs) {
                        value = (innerDom.src || '').trim();
                        if (value) {
                            imgList.push(value);
                        }
                    }
                }
            }
            return Array.from(new Set(imgList)).join('\n');
        } else if (template.method === 'link') {
            let aList = [];
            let value;
            for (let domItem of domList) {
                let hit = false;
                if (domItem.nodeName === 'A') {
                    hit = true;
                    value = (domItem.href || '').trim();
                    if (value) {
                        aList.push(value);
                    }
                } else {
                    let innerAs = domItem.querySelectorAll('a');
                    for (let innerDom of innerAs) {
                        hit = true;
                        value = (innerDom.href || '').trim();
                        if (value) {
                            aList.push(value);
                        }
                    }
                }
                if (!hit) {
                    while (domItem = domItem.parentNode) {
                        if (domItem.nodeName === 'A' || domItem === document.body) {
                            break;
                        }
                    }
                    if (domItem.nodeName === 'A') {
                        value = (domItem.href || '').trim();
                        if (value) {
                            aList.push(value);
                        }
                    }
                }
            }
            return Array.from(new Set(aList)).join('\n');
        }
        else if (template.method === 'time') {
            for (let domItem of domList) {
                let str = (domItem.innerText || domItem.textContent || '').trim();
                let time = str2time(str);
                if (time != '') {
                    return time;
                }
            }
            return '';
        }
        else if (template.method === 'imgtxt') {
            let textList = [];
            for (let domItem of domList) {
                let textValue = '';
                let child = (dom) => {
                    if (dom.hasChildNodes()) {
                        for (let cn of dom.childNodes) {
                            if (cn.nodeName === 'IMG') {
                                textValue += '#img#' + (cn.src || '').trim() + '#img#';
                            }
                            else if (cn.nodeName === '#text') {
                                textValue += cn.textContent;
                            }
                            else {
                                child(cn);
                            }
                        }
                    }
                }
                if (domItem.nodeName === 'IMG') {
                    textValue += '#img#' + (domItem.src || '').trim() + '#img#';
                }
                else {
                    child(domItem);
                }

                if (textValue) {
                    textList.push(textValue.trim());
                }
            }
            return textList.join('\n');
        }
        else {
            if (domParser[template.method]) {
                return domParser[template.method](domList);
            }
        }
    }
    return '';
};

let waitSelector = function (selector, parentDom, maxTime = 3000) {
    if (!selector || queryDirectSelector(parentDom, selector)) {
        return Promise.resolve(true);
    }
    if (maxTime <= 100) {
        return Promise.resolve(false);
    }
    return new Promise((resolve) => {
        let startTime = Date.now();
        let waitFuc = function () {
            setTimeout(() => {
                if (Date.now() - startTime > maxTime) {
                    return resolve(false);
                }
                if (queryDirectSelector(parentDom, selector)) {
                    return resolve(true);
                }
                waitFuc();
            }, 100);
        };
        waitFuc();
    });
};

let isEmpty = function (value) {
    if (typeof value === 'undefined') {
        return true;
    } else if (typeof value === 'string' && value === '') {
        return true;
    } else if (Array.isArray(value) && value.length === 0) {
        return true;
    } else if (typeof value === 'object' && (value === null || Object.keys(value).length === 0)) {
        return true;
    }
    return false;
};


export default async function (template, waitTime) {
    return await template2Data(template, document.body, waitTime || 1000);
};

// let test = async function (template) {
//     return await template2Data(template, document);
// };
//
// test(tem).then((data) => {
//     console.log(JSON.stringify(data))
// }, (e) => {
//     console.log(e)
// });