let zoomArr = document.querySelectorAll('.zoomer')
zoomArr.forEach(el => {
  el.addEventListener('pointermove', (event) => {
    let node = event.currentTarget
    let x = event.offsetX / node.offsetWidth  * 100
    let y = event.offsetY / node.offsetHeight * 100
    node.style.backgroundPosition = `${x}% ${y}%`
  })
  el.addEventListener('pointerenter', (event) => event.currentTarget.classList.add('zooming'))
  el.addEventListener('pointerleave', (event) => {
    event.currentTarget.classList.remove('zooming')
    event.currentTarget.style.backgroundPosition = ''
  })
})
