const { createReadStream } = require("fs")


function ready() {
    let overlay = Array.from(document.getElementsByClassName('overlay-text'))
    let cards = Array.from(document.getElementsByClassName('card'))

    overlay.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible')
        })
    })
    cards.forEach(card => {
        overlay.addEventListener('click', () => { })
    })
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready()
}