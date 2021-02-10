import gallerySlider from './gallery-slider'
import foxSlider from './fox-slider'
let mainThumbs = document.querySelectorAll('[data-thumbs-id]')
let mainSlides = document.querySelectorAll('[data-gallery-name]')
const mainSlidesOptions = {
  slideActiveClass: 'slider-item-active',
  thumbsActiveClass: 'slider-thumbs-active'
}

const deactiveItems = (cls) => {
  const activeThumbs = document.querySelectorAll(`.${cls}`)
  activeThumbs.forEach(el => el.classList.remove(cls))
}
const selectImg = (id) => {
  const activeImg = document.querySelector(`[data-img-id="${id}"]`)
  if (activeImg) {
    activeImg.classList.add(mainSlidesOptions.slideActiveClass)
  }

}
const selectThumbs = (el) => {
  deactiveItems(mainSlidesOptions.thumbsActiveClass)
  deactiveItems(mainSlidesOptions.slideActiveClass)
  el.currentTarget.classList.add(mainSlidesOptions.thumbsActiveClass)
  selectImg(el.currentTarget.dataset.thumbsId)
}

const createGallery = (el) => {new gallerySlider(el.currentTarget)}
mainThumbs.forEach(el => el.addEventListener('click', selectThumbs))
mainSlides.forEach(el => el.addEventListener('click', createGallery))

new foxSlider('#fox-slider')