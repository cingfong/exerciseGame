// 25m
// 音頻
class AudioController {
    constructor() {
        this.bgMusic = new Audio('Assets/Audio/creepy.mp3')
        this.flipSound = new Audio('Assets/Audio/flip.wav')
        this.matchSound = new Audio('Assets/Audio/match.wav')
        this.victorySound = new Audio('Assets/Audio/victory.wav')
        this.gameOverSound = new Audio('Assets/Audio/gameOver.wav')
        this.bgMusic.volume = 0.5
        this.bgMusic = true
    }
    startMusic() {
        this.bgMusic.play()
    }
    stopMusic() {
        this.bgMusic.pause()
        this.bgMusic.currentTime = 0
    }
    flip() {
        this.flipSound.play()
    }
    match() {
        this.matchSound.play()
    }
    victory() {
        this.stopMusic()
        this.victory.play()
    }
    gameOver() {
        this.stopMusic()
        this.gameOverSound.play()
    }
}

class MixOrMatch {
    constructor(totalTime, cards) {
        this.cardsArray = cards
        this.totalTime = totalTime
        this.timeRemaining = totalTime
        this.timer = document.getElementById('time-remaining')
        this.ticker = document.getElementById('flips')
        this.audioController = new AudioController()
    }
    startGame() {
        this.cardToCheck = null
        this.totalClicks = 0
        this.timeRemaining = this.totalTime
        this.matchedCards = []
        this.busy = true
    }
    flipCard(card) {
        if (this.canFlipCard(card)) {
            this.audioController.flip()
            this.totalClicks++
            this.ticker.innerText = this.totalClicks
        }
    }

    canFlipCard(card) {
        return true
        // return (!this.busy && !this.matchedCards.includes(card) && card !== this.cardToCheck)
    }
}
// const { createReadStream } = require("fs")

function ready() {
    let overlay = Array.from(document.getElementsByClassName('overlay-text'))
    let cards = Array.from(document.getElementsByClassName('card'))
    let game = new MixOrMatch(100, cards);

    overlay.forEach(overlay => {
        overlay.addEventListener('click', () => {
            overlay.classList.remove('visible')
            game.startGame()
        })
    })
    cards.forEach(card => {
        card.addEventListener('click', () => {
            game.flipCard(card)
        })
    })
}
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready())
} else {
    ready()
}