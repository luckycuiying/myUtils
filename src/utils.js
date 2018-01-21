var utils = {
    // listToArray: 实现将类数组 转化为数组
    listToArray: function(likeAry){
        var ary = [];
        try{
            ary = Array.prototype.slice.call(likeAry);
        }catch(e){
            for (var i = 0; i < likeAry.length; i++) {
                ary[ary.length] = likeAry[i]
            }
        }
        return ary;
    },
    // 把JSON格式的字符串转换为JSON格式的对象
    jsonParse: function (jsonStr){
            return 'JSON' in window ? JSON.parse(jsonStr) : eval("(" + jsonStr+")");
    },
    isArray: function(obj){
        return Array.isArray(obj) || Object.prototype.toString.call(obj)==='[object Array]';
    },
    isObject: function(obj){
        return Object.prototype.toString.call(obj) === '[object,Object]';
    },
    isWindow: function(obj){
        return obj!=null && obj==obj.window;
    },
    // 判断一下是不是字面量的对象
    isPlainObject: function(obj){
        return this.isObject(obj)&&!this.isWindow(obj) && Object.getPrototypeOf(obj)==Object.prototype;
    },
    // 深度拷贝 单个对象深复制
    extend:function(target,source){
        for(let key in source){
            if(this.isPlainObject(source[key])|| this.isArray(source[key])){
               if(this.isPlainObject(source[key])&&!this.isPlainObject(target[key])){
                target[key] ={};
               }
                if(this.isArray(source[key])&& !this.isArray(target[key])){
                    target[key] =[];
                }
                this.extend(target[key],source[key]);
            }else if(source[key]!= undefined){
                target[key] = source[key];
            }
        }
        return target;
    },
    // 多个对象深复制
    deepExtend:function(eles){
        let args = Array.prototype.slice.call(arguments,1);
        args.forEach((arg)=>this.extend(eles,arg));
        return eles;
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
    formatDate: function(d,pattern){
        pattern = pattern || 'yyyy-MM-dd';
        var y = d.getFullYear().toString(),
        o ={
            M:d.getMonth()+1, // getMonth
            d:d.getDate(),
            h: d.getHours(),
            m:d.getMinutes(),
            s:d.getSeconds(),
        };
        pattern = pattern.replace(/(y+)/ig,function(a,b){
            return y.substr(4-Math.min(4,b.length));
        });
        for(var key in o){
            pattern = pattern.replace(new RegExp('('+key+'+)','g'),function(a,b){
                return (o[key]<10 && b.length>1)? "0"+o[key] :o[key];
            })
        }
        return pattern;
    },
    // 小于两位数的补白
    zore:function(val){
        return val<10?'0'+val:val;
    },
    /*
     * 倒计时
     * @param{string} targetTime目标时间
     * example  
     * var oDiv = document.getElementById('box');
        let timer = setInterval(function(){
            oDiv.innerHTML ="距离跨年还有：" + utils.countdown('2019-1-1 0:0:0')
        },1000);
     */
    countDown: function(targetTime){
        var targetStrTime = targetTime,
            nowTime = new Date().getTime(), // 获取的总毫秒数
            gmtTime = new Date(targetStrTime.replace(/-/g,'/')),//GMT(Greenwich Mean Time)代表格林尼治标准时间
            targetTime = gmtTime.getTime(),
            difftime = targetTime - nowTime;
            if(difftime>0){
                var mounths = Math.floor(difftime/(1000*60*60*24*30)),
                    remainTime = difftime-(mounths*30*24*60*60*1000);
                var days = Math.floor(remainTime/(24*60*60*1000)),
                    remainTime = remainTime-(days*24*60*60*1000);
                var hours = Math.floor(remainTime/(60*60*1000)),
                    remainTime = remainTime-(hours*(60*60*1000));
                var minutes = Math.floor(remainTime/(60*1000)),
                    remainTime = remainTime-(minutes*(60*1000));
                var seconds = Math.floor(remainTime/1000);
                var resltTime = this.zore(mounths)+'月'+this.zore(days)+'天'+this.zore(hours)+'小时'+this.zore(minutes)+'分'+this.zore(seconds)+'秒';
                return resltTime;
            }else{
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
    bubbleSort:function(arr){
        var flag = false; // 这种优化方式针对的是不存在重复的数组，重复多了，就停止排序了。
        for (var i = 0; i < arr.length-1; i++) {
            for (var j = 0; j < arr.length-1-i; j++) {
               if(arr[j]>arr[j+1]){
                 arr[j]=arr[j]+arr[j+1];
                 arr[j+1] = arr[j]-arr[j+1];
                 arr[j] = arr[j]-arr[j+1];
                 flag = true;
               }
               if(flag){
                flag = false;
               }else{
                break;
               }
            }
        }
        flag =null;
        return arr;
    },
    /*
     * 快速数组排序
     * arr.length<=1:停止递归拆分的条件
     * pointVal:{number} 是基准点的值,以他为参考点 
     * 
     */
    quickSort:function(arr){
        if(arr.length<=1){
            return arr;
        }
        var pointIndex = Math.floor(arr.length/2),
            middleArr = arr.splice(pointIndex,1);
            pointVal = middle[0]; //数组里面第一项取值
        var leftArr = [],rightArr=[];
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            cur >pointVal ?rightArr.push(cur):leftArr.push(cur);
        }
        return this.quickSort(leftArr).concat(middleArr,this.quickSort(rightArr))
    },
    /* sort排序
     * param: flag {number} 升序还是降序，默认值是 -1，有小到大
     *@ example 
     * var ary = [{name:'lisi',age:1},{name:'zhangsan',age:4},{name:'wangwu',age:9}]
     * 按照姓名和年龄数字排序
     */
    sort:function(arr){
        arr.sort(function(a,b){
            var cur =parseFloat(a),
             next = parseFloat(b);
            if(isNaN(cur)||isNaN(next)){
                return (a['name'].localeCompare(b['name']))
            }
            return (cur-next)
        })
        return arr;
    },
    /* 数组去重
     * 对象不存在重复的属性名原理来做数组去重
     * i--: 因为splice(i,1)得删除导致数组塌陷索引值少一位。
    */
    unRepeat:function(arr){
        var obj = {};
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            if(obj[cur] == cur){
                arr.splice(i,1);
                i--;
            }else{
                obj[cur] = cur;
            }
        }
        obj=null;
        return arr;
    },
    /* 数组去重
     *  循环那前一项和后一项比较，如果相等就是重复了，就删除
     * j--: 因为splice(i,1)得删除导致数组塌陷索引值少一位。
    */
    unRepeat2:function(arr){
        for (var i = 0; i < arr.length; i++) {
            var cur = arr[i];
            for (var j = i+1; j< arr.length; j++) {
                if(cur == arr[j]){
                    arr.splice(j,1);
                    j--;
                }
            }
        }
        return arr;
    },
    uniqueEs6: function(arr){
        return Array.form(new Set(arr))
    }  
}

module.exports =utils;