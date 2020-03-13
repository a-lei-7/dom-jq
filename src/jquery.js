window.$ = window.jQuery = function (selectorOrArrayOrTemplate) {
    let elements
    if (typeof selectorOrArrayOrTemplate === 'string') { //判断输入的值的类型，分别定义不同的 elements
        if (selectorOrArrayOrTemplate[0] === '<') {
            //创建 div HTML元素
            elements = [createElement(selectorOrArrayOrTemplate)]
        } else {
            elements = document.querySelectorAll(selectorOrArrayOrTemplate)
        }
    } else if (selectorOrArrayOrTemplate instanceof Array) {
        elements = selectorOrArrayOrTemplate
    }

    function createElement(string) {
        const container = document.createElement("template")
        container.innerHTML = string.trim()
        return container.content.firstChild
    }

    // api 可以操作 elements
    const api = Object.create(jQuery.prototype) // 创建一个对象，这个对象的 __proto__ 为括号内的值
    // 相当于 const api = {__proto__: jQuery.prototype}
    Object.assign(api, { // 将 elements:elements , oldApi 放进共同 api 内，以便在外面对这些参数的调用
        elements: elements,
        oldApi: selectorOrArrayOrTemplate.oldApi
    })
    //api.elements = elements
    //api.oldApi = selectorOrArrayOrTemplate.oldApi
    return api
}
jQuery.fn = jQuery.prototype = {
    constructor: jQuery,
    jquery: true,

    get(index) {
        return this.elements[index]
    },
    appendTo(node) {
        if (node instanceof Element) {
            this.each(el => node.appendChild(el)) // 遍历 elements，对每个 el 进行 node.appendChild 操作
        } else if (node.jquery === true) {
            this.each(el => node.get(0).appendChild(el)) // 遍历 elements，对每个 el 进行 node.get(0).appendChild(el))  操作
        }
    },
    append(children) {
        if (children instanceof Element) {
            this.get(0).appendChild(children)
        } else if (children instanceof HTMLCollection) {
            for (let i = 0; i < children.length; i++) {
                this.get(0).appendChild(children[i])
            }
        } else if (children.jquery === true) {
            children.each(node => this.get(0).appendChild(node))
        }
    },
    // 函数 和 外部的变量 elements 组成闭包
    addClass(className) {
        for (let i = 0; i < elements.length; i++) {
            elements[i].classList.add(className)
        }
        return this
    },
    find(selector) {
        let array = []
        for (let i = 0; i < elements.length; i++) {
            const elements2 = Array.from(elements[i].querySelectorAll(selector))
            array = array.concat(elements2)
        }
        array.oldApi = this // 将 this,也就是最先的 api 添加到 array 的 oldApi 属性内
        return jQuery(array) //将上面获取得到的数组，重新传给 jQuery ，return 出来，以便之后操作这个数组
        // 给jQuery 传一个对象，之后就操作 这个对象
        // const newApi = jQuery(array)
        // return newApi    
    },
    each(fn) { //遍历
        for (let i = 0; i < elements.length; i++) {
            fn.call(null, elements[i], i) //调用时 ，会将 elements[i] 和 i 作为 fn 的参数，也可以只使用第一个值
        }
        return this
    },
    parent() {
        const array = []
        this.each((node) => { // this 就是当前的 api 对象
            if (array.indexOf(node.parentNode) === -1) //判断 node.parentNode 是否在 array 内，如果不存在就 push ,存在就什么都不做
                array.push(node.parentNode)
        })
        return jQuery(array)
    },
    print() {
        console.log(elements)
    },
    children() {
        const array = []
        this.each((node) => {
            array.push(...node.children) // ... 操作可以将 node.children 依次展开，按照顺序排列
        })
        return jQuery(array)
    },

    oldApi: selectorOrArray.oldApi, //在这里对 array 的 oldApi 进行读取，再在 .end 中引用
    end() {
        return this.oldApi
    }
}