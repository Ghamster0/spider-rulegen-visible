/**
 * Greated by lihua on 2018/5/22
 */

let normalizeTemplate = function (template) {
    template = {
        ...template
    };
    delete template.activeChildIndex;
    template.method = template.method || 'text';
    if (template.method !== 'table' && template.method !== 'object') {
        delete template.listData;

        template.selector = template.rawSelector.replace(/\s*>*\s*tbody\s*>\s*/i, ' ');
        return template;
    } else {
        delete template.rawSelector;
        template.listData = template.listData || [];
        let newList = [];
        for (let subTemplate of template.listData) {
            subTemplate = normalizeTemplate(subTemplate);
            newList.push(subTemplate);
        }
        template.listData = newList;
        template = getParentSelector(template);
        return template;
    }
};

let getParentSelector = function (template) {
    let templateList = template.listData;
    if (templateList.length === 0) {
        return template;
    }

    // if (templateList.length === 1) {
    //     if (template.method === 'table') {
    //         template.selector = templateList[0].selector;
    //         templateList[0].selector = '';
    //         return template;
    //     } else if (template.method === 'object') {
    //         template.selector = '';
    //         return template;
    //     }
    //
    // }
    let subSelectorList = templateList[0].selector.split(/\s+/);
    let parentSelector = '', preSelectorList = [];
    for (let selector of subSelectorList) {
        preSelectorList.push(selector);
        let preSelector = preSelectorList.join(' ');
        let success = true;
        for (let tpl of templateList) {
            if (tpl.selector.indexOf(preSelector) !== 0) {
                success = false;
                break;
            }
        }
        if (success) {
            parentSelector = preSelector;
        } else {
            break;
        }
    }
    parentSelector = parentSelector.replace(/\s*>\s*$/, '');
    if (parentSelector.length === templateList[0].selector.length) {
        if (template.method === 'object') {
            template.selector = '';
            return template;
        }
    }
    if (parentSelector.length > 0) {
        for (let tpl of templateList) {
            tpl.selector = tpl.selector.slice(parentSelector.length).replace(/^\s*>\s*/, '');
        }
    }
    template.selector = parentSelector;
    return template;
};

export const unNormalizeTemplate = (template, prefix = "") => {
    const rawSelector = prefix ? prefix + " " + template.selector : template.selector
    if (template.method === "table" || template.method === "object") {
        for (const ct of template.listData) {
            unNormalizeTemplate(ct, rawSelector)
        }
    } else {
        template.rawSelector = rawSelector
    }
    template.contents = ""
    return template
}

export default normalizeTemplate;