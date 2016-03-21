/**
 * slider 
 * @author coverguo
 * @description 一个简易的滑动组件
 * @usage
    var guideSlider = Slider.init({
        container: '.guide-slider',
        sliderElem: '.guide-slider-list',
        after: function(index) {      }
    });
 * 
 */
define('slider', function(require, exports, module) {
    var noop = function() {};
    var defaults = {
        startPos: 0, //默认当前index为第一个即0
        sensitivity: 0.75, //灵敏度
        translateX: 0, //初始translateX值
        speed: 100, //默认速度
        realTimeSliding: true,
    };

    function Slider(opts) {
        this.opts = $.extend({}, defaults, opts);

        //设置容器
        this.$container = $(opts.container);

        /**
         * 设置滑动对象
         * 如果没有设置则选择默认的id为slider的节点
         */
        this.$Slider = $(opts.sliderElem || '#slider');

        if (!this.$Slider) {
            console.log('can not find a slider selector');
            return;
        }
        //设置当前位置
        this.curPos = this.opts.startPos;
        //设置滑动后的回调
        this.slideAfter = this.opts.after || noop;
        //设置滑动条长度
        this.sliderWidth = this.$Slider.width();
        //获取滑动条子item
        this.sliderItem = this.$Slider.children();
        //获取滑动item数目
        this.itemNum = this.sliderItem.length || 1; //如果没有子元素即list自己滚动
        this.lastPos = this.itemNum - 1, //最后一个位置
            //设置滑动单元长度
        this.unitWidth = this.sliderWidth / this.itemNum;

        // console.log(this.opts);
        this.bindEvent(this.opts);

        this.move(this.curPos);
    }

    Slider.prototype = {

        bindEvent: function(opts) {
            var startTouch, //touchstart的touch
                lastestTouch, //最新一个touch
                delta, //最近两次touch对象距离差量
                isPastBounds = false, //是否过界
                totalDelta, //最终距离差量
                that = this,
                direction = 0; //滑动方向 

            that.$container.on('touchstart', function(e) {
                //获取触摸坐标
                // console.log('touchstart');
                var touches = event.touches[0];
                //记录初始start的touch
                startTouch = {
                    x: touches.pageX,
                    y: touches.pageY,
                    time: +new Date
                };

                totalDelta = {
                        x: 0,
                        y: 0
                    },
                    // console.log('touchstart');
                    // console.log(startTouch);
                    //保存最新touch
                    lastestTouch = startTouch;

            });
            that.$container.on('touchmove', function(e) {
                //禁止默认事件如 滚动条等滚动
                // console.log('touchmove');
                var touches = event.touches[0];
                //计算touchstart->touchmove间 或者touchmove->touchmoe之间的移动距离
                delta = {
                    x: touches.pageX - lastestTouch.x,
                    y: touches.pageY - lastestTouch.y
                };
                //更新最新节点
                lastestTouch = {
                    x: touches.pageX,
                    y: touches.pageY,
                    time: +new Date
                };

                // console.log(lastestTouch);
                //计算touchstart->touchend之间的移动距离
                totalDelta = {
                    x: touches.pageX - startTouch.x,
                    y: touches.pageY - startTouch.y
                };
                // console.log(totalDelta);

                //持续时间
                var duration = +new Date - startTouch.time;

                // 判断是否用户是希望上下滚动，而不是滑动slider
                var isScrolling = Math.abs(delta.x) < Math.abs(delta.y);
                // console.log('isScrolling:'+isScrolling);
                //如果是滑动slider，则preventDefault()，
                //在X5内核等浏览器可以提高touchmove的灵敏度
                if (!isScrolling) {
                    event.preventDefault();
                }

                // 判断slider滑动情况是否过界
                // 判断条件： 
                // 1、最左边的时候，继续向左前进
                // 2、最右边的时候，继续向右前进
                
                isPastBounds = that.translateX > 100 || that.translateX < -that.sliderWidth;

                console.log('isPastBounds:'+isPastBounds);
                console.log('that.translateX :'+that.translateX );
                console.log('delta.x :'+delta.x );
                // console.log('this.sliderWidth :'+that.sliderWidth );
                //如果没过界
                if (!isPastBounds && opts.realTimeSliding) {
                    //更新tanslateX
                    var distanct = that.translateX + opts.sensitivity * delta.x;
                    // console.log('distanct' +opts.sensitivity +":"+   delta.x);
                    that.translateX = translate(that.$Slider, distanct);
                }

            });

            that.$container.on('touchend', function(e) {
                //计算滑动时间
                var duration = +new Date - startTouch.time;

                //判断滑动的方向， 需要滑动距离超过30
                console.log(totalDelta);

                if (Math.abs(totalDelta.x) >= 30) {
                    direction = totalDelta.x > 0 ? -1 : 1;
                } else {
                    direction = 0;
                }

                var nearestIndex;
                //算出滑动index
                if (opts.realTimeSliding) {
                    //如果过界了
                    // console.log('isPastBounds' + isPastBounds);
                    if (isPastBounds && opts.realTimeSliding) {
                        if (that.translateX > 0) {
                            nearestIndex = 0;
                        } else {
                            nearestIndex = that.lastPos;
                        }
                    } else {
                        //没有超过边界，则需要计算它最接近的位置
                        nearestIndex = Math.round(Math.abs(that.translateX) / that.unitWidth);
                        // console.log(nearestIndex);
                    }
                } else {
                    if (!nearestIndex) {
                        nearestIndex = that.curPos;
                    }
                    nearestIndex += direction;

                }
                if (nearestIndex < 0) {
                    nearestIndex = 0;
                }
                if (nearestIndex > that.lastPos) {
                    nearestIndex = that.lastPos;
                }

                //重置过界标识符
                isPastBounds = false;
                that.move(nearestIndex);
            });

        },
        move: function(index, speed, noCb) {
            //计算距离
            var speed = speed || this.opts.speed;
            var distanct = -1 * index * this.unitWidth;
            this.translateX = translate(this.$Slider, distanct, speed);
            !noCb && this.slideAfter(index);
            //更新当前pos
            this.curPos = index;
        },
        //返回当前slider位置
        getCurPos: function() {
            return this.curPos;
        },
        //返回当前opts
        getOpts: function() {
            return this.opts;
        }
    };

    function init(opts) {
        return new Slider(opts);
    };

    //一个简单的设置translate的方法
    function translate(target, dist, speed) {
        var slide = target[0];
        var style = slide && slide.style;
        //设置speed值默认为0
        speed = speed || 0;

        style.webkitTransitionDuration = speed + 'ms';
        style.webkitTransform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        style.transitionDuration = speed + 'ms';
        style.transform = 'translate(' + dist + 'px,0)' + 'translateZ(0)';
        //返回位移距离
        return dist;
    }

    module.exports = {
        init: init,
        translate: translate
    };
});
