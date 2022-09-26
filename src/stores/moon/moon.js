export const moon = {
    beforeMount(el, binding)
    {
        var MouseMove = function (e) {
            if (binding.arg == 'onPositionMouseMove') {
                Object.assign(binding.instance, {
                    position: {
                        x: e.pageX - this.start.x,
                        y: e.pageY - this.start.y
                    }
                });
            }
            e.stopImmediatePropagation()
        }

        var MouseDown = function (e) {
            this.start = {
                x: e.offsetX,
                y: e.offsetY
            }
            if (binding.arg == 'onPositionMouseMove') {

            }
            window.addEventListener('mousemove', this.onMouseMove)
            e.stopImmediatePropagation()
        }

        var MouseUp = function () {
            window.removeEventListener('mousemove', this.onMouseMove)
            if (binding.arg == 'onPositionMouseMove') {

            }
        }
        el.onMouseMove = MouseMove.bind(el)
        el.onMouseDown = MouseDown.bind(el)
        el.onMouseUp = MouseUp.bind(el)

        el.addEventListener('mousedown', el.onMouseDown)
        el.addEventListener('mouseup', el.onMouseUp)

        if (!binding.arg) {
            throw new Error('没有定义回调')
        }
    },

    unmounted(el)
    {
        // 做清洁工作
        // 例如移除bind()中添加的事件监听器
        el.removeEventListener('mousedown', el.onMouseDown)
        el.removeEventListener('mouseup', el.onMouseUp)
        window.removeEventListener('mousemove', el.onMouseMove)
    }
}