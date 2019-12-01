(function() {
    /**
     * @param {Object}  {} 参数：以对象方式传递，以下为具体参数（属性：属性值）
     * @param {String} itemClass   指向tab分类 容器的选择器
     * @param {String} contentClass     tab对应内容显示的 类名
     * @param {String} itemActiveClass  tab分类突出显示的 类名
     * @param {String} contentShowClass 指向tab对应内容 容器的选择器
     * @param {String} eventType  触发事件
     * @param {Number} currentIndex    初始开始的tab条目索引
     * @param {Number}} autoTime  自动切换的时间间隔，单位：ms（毫秒）
     * @param {String} boxLeave        触发移出事件的box容器 的选择器
     */

    class Tab{
        constructor(def) {
            let options = {
                itemClass: '.item',
                contentClass: '.content',
                boxLeave: '.box',
                itemActiveClass: 'active',
                contentShowClass: 'show',
                eventType: 'mouseover',
                currentIndex: this.currentIndex || 0,
                autoTime: 1000,
                boxLeave: '.box'
            };

            // 浅拷贝的封装
            // 得到参数拷贝给options（具有默认值）
            // 修改后的options拷贝给 this（当前对象）
            Object.assign(options, def);
            Object.assign(this, options);

            this.item = document.querySelectorAll(this.itemClass);
            this.content = document.querySelectorAll(this.contentClass);
            this.box = document.querySelector(this.boxLeave);

            // 给tab栏注册事件
            this.addEvent(this.eventType);
        }
        

        // 注册事件
        addEvent(eventType) {
            // mouseleave : 不冒泡 
            // mouseout 冒泡
            // 移出box盒子之后重新启动自动轮播的定时器
            this.box.addEventListener('mouseleave', e=> { 
                // 默认清除定时器，以防鼠标没有移入item 却触发了移出box的定时器的累加
                clearInterval(this.timer);
                // 启动定时器
                this.AutoInterval(this.autoTime);        
            });
            
            //item即tab栏 注册事件
            this.item.forEach( (e,i) => {
                
                e.addEventListener(eventType, (e)=> {

                    // 事件(移入，点击)触发，清除定时器
                    clearInterval(this.timer);

                    // 切换分类和对应的内容
                    this.changeItem(e.target);
                    this.changeContent(i);

                    // 触发移入、点击时，记下当前索引
                    this.currentIndex = i;
                });
                
            }); 
        }


        // 切换分类item
        changeItem(current) {
            // 排他：移出其他分类的，给当前的添加
            this.item.forEach( e => {
                e.classList.remove(this.itemActiveClass);
            });
            current.classList.add(this.itemActiveClass);
            
        }


        // 切换内容content
        changeContent(index) {
            
            this.content.forEach(e => {
                e.classList.remove(this.contentShowClass);
            });
            this.content[index].classList.add(this.contentShowClass)
        }
    }


    // 自动轮播：定时器启动
    // class 通过 extends 关键字实现 继承 父类属性和方法
    class Autotab extends Tab{
        constructor(options){
            options = options || {};
            // 调用父对象/父类的构造函数super， 以此得到this对象
            super(options);

            //默认启动定时器
            this.AutoInterval(this.autoTime);
        }

        AutoInterval(t) {
            this.timer = setInterval( () => {
                this.currentIndex++; 
                this.currentIndex %= 3;
                
                this.changeItem(this.item[this.currentIndex]);
                this.changeContent(this.currentIndex);
                
            }, t)
        }

    }
    
    

    // 调用tab栏的实例：
    // 默认页面一加载就启动自动轮播定时器
    let interval = new Autotab({
        autoTime: 1000
    });  

})();