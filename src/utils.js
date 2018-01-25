// 使用惰性思想来封装常用的库：第一次给utilsDom赋值的时候我们就已经处理了兼容问题，把最后得结果存放在flag
// 变量中，以后再每个方法中，只要是IE6~8不兼容的，我们不需要重新检测，只需要使用flag 的值即可。
var utilsDom = (function() {
    /*
        flag 这个变量不销毁，储存的是判断当前的浏览器是否兼容getComputrdStyle这个属性，兼容就是标准浏览器，不兼容flafg=false;
        则说明是IE6~8  这种思想就是惰性思想
     */
    var flag = "getComputedStyle" in window;
    console.log(flag)
    function listToArray(likeArr) {
        var ary = [];
        if (flag) {
            return Array.prototype.slice.call(likeArr);
        } else {
            var ary = [];
            for (var i = 0; i < likeArr.length; i++) {
                ary[ary.length] = likeArr[i]
            }
            return ary;
        }
    }

    function formatJson(jsonStr) {
        return 'JSON' in window ? JSON.parae(jsonStr) : evel("(" + jsonStr + ")");
    }
    function offset(ele){
        var eleLeft = ele.offsetLeft,
            eleTop = ele.offsetTop,
            eleParent = ele.offsetParent;
        var left =null,top=null;
            left += eleLeft;
            top +=eleTop;
        while(eleParent){
            //console.log(eleParent);
            /*
             *  ps: ie8中会有一个问题如果在ie8中就不加父级的边框了。因为已经加过了。
             *  判断我的当前浏览器是不是ie8   1 可以用正则 test MSIE 8.0   2 字符串
             *  中的indexOf MSIE 8.0 判断 -1. window.navigator.userAgent
             * */
            if(window.navigator.userAgent.indexOf('MSIE 8.0')!==-1){
                left+=eleParent.offsetLeft;
                top+=eleParent.offsetTop;
            }else{
                left += eleParent.clientLeft + eleParent.offsetLeft;
                top += eleParent.clientTop +eleParent.offsetTop;
            }
            eleParent = eleParent.offsetparent;
        }
        return {
            left:left,
            top:top
        }
    }
    // getWin : 一个参数是读取，两个参数是设置
    function getWin(attr,val) {
        if(val !== undefined){
            document.documentElement[attr] = val;
            document.body[attr] = val;
        }
        return document.documentElement[attr] || document.body[attr];
    }
    /*
      @ children:获取curEle 下所有的元素子节点(兼容所有浏览器)，如果传递了tagName,可以在获取的集合中进行二次筛选
    * @ tagName [string]
     */
    function children(curEle, tagName) {
        var ary = [];
        if (/MSIE (6|7|8)/i.test(navigator.userAgent)) {
            var nodeList = curEle.childNodes;
            for (var i = 0, len = nodeList.length; i < len; i++) {
                var curNode = nodeList[i];
                if (curNode.nodeType === 1) {
                    ary[length] = curNode;
                }
            }
        } else {
            //curEle.children 获取到的是节点集合，是个类数组，为了一直都转成数组
            ary = Array.prototype.slice.call(curEle.children);
        }
        // 如果传递第二个人参数
        if (typeof(tagName) === 'string') {
            for (var j = 0; j < ary.length; j++) {
                var curEleNode = ary[j];
                if (curEleNode.nodeName.toLowerCase() !== tagName.toLowerCase()) {
                    ary.splice(j, 1);
                    j--;
                }
            }
        }
        return ary;
    }
    /*
     * @prev() : 获取上一个哥哥元素节点
     * 原理：首先获取当前元素的哥哥节点，然后判断是不是元素节点，不是的话就继续基于当前的节点向上查找哥哥节点...
     * 一直找到哥哥是元素节点为止，如果哥哥节点都不是元素节点，则返回null.
     */

    function prev(curEle){
        if(flag){
            return curEle.previousElementSibling;
        }
        var pre = curEle.previousSibling;
        while(pre && pre.nodeType!==1){
            pre = pre.previousSibling
        }
        return pre;
    }
    // 获取下一个弟弟节点
    function next(curEle){
        if(flag){
            return curEle.nextElementSibling;
        }
        var nex = curEle.nextSibling;
        while(nex && nex.nodeType!==1){
            nex = nex.nextSibling
        }
        return nex;
    }
    // 获取所有的哥哥节点
    function prevAll(curEle){
        var ary =[];
        var pre = this.prev(curEle);
        while(pre){
            ary.unshift(pre);
            pre = this.prev(pre);
        }
        return ary;
    }
    // 获取所有的弟弟节点
    function nextAll(curEle){
        var ary = [];
        var next = this.next(curEle);
        while(next){
            ary.push(next);
            next = this.next(next);
        }
    }
    // 获取相邻的两个元素节点
    function sibling(curEle){
        var pre = this.prev(curEle);
        var nex = this.next(curEle);
        var ary = [];
        pre ? ary.push(pre) :null;
        nex ? ary.push(nex) :null;
        return ary;
    }
    //获取所用兄弟节点
    function siblings(curEle){
        return this.prevAll(curEle).concat(this.nextAll(curEle));
    }
    //获取当前索引
    function index(curEle){
        return this.prevAll(curEle).length;
    }
    // 获取第一个元素子节点
    function firstChild(curEle){
        var allEle = this.children(curEle);
        return allEle>0 ?allEle[0]:null;
    }
    // 获取最后一个元素子节点
    function lastChild(curEle){
        var allEle = this.children(curEle);
        return allEle>0 ? allEle[allEle.length-1] :null;
    }
    // append: 向指定容器添加的末尾追加元素
    function append(newEle,container){
        container.appendChild(newEle)
    }
    // prepend:向指定容器的开头追加元素: 把新元素添加到容器中的第一个子元素节点的前面，如果一个节点都没有，就放在末尾即可
    function prepend(newEle,container){
        var firstEle =  this.firstChild(container);
        if(firstEle){
            container.insertBefore(newEle,firstEle);
            return;
        }
        container.appendChild(newEle)
    }
    /*
       insertBefore:追加到指定元素的前面
        @newEle: 要添加的元素
        @oldEle:添加在那个元素之前
     */
    function insertBefore(newEle,oldEle){
        oldEle.parentNode.insertBefore(newEle,oldEle)
    }
    /*
       insertAfter:追加到指定元素的后面
        @newEle: 要添加的元素
        @oldEle:添加在那个元素之后，相当于追加到oldEle 的弟弟元素前面，
        如果弟弟不存在，当前元素就是最后一个元素，直接添加在后面就可以了
     */
    function insertAfter(newEle,oldEle){
        var nex = this.next(oldEle);
        if(nex){
            oldEle.parentNode.insertBefore(newEle,oldEle);
        }
        oldEle.parentNode.appendChild(newEle);
    }
    // addClass:给元素增加样式类名
    function addClass(curEle,className){
        var ary = className.replace(/^ +| +$/g,"").split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName = ary[i];
            if(!this.hasClass(curEle,className)){
                curEle.className += ' '+curName;
            }
        }
    }
    // 验证当前元素中是否包含className 这也样式类名
    function hasClass(curEle,className){
        var reg = new RegExp("(^| +)"+className+"( +|$)");
        return reg.test(curEle.className);
    }
    function removeClass(curEle,className){
        var ary = className.replace(/^ +| +$/g,'').split(/ +/g);
        for (var i = 0; i < ary.length; i++) {
            var curName =  ary[i] ;
            if(this.hasClass(curEle,curName)){
                var reg = new RegExp("(^ | +)"+curName+"( +|$)","g");
                curEle.className = curEle.className.replace(reg," ")
            }
        }

    }
    /*
       getElementByClassName: 通过元素的样式名获取一组元素集合
       @ className :要获取的样式类名（ 可能是一个或是多个）
       @context :获取元素的上下文(如果这个值不存在，默认是document)
     */
     
    function getElementByClassName (strClassName,context){
        // 对上下文做处理
        context = context || document;
        if(flag){
            return this.listToArray(context.getElementByClassName(strClassName))
        }
        var ary=[]; //最终都匹配的的元素
        // 首先把传进来的className 的首位空格去掉，然后在按照中间的空格把它里面的每一项拆分成数组
        var strClassNameArr = strClassName.replace(/^ +| +$/g,'').split(/ +/g);
        //获取指定上下文中的所有元素标签，循环这些标签，获取每一个标签的strClassName样式类名的字符串
        var nodeList = context.getElementsByTagName('*')
        //循环这些标签,获取每一个标签的strClassName样式类名的字符串
        for (var i = 0; i < nodeList.length; i++) {
            var curNode= nodeList[i];
            //判断当前的curNode.strClassName 是否包含传进来的一个或是多个strClassName，如果都包含了的话，curNode 就是我们想要的，否则不是我们想要的
            var isOk = true; // 假设都存在，然后在验证
            for (var j = 0; j < strClassNameArr.length; j++) {
                var curName = strClassNameArr[j];
                //判断包含不包含当前的strClassName 使用正则匹配
                var reg = new RegExp('(^| +)'+curName+'( +|$)');
                if(!reg.test(curNode.className)){
                    isOk = false;
                    break;
                }
            }
            if(isOk){// 那每一个标签分别和所有样式类名比较后，结果还是true 的话，就是说明传进来的标签都包含
                ary.push(curNode)
            }
        }
        return ary;
    }
    //获取经过浏览器计算过得样式
    function getCss(attr){
        var val=null,reg = null;
        if(flag){
            val = window.getComputedStyle(this,null)[attr]; 
        }else{
            if(attr==="opacity"){
                val = this.currentStyle[filter];
                reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/;
                val = reg.test(val) ? reg.exec(val)[1]/100 : 1;
            }else{
                val = this.currentStyle[attr];
            }
        }
        reg = /^(-?\d+(\.\d+)?)(px|pt|em|rm)?$/;
        return reg.test(val)?parseFloat(val):val;
    }

    /*
       setCss:设置当前的某一个样式属性设置值（增加的是行内样式）
       @ attr :需要设置的属性
       @value :需要设置的属性值
     */
    function setCss(attr,value){
        if(attr==='float'){
            this['style']['cssFloat'] = value;
            this['style']['styleFloat'] = value;
            return;
        }
        if(attr==="opacity"){
            this['style']['opacity'] = value;
            this['style']['filter'] ='alpha(opacity='+value*100+')';
            return;
        }
        var reg = /^(width|height|top|bottom|left|right|((margin|padding)(Top|Bottom|Left|Right)?))$/
        if(reg.test(attr)){
            if(!isNaN(value)){
                value += 'px';
            }
        }
        this['style'][attr] = value;
    }
    // 批量设置css 样式
    function setGroupCss(options){
        if(Object.prototype.toString.call(options)!=='[object Object]'){
            return;
        }
        for(var key in options){
            if(options.hasOwnProperty(key))
            setCss.call(this,key,options[key]);
        }
    }
    // css():此方法实现获取，单独设置，批量设置的样式值
    function css(curEle){
        var ary = Array.prototype.slice.call(arguments,1);
        var argTwo = arguments[1];
        if(typeof argTwo === 'string'){ // 说明第二个参数是一个字符串。很有可能是在获取样式，还需要判断是否有第三个参数，
            // 如果有第三个参数，那就是给当前元素设置某一个属性值
            var argThree = arguments[2];
            if(typeof argThree === 'unddefined'){ // 第三个参数不存在
                 // return this.getCss(curEle,argTwo)
                return getCss.apply(curEle,ary)   
            }else{ // 第三个参数存在
               //this.setCss(curEle,argTwo,argThree);
               setCss.apply(curEle,ary);
            }
        }
        if(Object.prototype.toString.call(argTwo) === '[object Object]'){
            setGroupCss.apply(curEle,ary)
            // setGroupCss(curEle,argTwo,argThree)
        }
        
    }
    return{
        win:win,
        offset:offset,
        listToArray:listToArray,
        children:children,
        prev:prev,
        next:next,
        prevAll:prevAll,
        nextAll:nextAll,
        sibling:sibling,
        siblings:siblings,
        index:index,
        firstChild:firstChild,
        lastChild:lastChild,
        append:append,
        prepend:prepend,
        insertBefore:insertBefore,
        insertAfter:insertAfter,
        hasClass:hasClass,
        addClass:addClass,
        removeClass:removeClass,
        getElementByClassName:getElementByClassName,
        // getCss:getCss,
        // setCss:setCss,
        // setGroupCss:setGroupCss,
        css:css,

    }

})()