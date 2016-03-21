##intro
slider.js a lightweight mobile terminal sliding component, which is only 200 lines

##demo


##usage
```html
<!--the html of slider-->
 <div class="slider">
     <ul class="slider-list">
          <li class="slider-item z-selected">item1</li>
          <li class="slider-item"">item2</li>
          <li class="slider-item">item3</li>
          <li class="slider-item">item4</li>
          <li class="slider-item">item5</li>
          <li class="slider-item">item6</li>
     </ul>          
 </div>
```
then create a slider instance
```javascript
var Slider = require('slider');
// NEW 
var slider = Slider.init({
    container: '.slider',
    sliderElem: '.slider-list',
    startPos: 0, //the start index, default 0
    speed:600, // the transition duration, defualt 300
    after: function(index) {
            /*do something*/
    }
});
```


##Api & Opts
the default opt
```javascript
 var defaults = {
     startPos: 0, //默认当前index为第一个即0
     sensitivity: 0.75, //灵敏度
     translateX: 0, //初始translateX值
     speed: 100, //默认速度
     realTimeSliding: true,
};
```

####Slider.init(opts)
- @param  Object opts  - the options of slider
```javascript
//demo.js
var slider = Slider.init({
    container: '.slider',
    sliderElem: '.slider-list'
});

```

####Slider.translate($target, dist, speed)
- @param  Object target - the target of slide
- @param  Object dist - the distance of slide
- @param  Object speed - the speed of transition duration
```javascript
//demo.js
var target = $('#target');
var distance = 400; //400px; left to right
var speed = 300; // 300ms
Slider.translate(target, distance , speed);
```


----
the instance method
####slider.move(index, speed, noCb)
- @param  Object index- 【necessary】the index of slide
- @param  Object speed - 【unnecessary】 the speed
- @param  Object noCb-  【unnecessary】 don't need the afterCallback


####slider.getCurPos()
- @return Number  index

####slider.getOpts()
- @return Object opts


