document.createElementWithClassList = function (tag, arrCls) {
  const node = document.createElement(tag)
  Array.isArray(arrCls) ? node.classList.add(...arrCls) : node.classList.add(arrCls)
  return node
}
const posNumberClock = (first, selected, count) => {
  // кратчайшее рассояние между числами в круге
  let d = Math.min(Math.abs(selected - first), count - Math.abs(selected - first))
  let m = Math.floor(count / 2) // "середина" круга
  return first <= m ? (first + d === selected) : (selected > first) || (selected + d < first)
}

export default function foxSlider(sliderId, options) {
  // Устанавливаем стартовые опции
  this.options = foxSlider.setOptions(options)

  // Контейнер слайдера
  this.sliderRoot = document.getElementById(sliderId) || document.querySelector(`.${this.options.prefix}`)
  // Если контейнера нет то выходим
  if (!this.sliderRoot) return

  // Задаем разметку слайдера
  // Контейнер для Слайдов
  this.sliderList = this.sliderRoot.querySelector(`.${this.options.prefix}-list`)

  // Коллекция Слайдов
  this.sliderItems = this.sliderList.querySelectorAll(`.${this.options.prefix}-item`)

  // Номер первого элемента
  this.sliderItemFirst = this.sliderItems[this.options.firstItem]

  // Контейнер для Навигации
  this.sliderNav = this.sliderRoot.querySelector(`.${this.options.prefix}-nav`)

  // Стрелки навигации
  this.navPrev = this.sliderNav.querySelector(`.${this.options.prefix}-prev`)
  this.navNext = this.sliderNav.querySelector(`.${this.options.prefix}-next`)

  // Контейнер для "точек"
  this.indicatorDots = this.sliderRoot.querySelector(`.${this.options.prefix}-dots`)

  // Инициализация
  foxSlider.initialize(this)
}

foxSlider.defaults = {
  // Опции по-умолчанию
  prefix:  'fox-slider', //префикс для классов слайдера
  // loop: false,       // Бесконечное зацикливание слайдера
  loop: true,       // Бесконечное зацикливание слайдера
  auto: false,      // Автоматическое пролистывание
  // auto: true,      // Автоматическое пролистывание
  interval: 2000,   // Интервал между пролистыванием элементов (мс)
  arrows: true,     // Пролистывание стрелками
  dots: true,       // Индикаторные точки
  firstItem: 0,     // Номер активного слайда
  speed: 500,       // Скорость анимации (мс)
  slidesShow: 4,    // Количество видимых слайдов
  arrowDisplayType: 'flex'
}

foxSlider.setOptions = (options) => {
  let res = Object.assign({}, foxSlider.defaults)
  res.itemCurrentClass = `${res.prefix}-item-current`
  res.dotCurrentClass = `${res.prefix}-dot-current`
  for(let key in options) if (!!options[key]) res[key] = options[key]
  return res
}

foxSlider.prototype.dotOn = function(num){
  this.indicatorDotsAll[num].classList.add(this.options.dotCurrentClass)
}
foxSlider.prototype.dotOff = function(num){
  this.indicatorDotsAll[num].classList.remove(this.options.dotCurrentClass)
}
foxSlider.prototype.setDotState = function(n) {
  for(let i=0; i<this.indicatorDotsAll.length; i++) this.dotOff(i)
  this.dotOn(n)
}

foxSlider.prototype.elemPrev = function(num) {
  let isArrow = !num
  num = num || 1

  this.currentElement -= num
  if(this.currentElement < 1) this.currentElement = this.elemCount

  if(!this.options.loop) {  // сдвиг вправо без цикла
    if (this.currentElement + this.options.slidesShow > this.elemCount) {
      this.currentElement = this.elemCount - this.options.slidesShow + 1
    }

    if (isArrow) {
      this.currentOffset += this.slideWidth * num
    } else {
      this.currentElement = num
      this.currentOffset = -this.slideWidth * (num-1)
    }

    this.sliderList.style.marginLeft = `${this.currentOffset}px`
    if(this.currentElement <= 1) this.navPrev.style.display = 'none'
    this.navNext.style.display = this.options.arrowDisplayType
    this.setDotState(num - 1)
  }
  else {                    // сдвиг вправо с циклом
    let elm, buf, this$ = this
    for(let i=0; i<num; i++) {
      elm = this.sliderList.lastElementChild
      buf = elm.cloneNode(true)
      this.sliderList.insertBefore(buf, this.sliderList.firstElementChild)
      elm.remove()
    }
    this.sliderList.style.marginLeft = `-${this.slideWidth * num}px`
    window.getComputedStyle(this.sliderList).marginLeft
    this.sliderList.style.transitionProperty = 'margin'
    this.sliderList.style.marginLeft = '0'
    setTimeout(() => this$.sliderList.style.transitionProperty = 'none', this.options.speed)
  }
}

foxSlider.prototype.elemNext = function(num) {
  let isArrow = !num
  num = num || 1

  this.currentElement += num
  if(this.currentElement > this.elemCount) this.currentElement = 1

  if(!this.options.loop) {  // сдвиг влево без цикла
    let n = (num + this.options.slidesShow > this.elemCount) ? this.elemCount - this.options.slidesShow + 1 : num
    if (isArrow) {
      this.currentOffset -= this.slideWidth * num
    } else {
      this.currentElement = num
      this.currentOffset = -this.slideWidth * (n-1)
    }
    this.sliderList.style.marginLeft = `${this.currentOffset}px`
    if(this.currentElement > this.elemCount - this.options.slidesShow) this.navNext.style.display = 'none'
    this.navPrev.style.display = this.options.arrowDisplayType

  }
  else {                    // сдвиг влево с циклом
    let elm, buf, this$ = this
    this.sliderList.style.transitionProperty = 'margin'
    this.sliderList.style.marginLeft = `-${this.slideWidth * num}px`
    setTimeout(function() {
      this$.sliderList.style.transitionProperty = 'none'
      for(let i=0; i<num; i++) {
        elm = this$.sliderList.firstElementChild
        buf = elm.cloneNode(true)
        this$.sliderList.append(buf)
        elm.remove()
      }
      this$.sliderList.style.marginLeft = '0'
    }, this.options.speed)
  }
}


foxSlider.initialize = function(that) {
  that.sliderList.style.transition = `none ${that.options.speed}ms ease`
  window.getComputedStyle(that.sliderList).transition

  that.elemCount = that.sliderItems.length // Количество элементов
  that.slideWidth = Math.floor(that.sliderList.offsetWidth / that.options.slidesShow)
  that.sliderItems.forEach(el => el.style.width = `${that.slideWidth}px`)
  that.currentElement = 1
  that.currentOffset = 0
  let bgTime = Date.now()

  function setAutoScroll() {
    that.autoScroll = setInterval(function() {
      let fnTime = Date.now()
      if(fnTime - bgTime + 10 > that.options.interval) {
        bgTime = fnTime
        that.elemNext()
        that.setDotState(that.currentElement-1)
      }
    }, that.options.interval)
  }

  if(!that.options.loop) {               // если нет цикла
    that.navPrev.style.display = 'none'  // отключить левую стрелку
    that.options.auto = false            // отключить автопркрутку
  }
  else if(that.options.auto) {   // инициализация автопрокруки
    setAutoScroll()
    // Остановка прокрутки при наведении мыши на элемент
    that.sliderList.addEventListener('mouseenter', () => clearInterval(that.autoScroll) , false)
    that.sliderList.addEventListener('mouseleave', setAutoScroll, false)
  }

  if(that.options.arrows) {  // инициализация стрелок
    if(!that.options.loop) that.sliderList.style.cssText = `transition:margin ${that.options.speed}ms ease`
    that.navPrev.addEventListener('click', function() {
      that.elemPrev()
      that.setDotState(that.currentElement-1)
    }, false)
    that.navNext.addEventListener('click', function() {
      that.elemNext()
      that.setDotState(that.currentElement-1)
    }, false)
  }
  else {
    that.navPrev.style.display = 'none'
    that.navNext.style.display = 'none'
  }

  if(that.options.dots) {  // инициализация индикаторных точек
    let sum = '', diffNum
    for(let i=0; i<that.elemCount; i++) {
      sum += `<div class="${that.options.prefix}-dot" data-thumbs-id="${that.sliderItems[i].dataset.imgId}"></div>`
    }
    that.indicatorDots.innerHTML = sum
    that.indicatorDotsAll = that.indicatorDots.children
    // Назначаем точкам обработчик события 'click'
    for(let n=0; n<that.indicatorDotsAll.length; n++) {
      that.indicatorDotsAll[n].addEventListener('click', function(e) {
        diffNum = parseInt(e.currentTarget.dataset.thumbsId, 10)
        if (that.options.loop) {
          let firstSlide = parseInt(that.sliderList.firstElementChild.dataset.imgId,10) // номер 1-го слайда
          if (diffNum === firstSlide) return
          let minDelta = Math.min(Math.abs(diffNum - firstSlide), that.elemCount - Math.abs(diffNum - firstSlide))
          posNumberClock(firstSlide, diffNum, that.elemCount) ? that.elemNext(minDelta) : that.elemPrev(minDelta)
        } else {
          (diffNum - that.currentElement) < 0 ? that.elemPrev(diffNum) : that.elemNext(diffNum)
        }
        that.setDotState(diffNum-1)
      }, false)
    }
    that.setDotState(0)
  }
}
