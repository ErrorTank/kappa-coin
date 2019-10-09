const wait = (fn, amount = 2000) => new Promise((res, rej) => {
    setTimeout(() => {
        fn();
        res();
    }, amount)
});
const getBase64=(file)=>new Promise((resolve)=>{
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        resolve({file, src:reader.result, fileID: file.lastModified});
    };
});

const formatMoney = (money, fix = 0) => {
    let fixPath = money.toString().split(".")[1];
    let tempFix = fix ? fix : fixPath !== undefined ? fixPath.length : 0;
    let str = Number(money).toFixed(tempFix).toString();

    let [relative, fixed] = str.includes('.') ? str.split(".") : [str, null];
    let spliceStrPaths = (total, str) => {
        if(str.length>3){
            return spliceStrPaths([str.slice(str.length - 3),...total], str.slice(0, str.length - 3))
        }
        return [str.slice(0, str.length), ...total]
    };
    let paths = spliceStrPaths([],relative);
    return paths.join(",")+ (fixed ? ("."+ fixed) : "");
};

let buildParams = (obj) => {
    let params = Object.keys(obj);
    let val = Object.values(obj);
    let result = val.reduce((total, cur, i) => {
        if(cur !== undefined && cur !== null){
            return total+`${params[i]}=${cur}&`
        }
        return total;
    }, "?");
    if(result === "?"){
        return ""
    }
    return result.slice(0, result.length-1);
};

let pronounce = (word, count, tail) => {
  return word + (count > 1 ? tail : "");
};


export {
    wait,
    getBase64,
    buildParams,
    pronounce,
    formatMoney
}