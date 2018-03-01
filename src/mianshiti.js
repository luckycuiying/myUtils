var foo = 1;

function bar() {
    if (!foo) { // undefined 转换成布尔值是false; !undefined == true;
        var foo = 10;
    }
    console.log(foo) // 10
}
bar()
// 1思路： 全局变量下的变量提升： var n  var c  a= xxxfff111;
var n = 0;

function a() {
    // 私有作用域： var n ; b= xxxfff222;
    var n = 10;

    function b() {
        // 私有作用域： 
        n++; // n是其上以及作用域
        console.log(n);
    }
    b();
    return b; // 返回的是 xxxfff222
}
var c = a(); // xxxfff222 产生的私有作用域被外面的变量c 占用所以 xxxfff222 产生的私有作用域不会被销毁
c();
console.log(n) // 使用的是全局变量 n  和私有作用域内的没关系

// 2思路： 全局变量下的变量提升： var a; var b;var c; test = aaafff111;
var a = 10,
    b = 11,
    c = 12;

function test(a) {
    // 私有作用域： a =10 ;var b;
    a = 1; // 私有下的a 重新赋值为 1， 但不会修改全局变量a 的值。
    var b = 2; // 私有变量
    c = 3 // 不是私有的 所以向上一级作用域找，改边全局下的 c
}
test(10);
console.log(a) // 10
console.log(b) //11
console.log(c) //3

// 3 全局变量下的变量提升： var a ; window.a = undefined;
    if (!("a" in window) { // "a" in window 为true 取反成false;
        var a = 1; // 因为条件为false 这行代码不会执行
    }
    console.log(a); //所以： a == undefined

    // 4  在js 非严格模式下 函数的实参集合与形参变量存在的“映射"关系，不管其中谁改变了，另外一个都会跟着发生改变
    var a = 4;
    function b(x, y, a) {
        console.log(a); //3
        arguments[2] = 10; //10 让第三个传递进来的实参等于10 ，
        console.log(a); //10
    }
    a = b(1, 2, 3); // b 函数执行没有返回值。
    console.log(a); //undefined
    // 在js严格模式下，arguments 和形参变量的映射关系被切断
    "use strict"
    var a = 4;

    function b(x, y, a) {
        console.log(a); //3
        arguments[2] = 10; //arguments 和形参变量的映射关系被切断
        console.log(a); //3
    }
    a = b(1, 2, 3); // b 函数执行没有返回值。
    console.log(a); //undefined