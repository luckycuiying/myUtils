var utils = {
    // listToArray: 实现将类数组 转化为数组
    listToArray: function(likeAry) {
        var ary = [];
        try {
            ary = Array.prototype.slice.call(likeAry);
        } catch (e) {
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i]
            }
        }
        return ary;
    },
    // 把JSON格式的字符串转换为JSON格式的对象
    jsonParse: function(jsonStr) {
        return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr + ")");
    },
    isArray: function(obj) {
        return Array.isArray(obj) || Object.prototype.toString.call(obj) === '[object Array]';
    },
    isObject: function(obj) {
        return Object.prototype.toString.call(obj) === '[object,Object]';
    },
    isWindow: function(obj) {
        return obj != null && obj == obj.window;
    },
    // 判断一下是不是字面量的对象
    isPlainObject: function(obj) {
        return this.isObject(obj) && !this.isWindow(obj) && Object.getPrototypeOf(obj) == Object.prototype;
    },
    // 深度拷贝 单个对象深复制
    extend: function(target, source) {
        for (let key in source) {
            if (this.isPlainObject(source[key]) || this.isArray(source[key])) {
                if (this.isPlainObject(source[key]) && !this.isPlainObject(target[key])) {
                    target[key] = {};
                }
                if (this.isArray(source[key]) && !this.isArray(target[key])) {
                    target[key] = [];
                }
                this.extend(target[key], source[key]);
            } else if (source[key] != undefined) {
                target[key] = source[key];
            }
        }
        return target;
    },
    // 多个对象深复制
    deepExtend: function(eles) {
        let args = Array.prototype.slice.call(arguments, 1);
        args.forEach((arg) => this.extend(eles, arg));
        return eles;
    },
    // 浅拷贝 对象：
    simpleClone: function(target) {
        var obj = {};
        for (var key in target) {
            obj[key] = target[key]
        }
        return obj;
    },
    /*
     * 格式化日期
     * @method format
     * @static
     * @param{Date} d 日期对象
     * @param {string}  pattern  日期的格式(y年M月d天h小时m分钟s秒) 默认值为 'yyyy-MM-dd'
     * @prototype retun {string} 返回format 后的字符串
     * @ example 
     * var d = new Date();
     * alert(format(d,'yyyy年M月d日')，format(d,'yyyy-MM-dd')，format(d,'dd-MM-Yyy')，format(d,'yyyy-MM-dd hh:mm:ss'))
     */
    formatDate: function(d, pattern) {
        pattern = pattern || 'yyyy-MM-dd';
        var y = d.getFullYear().toString(),
            o = {
                M: d.getMonth() + 1, // getMonth
                d: d.getDate(),
                h: d.getHours(),
                m: d.getMinutes(),
                s: d.getSeconds(),
            };
        pattern = pattern.replace(/(y+)/ig, function(a, b) {
            return y.substr(4 - Math.min(4, b.length));
        });
        for (var key in o) {
            pattern = pattern.replace(new RegExp('(' + key + '+)', 'g'), function(a, b) {
                return (o[key] < 10 && b.length > 1) ? "0" + o[key] : o[key];
            })
        }
        return pattern;
    },
    // 小于两位数的补白
    zore: function(val) {
        return val < 10 ? '0' + val : val;
    },
    /*
     * 倒计时
     * @param{string} targetTime目标时间
     * example  
     * var oDiv = document.getElementById('box');
        let timer = setInterval(function(){
            oDiv.innerHTML ="距离跨年还有：" + utils.countDown('2019-1-1 0:0:0')
        },1000);
     */
    countDown: function(targetTime) {
        var targetStrTime = targetTime,
            nowTime = new Date().getTime(), // 获取的总毫秒数
            gmtTime = new Date(targetStrTime.replace(/-/g, '/')), //GMT(Greenwich Mean Time)代表格林尼治标准时间
            targetTime = gmtTime.getTime(),
            difftime = targetTime - nowTime;
        if (difftime > 0) {
            var mounths = Math.floor(difftime / (1000 * 60 * 60 * 24 * 30)),
                remainTime = difftime - (mounths * 30 * 24 * 60 * 60 * 1000);
            var days = Math.floor(remainTime / (24 * 60 * 60 * 1000)),
                remainTime = remainTime - (days * 24 * 60 * 60 * 1000);
            var hours = Math.floor(remainTime / (60 * 60 * 1000)),
                remainTime = remainTime - (hours * (60 * 60 * 1000));
            var minutes = Math.floor(remainTime / (60 * 1000)),
                remainTime = remainTime - (minutes * (60 * 1000));
            var seconds = Math.floor(remainTime / 1000);
            var resltTime = this.zore(mounths) + '月' + this.zore(days) + '天' + this.zore(hours) + '小时' + this.zore(minutes) + '分' + this.zore(seconds) + '秒';
            return resltTime;
        } else {
            window.clearInterval(timer);
        }
    },
    /*
     * 冒泡数组排序
     * i:数组比较的轮数是length-1次(不用和自己比)
     * j:代表每一轮需要比较的次数(因为每一轮比较完后就会把最大哪一个放到后面，所以j在比较时不仅不和自己比较还不用和每轮比较后放到后的的比)
     * 交换位置：使用的不利用空变量方法
     * flag: 标识，判断是否还需要下一轮比较
     */
    bubbleSort: function(arr) {
        var flag = false; // 这种优化方式针对的是不存在重复的数组，重复多了，就停止排序了。
        for (var i = 0; i < arr.length - 1; i++) {
            for (var j = 0; j < arr.length - 1 - i; j++) {
                if (arr[j] > arr[j + 1]) {
                    arr[j] = arr[j] + arr[j + 1];
                    arr[j + 1] = arr[j] - arr[j + 1];
                    arr[j] = arr[j] - arr[j + 1];
                    flag = true;
                }
                if (flag) {
                    flag = false;
                } else {
                    break;
                }
            }
        }
        flag = null;
        return arr;
    },
    /*
     * 快速数组排序
     * arr.length<=1:停止递归拆分的条件
     * pointVal:{number} 是基准点的值,以他为参考点 
     * 
     */
    quickSort: function(arr) {
        if (arr.length <= 1) {
            return arr;
        }
        var pointIndex = Math.floor(arr.length / 2),
            middleArr = arr.splice(pointIndex, 1);
        pointVal = middle[0]; //数组里面第一项取值
        var leftArr = [],
            rightArr = [];
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            cur > pointVal ? rightArr.push(cur) : leftArr.push(cur);
        }
        return this.quickSort(leftArr).concat(middleArr, this.quickSort(rightArr))
    },
    /* sort排序
     * param: flag {number} 升序还是降序，默认值是 -1，有小到大
     *@ example 
     * var ary = [{name:'lisi',age:1},{name:'zhangsan',age:4},{name:'wangwu',age:9}]
     * 按照姓名和年龄数字排序
     */
    sort: function(arr) {
        arr.sort(function(a, b) {
            var cur = parseFloat(a),
                next = parseFloat(b);
            if (isNaN(cur) || isNaN(next)) {
                return (a['name'].localeCompare(b['name']))
            }
            return (cur - next)
        })
        return arr;
    },
    /* 数组去重
     * 对象不存在重复的属性名原理来做数组去重
     * i--: 因为splice(i,1)得删除导致数组塌陷索引值少一位。
     */
    unRepeat: function(arr) {
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            if (obj[cur] == cur) {
                arr.splice(i, 1);
                i--;
            } else {
                obj[cur] = cur;
            }
        }
        obj = null;
        return arr;
    },
    /* 数组去重
     *  循环那前一项和后一项比较，如果相等就是重复了，就删除
     * j--: 因为splice(i,1)得删除导致数组塌陷索引值少一位。
     */
    unRepeat2: function(arr) {
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            for (var j = i + 1; j < arr.length; j++) {
                if (cur == arr[j]) {
                    arr.splice(j, 1);
                    j--;
                }
            }
        }
        return arr;
    },
    uniqueEs6: function(arr) {
        return Array.from(new Set(arr))
    },
    /*
     * 原生ajax
     * @options [object] 对象统一传值
     */
    ajaxF: function(options) {
        var _defaul = {
            url: "", // 请求地址
            type: 'get', // 请求方式
            dataType: 'json', // 设置请求回来的内容格式
            async: 'true', // 异步请求还是同步请求
            data: null, // 放在请求主体中的参数内容（post发送参数)
            getHead: null, // 当readyState ===2 的时候执行的回调函数
            sucess: null // 当readyState ===4 的时候执行的回调函数
        };
        // 使用用户自己传进来的值覆盖我们的默认值
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                _defaul[key] = options[key];
            }
        }
        // 如果当前的请求方式是get,我们需要在url 的末尾添加随机数
        if (_defaul.type === 'get') {
            _defaul.type.indexOf('?') >= 0 ? _defaul.url += "&" : _defaul.url += "?";
            _defaul.url += '=' + Math.random();
        }
        var xhr = new XMLHttpRequest();
        xhr.open('_defaul.type', '_defaul.url', _defaul.async);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var val = xhr.responseText;
                    //如果传递参数值是json,说明获取的应该是JSON 格式的对象
                    if (_defaul.dataType === "json") {
                        val = this.jsonParse(val)
                    }
                    _defaul.success && _defaul.success.call(xhr, val)

                } else {
                    console.error(xhr.statusText)
                }
            }
            if (xhr.readyState === 2) {
                if (typeof _defaul.getHead === 'function') {
                    _defaul.getHead.call(xhr);
                }
            }
        }
        xhr.send(null)
    },
    ajaxPost: function() {
        var xhr = new XMLHttpRequest();
        xhr.open('post', 'http://localhost:3000/getNotes?aa=foor', true);
        xhr.onreadystatechange = function() {
            // xhr.readyState 是ajax 的状态码： 0：unsend 当前请求未发送；
            // 1：opend url 地址已经打开(发送前的参数已经配置完成)
            // 2：headers_received 响应头信息已接收
            // 3：loading 主要返回的内容已正在服务器端进行处理
            // 4：响应主体内容已经成功返回到客户端
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    console.log(xhr.responseText);
                } else {
                    console.error(xhr.statusText)
                }
            }
        }
        //200 OR ^2\d{2} (200或者以2开头的 ) 都代表响应主体的内容已经成功返回了
        //301 : 永久重定向/ 永久转义
        //302: 临时重定向/临时转移
        //304： 本次获取的数据内容是读取缓存中的数据

        //400：客户端传递给服务器的参数出现错误
        //401：无权限访问
        //403: 禁止访问
        //404：访问客户端的页面地址不存在
        //500： 未知的服务器错误
        //503： 服务器已经超负荷
        // post 方式传参数
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
        xhr.send("foo=bar&lorem=ipsum");
    },
    /*
        获取地址栏中URL地址问号传递的参数值
        https://www.baidu.com/s?wd=javascript&rsv_spt=1&issp=1
        目标：把问号传递的参数值分别的解析出来
        obj = {wd:’javascript’,rsv_spt:1,issp:1}
     */
    queyUrlParameter: function(url) {
        var quesIndex = url.indexOf('?'),
            obj = {};
        if (quesIndex === -1) {
            return obj;
        }
        url = url.substr(quesIndex + 1);
        var ary = url.split('&');
        for (var i = 0; i < ary.length; i++) {
            var curAry = ary[i].split('=');
            obj[curAry[0]] = curAry[1];
        }
        return obj;
    },
    /*
        //获取4位 0-61之间的随机数
        var arg=[];
        for(var i=0;i<4;i++){
         arg.push(getRandom(0,61));
        }
        console.log(arg)
     */
    getRandom: function(n, m) {
        n = Number(n);
        m = Number(m);
        if (isNaN(m) || isNaN(n)) {
            return Math.round();
        }
        if (n > m) {
            var temp = n;
            n = m;
            m = temp;
        }
        return Math.round(Math.random() * (m - n) + n);
    },
    arrIdSort: function(arr, arr2) {
        var ary = [];
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            for (var j = 0; j < arr2.length; j++) {
                cur2 = arr2[j]
                if (cur['id'] == cur2['id']) {
                    ary.push(cur2)
                }
            }
        }
        return ary;
    },
    mapOrder:function (array, order, key) {

        array.sort(function(a, b) {
            var A = a[key],
                B = b[key];

            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }
        });

        return array;
    },
    // 获取字符串中出现次数最多的字符,并且获取出现的次数
    moreStr:function(str){
        var ary =[],obj={},maxNum=0;
        str.replace(/[a-z]/gi,function(){
            var val = arguments[0];
            obj[val]>=1?obj[val]+=1:obj[val]=1;
        });
        for(var key in obj){
            obj[key]>maxNum? maxNum=obj[key] :null
        }
        for(var key in obj){
            obj[key]===maxNum?ary.push(key) :null;
        }
        return {ary, maxNum};
    },
    // javascript字符串中每个单词的首字母大写化问题
    titleCase: function(str){
        var ary = str.toLowerCase().split(' ');
        var result = ary.map((val)=>{
            return val.replace(val.charAt(0),val.charAt(0).toUpperCase());
        })
        return result.join(' ');
    }

}

  //var str = '2018-02-07 20:40:05';  转换成 2018年02月07日 20小时 40分 05秒
String.prototype.myTimeFormat = function myTimeFormat(){
        var ary =[],
        // reg = /(\d+)/g
        reg = /^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g;
        console.log(reg.exec('2018/02/18'))
        // reg=/^(\d{4})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:\s+)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})(?:-|\/|\.|:)(\d{1,2})$/g;
        this.replace(reg,function(){
            console.log(arguments)
            ary=([].slice.call(arguments)).slice(1,7);
        });
        var format = arguments[0]||"{0}年{1}月{2}日{3}:{4}:{5}";
        return format.replace(/{(\d+)}/g,function(){
            var val = ary[arguments[1]];
            return val.length===1?'0'+val:val;
        })
    }

// 给一个内置类添加一个共有的方法
String.prototype.myQueryURLParameter = function myQueryURLParameter() {
    var obj = {},
        reg = /([^=?&]+)=([^=?&]+)/g;
    this.replace(reg, function() {
        var arg = arguments;
        obj[arg[1]] = arg[2];
    });
    return obj;
}

Array.prototype.myforEach = function myforEach(callBack, context) {
    context = context || window;
    if ("forEach" in Array.prototype) {
        this.forEach(callBack, context);
        return;
    }
    for (var i = 0; i < this.length; i++) {
        callBack || callBack(context, this[i], i, this);
    }

}
Array.prototype.myMap = function myMap(callBack, context) {
    context = context || window;
    if ("map" in Array.prototype) {
        return this.map(callBack, context);
    }
    var newArr = [];
    for (var i = 0; i < this.length; i++) {
        if (typeof callBack === 'function') {
            var val = callBack.call(context, this[i], i, this);
            newArr[newArr.length] = val;
        }
    }
    return newArr;
}
// 柯理化函数思想：一个JS 预先处理的思想--》利用函数执行形成一个不销毁的私有作用域的原理，把需要预选处理的内容都存在这个不销毁的作用域内，
// 并且返回一个小函数，以后执行的都是小函数，在小函数内把之前预选存储的值进行相关的操作处理即可。
// bind 作用：传进来的callback 里面的this 提前处理成context 上下文
Function.prototype.myBind = function myBind(context) {
    var self = this;
    var outerArg = Array.prototype.slice.call(arguments, 1);
    if ('bind' in Function.prototype) {
        return this.bind.apply(this, [context].concat(outerArg))
    }
    return function() {
        var innerArg = Array.prototype.slice.call(arguments, 0);
        innerArg.length === 0 ? innerArg[innerArg.length] = window.event : null;
        self.apply(context, outerArg.concat(innerArg))
    }

}