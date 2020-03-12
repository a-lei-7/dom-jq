const x = jQuery('.test').find('.child')

x.each((x) => console.log(x)) //x 是 .each 中的 fn.call(null, elements[i], i) 内的 elements[i]find

const y = jQuery('.test')
y.parent().print()
y.children().print()