function getImg(selector){
    var node = document.querySelectorAll(selector)[0];
    if(node.tagName.toLowerCase() != "img"){
        node = node.getElementsByTagName('img')[0];
    }
    if(node && node.src)
        return node.src
    return ""
}

function getAttr(selector,attrName){
    var rs = [],
        node = document.querySelectorAll(selector);
    for(var i = 0; i < node.length; i++){
        rs.push(node[i].getAttribute(attrName))
    }
    return rs;
}

function getChildren(node){
    var rs = [],
    children = node.childNodes
    for(var c of children){
        if (c.innerText && c.innerText.trim() != ""){
            rs.push(c);
        }
    }
    return rs;
}

/***************************** 一、返回文本值的方法 ****************************/

// 返回对应标签的文本值
function getPlainText(selector){
    var fullText = document.querySelector(selector).innerText.trim();
    return fullText;
}

/***************************** 二、返回map的方法 ******************************/
// 如果根据selector选出了多个元素，则每个元素看做<k，v>，在其子节点中得到k和v，所有元素组成map。
// 只选择出一个元素,则根据其子节点的数量返回 map，返回对应标签的选择器，如果指定了 分隔符，则返回以分隔符分隔的 map，
function getMap(selectorDoms,splitor){
    var map = {},
    kvs = selectorDoms
    while(kvs.length == 1){
        kvs = getChildren(kvs[0]);
    }
    for(var element of kvs){
        var children = getChildren(element);
        if(children.length == 2){
            map[children[0].innerText.trim().replace(/[:|：]$/,"")] = children[1].innerText.trim().replace(/^[:|：]/,"")
        }
        if(children.length > 2 || children.length <=1){
            if(!splitor){
                splitor = /[:|：]/
            }
            var kv = element.innerText;
            var kvs = kv.split(splitor);
            if(kvs.length == 2){
                map[kvs[0]] = kvs[1]
            }else{
                if(kvs.length == 1){
                    kvs = kv.split(" ");
                }
                map[kvs[0]] = kv.replace(kvs[0],'')
            }
        }
    }
    return map
}

/*****************************  table 的处理   ************************************/
function getTableRows(trs,isobj=false){
    var rs = [];
    for(var i = 0; i < trs.length; i++){
        var rstd = [],
            tr = trs[i];
        var tds = tr.getElementsByTagName('td');
        if(tds.length){
            for(var j = 0; j < tds.length; j++){
                var td = tds[j];
                if(isobj){
                    rstd.push({
                        "text":td.innerText,
                        "col":Number(td.getAttribute("colspan")?td.getAttribute("colspan"):"1"),
                        "row":Number(td.getAttribute("rowspan")?td.getAttribute("rowspan"):"1")
                    });
                }else
                    rstd.push(td.innerText);
            }
            rs.push(rstd);
        }
        var ths = tr.getElementsByTagName('th');
        if(ths.length){
            for(var j = 0; j < ths.length; j++){
                var td = ths[j];
                if(isobj){
                    rstd.push({
                        "text":td.innerText,
                        "col":Number(td.getAttribute("colspan")?td.getAttribute("colspan"):"1"),
                        "row":Number(td.getAttribute("rowspan")?td.getAttribute("rowspan"):"1")
                    });
                }else
                    rstd.push(td.innerText);
            }
            rs.push(rstd);
        }
    }
    return rs;
}
function parseRows(rows){
    var tmpArr = []
    for(var rowIndex = 0; rowIndex < rows.length; rowIndex++){
        var row = rows[rowIndex];
        var cellIndex = 0;
        if(!tmpArr[rowIndex])
            tmpArr[rowIndex] = [];
        for(var item of row){
            // process rowspan/colspan
            for(var i = 0; i < item.col; i++){
                for(var j = 0; j < item.row; j++) {
                    if(!tmpArr[rowIndex + j])
                        tmpArr[rowIndex + j] = [];
                    while(tmpArr[rowIndex + j][cellIndex] || tmpArr[rowIndex + j][cellIndex]==''){
                        cellIndex++;
                    }
                    if(j == 0)
                        tmpArr[rowIndex + j][cellIndex] = item.text.replace(/\s/g,'');
                    else
                        tmpArr[rowIndex + j][cellIndex] = '';
                }
                cellIndex++;
            }
        }
    }
    var keys = [];
    if(!tmpArr[0])
        return keys
    for(var c = 0; c < tmpArr[0].length; c++){
        for(var r = 0; r < tmpArr.length; r++){
            keys[c] = keys[c]?keys[c]+(tmpArr[r][c]?"_"+tmpArr[r][c]:""):tmpArr[r][c];
        }
    }
    return keys;
}
function getTable(t){
    var tbody = [],
        thead = [];
    //t = document.querySelector(tableSelector);
    var th = t?t.getElementsByTagName('thead'):[];
    if(th &&th.length > 0){
        thead = getTableRows(th[0].getElementsByTagName('tr'),true);
    }
    var tb = t?t.getElementsByTagName('tbody'):[];
    if(tb && tb.length > 0){
        tbody= getTableRows(tb[0].getElementsByTagName('tr'),true);
    }
    return {
        "head":thead,
        "body":tbody
    }
}

function getRowLength(row){
    var len = 0;
    for (var obj of row){
        len += obj.col;
    }
    return len;
}

function getMaxRowLength(rows){
    var len = 0;
    for(var row of rows){
        len = len<getRowLength(row)?getRowLength(row):len;
    }
    return len;
}

function combine(keys,valarrs){
    var objs = []
    if(keys.length < 1)
        return objs
    for(var val of valarrs){
        var obj = {}
        for(var i = 0; i < keys.length; i++){
            obj[keys[i]] = val[i]?val[i].text:''
        }
        objs.push(obj)
    }
    return objs;
}

//根据<table>的selector 返回table数据
function parseTable(t){
    t = t[0];
    if(t.tagName.toLowerCase() != "table"){
        t = t.querySelector('table');
    }
    var rows = getTable(t).head.concat(getTable(t).body);
    var keyrows = [];
    var valrows = [];
    var len = getMaxRowLength(rows)
    for(var i =0; i<rows.length; i++){
        var row = rows[i];
        if(row.length == 1) {
            continue;
        }else if(row.length == len){
            if(keyrows.length == 0){
                keyrows = [row];
            }else{
                valrows = rows.slice(i,rows.length);
                break
            }
        }else {
            keyrows.push(row)
        }
    }
    var keys = parseRows(keyrows)
    return combine(keys,valrows)
}

export default {
    "map": getMap,
    "Dom2table": parseTable
};