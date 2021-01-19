export function stringSplit(s) {
    return s.split("\n").map((url) => url.trim()).filter((url) => url !== "")
}

export const download = (fileName, text) => {
    let element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', fileName);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

export const isExpandable = (templateOrMethod) => {
    let method = templateOrMethod
    if (templateOrMethod && templateOrMethod.method) {
        method = templateOrMethod.method
    }
    return method === "table" || method === "object"
}