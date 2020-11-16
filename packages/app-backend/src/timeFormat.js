const pattern1 = new RegExp("([a-z]+)\\.?[ ]{0,2}(\\d{1,2})[a-z]{0,2}[, ]{0,2}(\\d{4})");
const pattern2 = new RegExp("(\\d{1,2})[a-z]{0,2}[ ]{0,2}([a-z]+)\\.?[ ]{0,2}(\\d{4})");
const pattern3 = new RegExp("(前?\\d{2,4})[年\\-\\.\\)的 ]{1,3}(\\d{1,2})[月\\-\\. ]{1,3}(\\d{1,2})");
const pattern30 = new RegExp("(\\d{4})[/ ]{1,3}(\\d{1,2})[/ ]{1,3}(\\d{1,2})");
const pattern31 = new RegExp("(\\d{1,2})[月 ]{1,3}(\\d{1,2})");
const pattern32 = new RegExp("(\\d{1,3})[/ ]{1,3}(\\d{1,2})[/ ]{1,3}(\\d{2,4})");
const pattern4 = new RegExp("(\\d{4})[年\\-\\. ]{1,3}(\\d{1,2})");
// const pattern5 = new RegExp("(\\d{1,4})[\\-\\. ]{1,3}(\\d{1,4})");
const pattern5 = new RegExp("(\\d)+(日|天|个?月|年|分钟?|小?时|秒)(前|后)");
const pattern6 = new RegExp("((公元前|公元|约|约前|西元前|西元|前|距今)\\d+)");
const pattern7 = new RegExp("(\\d{2,4})年");	
const pattern8 = new RegExp("^\\d{3,4}"); 
const pattern9 = new RegExp("^(\\d{1,2})[/ ]{1,3}(\\d{1,2})");

const format = new Map();

format.set("零", "0");
format.set("一", "1");
format.set("二", "2");
format.set("三", "3");
format.set("四", "4");
format.set("五", "5");
format.set("六", "6");
format.set("七", "7");
format.set("八", "8");
format.set("九", "9");
format.set("０", "0");
format.set("〇", "0");
format.set("１", "1");
format.set("２", "2");
format.set("３", "3");
format.set("４", "4");
format.set("５", "5");
format.set("６", "6");
format.set("７", "7");
format.set("８", "8");
format.set("９", "9");
format.set("jan", "01");
format.set("feb", "02");
format.set("mar", "03");
format.set("apr", "04");
format.set("may", "05");
format.set("jun", "06");
format.set("jul", "07");
format.set("aug", "08");
format.set("sep", "09");
format.set("oct", "10");
format.set("nov", "11");
format.set("dec", "12");
format.set("。", ".");
format.set("．", ".");
format.set("，", ".");
format.set("·", ".");
format.set("－", "-");
format.set("号", "日");
format.set("曰", "日");
format.set("正", "1");
format.set("腊", "12");
format.set("冬", "11");

function convert(str) {
    str = str.trim();
    let changeStr = "";
    for (let c of str) 
    {
        if (format.get(c)) 
        {
            changeStr += format.get(c);
        } 
        else
            changeStr += c;
    }
    let p1 = new RegExp("\\d+十\\d+");
    let p2 = new RegExp("十\\d+");
    let match=changeStr.match(p1);
    if(match != null)
    {
        changeStr=changeStr.replace("十", "");
        return changeStr;
    }
    match=changeStr.match(p2);
    if(match != null)
    {
        changeStr=changeStr.replace("十", "1");
        return changeStr;
    }
    changeStr=changeStr.replace("十", "10");
    return changeStr;
}

function str2time(str) {
    let value = str.toLowerCase().trim();
    let testDate = new Date(value)
    if(!isNaN(testDate.getTime())) {
        return testDate.getTime();
    }
    value=convert(value);
    let year,month = '01',day = '01',date="";
    let match = value.match(pattern1);
    if(match != null)
    {
        month=match[1];
        if(month.length>=3)
        {
            let subMonth=month.substring(0,3);
            if(format.has(subMonth))
            {
                month=format.get(subMonth);
                day=match[2];
                year=match[3];
                date=year+"-"+month+"-"+ day.padStart(2,0);		
            }
            return new Date(date).getTime();
        }
    }
    match = value.match(pattern2);
    if(match != null)
    {
        month=match[2];
        if(month.length>=3)
        {
            let subMonth=month.substring(0,3);
            if(format.has(subMonth))
            {
                month=format.get(subMonth);
                day=match[1];
                year=match[3];
                date=year+"-"+month+"-"+ day.padStart(2,0);
            
            }  
            return new Date(date).getTime();
        }
    }
    match = value.match(pattern3);
    if(match != null)
    {

        year=match[1];
        month=match[2];
        day=match[3];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        return new Date(date).getTime();
    }
    match = value.match(pattern30);
    if(match != null)
    {
        year=match[1];
        month=match[2];
        day=match[3];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        
        return new Date(date).getTime();
    }
    match = value.match(pattern31);
    if(match != null)
    {
        year = new Date().getFullYear();
        month=match[1];
        day=match[2];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        
        return new Date(date).getTime();
    }
    match = value.match(pattern32);
    if(match != null)
    {
        let i=parseInt(match[1]);
        if(i>12)
        {
            year=match[1];
            month=match[2];
            day=match[3];
        }
        else
        {
            year=match[3];
            month=match[1];
            day=match[2];
        }
        
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        
        return new Date(date).getTime();
    }
    match = value.match(pattern4);
    if(match != null)
    {
        year=match[1];
        month=match[2];
        let i=parseInt(month);
        if(i>12)
        {
            month = '01'
        }
        
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
    
        return new Date(date).getTime();
    }
    match = value.match(pattern5);
    if(match != null)
    {
        let i=parseInt(match[1]);
        let j = match[2];
        let k = match[3];
        let minus = -1;
        let diff = 0;
        if (k == '后') {
            minus = 1;
        }

        if (j.indexOf('年') != -1) {
            diff = 1000 * 60 * 60 * 24 * 365 * i * minus;
        }
        if (j.indexOf('月') != -1) {
            diff = 1000 * 60 * 60 * 24 * 30 * i * minus;
        }
        if (j.indexOf('日') != -1 || j.indexOf('天') != -1) {
            diff = 1000 * 60 * 60 * 24 * i * minus;
        }
        if (j.indexOf('时') != -1) {
            diff = 1000 * 60 * 60 * i * minus;
        }
        if (j.indexOf('分') != -1) {
            diff = 1000 * 60 * i * minus;
        }
        if (j.indexOf('秒') != -1) {
            diff = 1000 * i * minus;
        }

        return new Date().getTime() + diff;
    }
    match = value.match(pattern6);
    if(match != null)
    {
        year=match[1];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        return new Date(date).getTime();
    }
    match = value.match(pattern7);
    if(match != null)
    {
        year=match[1];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        
        return new Date(date).getTime();
    }
    
    match = value.match(pattern8);
    if(match != null)
    {
        year=match[0];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        
        return new Date(date).getTime();
    }
    match = value.match(pattern9);
    if(match != null)
    {
        year = new Date().getFullYear();
        month=match[1];
        day=match[2];
        date=year+"-"+month.padStart(2,0)+"-"+ day.padStart(2,0);
        return new Date(date).getTime();
    }
    
    return date;
}

export default str2time;