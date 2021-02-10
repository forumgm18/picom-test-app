document.createElementWithClassList = function (tag, arrCls) {
  const node = document.createElement(tag)
  Array.isArray(arrCls) ? node.classList.add(...arrCls) : node.classList.add(arrCls)
  return node
}
// function gallerySlider(sliderId, options) {
export default function gallerySlider(currentEl, options) {
  // Устанавливаем стартовые опции
  this.options = gallerySlider.setOptions(options)
  this.options.galName = currentEl.dataset.galleryName
  const gallerySlides = document.querySelectorAll(`[data-gallery-name="${this.options.galName}"]`)
  this.sliderClose = document.createElementWithClassList('div', `${this.options.prefix}-close`)

  this.sliderContainer = document.createElementWithClassList('div', `${this.options.prefix}-container`)
  this.sliderContainer.append(this.sliderClose)

  // // Контейнер слайдера
  this.sliderRoot = document.createElementWithClassList('div', `${this.options.prefix}`)
  this.sliderRoot.id = `popup-${this.options.galName}-${Math.floor(1000 * Math.random())}`

  // Задаем разметку слайдера
  // Контейнер для Слайдов
  this.sliderList = document.createElementWithClassList('div', `${this.options.prefix}-list`)

  let n = 0
  gallerySlides.forEach(el => {
    const elCloneNode = el.cloneNode(true)
    const elItem = document.createElementWithClassList('div', `${this.options.prefix}-item`)
    elItem.append(elCloneNode)
    this.sliderList.append(elItem)
    if (currentEl === el) this.options.firstItem = n  // номер активного слайда
    n++
  })

  // // Коллекция Слайдов
  this.sliderItems = this.sliderList.children

  // Номер первого элемента
  this.sliderItemFirst = this.sliderItems[this.options.firstItem]

  // Перемещаем Контейнер со Слайдами в Корневой контейнер Слайдера
  this.sliderRoot.append(this.sliderList)

  // Стрелки навигации
  this.navPrev = document.createElementWithClassList('div', `${this.options.prefix}-prev`)
  this.navNext = document.createElementWithClassList('div', `${this.options.prefix}-next`)

  // Контейнер для Навигации
  let nav = document.createElementWithClassList('div', `${this.options.prefix}-nav`)
  nav.append(this.navPrev)
  nav.append(this.navNext)
  this.sliderRoot.append(nav)

  // Контейнер для "точек"
  this.indicatorDots = document.createElementWithClassList('div', `${this.options.prefix}-dots`)
  this.sliderRoot.append(this.indicatorDots)

  this.sliderContainer.append(this.sliderRoot)
  document.body.append(this.sliderContainer)

  // Инициализация
  gallerySlider.initialize(this)
}

gallerySlider.defaults = {
  // Опции по-умолчанию
  prefix:  'gal-slider', //префикс для классов слайдера
  loop: true,     // Бесконечное зацикливание слайдера
  auto: false,    // Автоматическое пролистывание
  interval: 3000, // Интервал между пролистыванием элементов (мс)
  arrows: true,   // Пролистывание стрелками
  dots: true,     // Индикаторные точки
  firstItem: 0,   // Номер активного слайда
}

gallerySlider.setOptions = (options) => {
  let res = Object.assign({}, gallerySlider.defaults)
  res.itemCurrentClass = `${res.prefix}-item-current`
  res.dotCurrentClass = `${res.prefix}-dot-current`
  for(let key in options) {
    if (!!options[key]) res[key] = options[key]
  }
  return res
}
gallerySlider.prototype.destroy = function() {
  this.sliderContainer.remove()
}

gallerySlider.prototype.elemPrev = function(num) {
  num = num || 1

  let prevElement = this.currentElement
  this.currentElement -= num
  if(this.currentElement < 0) this.currentElement = this.elemCount-1

  if(!this.options.loop) {
    if(this.currentElement === 0) this.navPrev.style.display = 'none'
    this.navNext.style.display = 'block'
  }

  this.sliderItems[this.currentElement].classList.add(this.options.itemCurrentClass)
  this.sliderItems[prevElement].classList.remove(this.options.itemCurrentClass)

  if(this.options.dots) {
    this.dotOff(prevElement)
    this.dotOn(this.currentElement)
  }
}

gallerySlider.prototype.elemNext = function(num) {
  num = num || 1

  let prevElement = this.currentElement
  this.currentElement += num
  if(this.currentElement >= this.elemCount) this.currentElement = 0

  if(!this.options.loop) {
    if(this.currentElement === this.elemCount-1) this.navNext.style.display = 'none'
    this.navPrev.style.display = 'block'
  }

  this.sliderItems[this.currentElement].classList.add(this.options.itemCurrentClass)
  this.sliderItems[prevElement].classList.remove(this.options.itemCurrentClass)

  if(this.options.dots) {
    this.dotOff(prevElement)
    this.dotOn(this.currentElement)
  }
}

gallerySlider.prototype.dotOn = function(num) {
  this.indicatorDotsAll[num].classList.add(this.options.dotCurrentClass)
}

gallerySlider.prototype.dotOff = function(num) {
  this.indicatorDotsAll[num].classList.remove(this.options.dotCurrentClass)
}

gallerySlider.prototype.setDotState = function(n) {
  for(let i=0; i<this.indicatorDotsAll.length; i++) this.dotOff(i)
  this.dotOn(n)
}

gallerySlider.initialize = function(that) {
  that.sliderClose.addEventListener('click', () => that.destroy(), false)

  that.elemCount = that.sliderItems.length // Количество элементов
  // Functions
  const setAutoScroll = () => that.autoScroll = setInterval(() => that.elemNext(), that.options.interval)

  that.currentElement = that.options.firstItem

  // Базовая инициализация
  if(that.elemCount <= 1) {   // Отключить навигацию
    that.options.auto = false
    that.options.arrows = false
    that.options.dots = false
    that.navPrev.style.display = 'none'
    that.navNext.style.display = 'none'
  }
  if(that.elemCount >= 1) {   // показать первый элемент
    that.sliderItemFirst.classList.add(that.options.itemCurrentClass)
  }

  if(!that.options.loop) {
    that.navPrev.style.display = 'none'  // отключить левую стрелку
    that.options.auto = false // отключить автопркрутку
  }
  else if(that.options.auto) {   // инициализация автопрокруки
    setAutoScroll()
    // Остановка прокрутки при наведении мыши на элемент
    that.sliderList.addEventListener('mouseenter', () => clearInterval(that.autoScroll), false)
    that.sliderList.addEventListener('mouseleave', setAutoScroll, false)
  }

  if(that.options.arrows) {  // инициализация стрелок
    that.navPrev.addEventListener('click', () => that.elemPrev(), false)
    that.navNext.addEventListener('click', () => that.elemNext(), false)
  }
  else {
    that.navPrev.style.display = 'none'
    that.navNext.style.display = 'none'
  }

  if(that.options.dots) {  // инициализация индикаторных точек
    let diffNum,
        sum = '',
        dotClass = `${that.options.prefix}-dot`
    for(let i=0; i<that.elemCount; i++) {
      sum += `<div class="${dotClass}"></div>`
    }
    that.indicatorDots.innerHTML = sum
    that.indicatorDotsAll = that.indicatorDots.children

    // Назначаем точкам обработчик события 'click'
    for(let n=0; n<that.elemCount; n++) {
      that.indicatorDotsAll[n].addEventListener('click', function() {
        if(n === that.currentElement) return // Если n == that.currentElement ничего не делаем
        diffNum = Math.abs(n - that.currentElement)
        n < that.currentElement ? that.elemPrev(diffNum) : that.elemNext(diffNum)
      }, false)
    }
    // точка[that.options.firstItem] включена, остальные выключены
    that.setDotState(that.options.firstItem)
  }
}
