class Axis {
    constructor(name = 'none', pos = null, neg = null, release = () => {}) {
        if (!document.querySelector('#Axis')) {
            const div = document.createElement('div')
            div.id = 'Axis'
            document.body.appendChild(div)
        }

        // primary
        const primary = document.createElement('div')
        primary.id = `axis-${name}`
        primary.dataset.state = 0
        document.querySelector('#Axis').appendChild(primary)

        // positive
        const positive = document.createElement('div')
        positive.id = `${primary.id}-positive`
        positive.dataset.key = pos
        positive.dataset.state = 0
        positive.dataset.mod = 1
        primary.appendChild(positive)

        // negative
        const negative = document.createElement('div')
        negative.id = `${primary.id}-negative`
        negative.dataset.key = neg
        negative.dataset.state = 0
        negative.dataset.mod = -1
        primary.appendChild(negative)

        // event logic
        const logic = (pole, opposite, event) => {
            const value = event.type == 'keydown' ? 1 : 0
            if (event.keyCode == pole.dataset.key) {
                if (value) {
                    if (primary.dataset.state == 0) {
                        primary.dataset.state = pole.dataset.mod
                    }
                    primary.dataset.state = pole.dataset.mod
                } else if (opposite.dataset.state != 0) {
                    primary.dataset.state = opposite.dataset.mod
                } else {
                    primary.dataset.state = 0
                    release()
                }
                pole.dataset.state = value
            }
        }

        // client key down event
        addEventListener('keydown', logic.bind(this, positive, negative))
        addEventListener('keydown', logic.bind(this, negative, positive))

        // client key up event
        addEventListener('keyup', logic.bind(this, positive, negative))
        addEventListener('keyup', logic.bind(this, negative, positive))

        // client blur event
        addEventListener('blur', () => {
            if (primary.dataset.state != 0 || positive.dataset.state != 0 || negative.dataset.state != 0) {
                release()
            }
            primary.dataset.state = 0
            positive.dataset.state = 0
            negative.dataset.state = 0
        })
    }
}

// program
new (class {
    constructor() {
        document.body.style.backgroundImage = 'url(./image.png)'

        // physics
        this.position = {x: 0, y: 0}
        this.accelleration = {x: 0, y: 0}
        this.velocity = {x: 1, y: 0}
        this.limit = 40
        this.multiplier = 0.5

        // movement controls
        new Axis('horizontal', 68, 65)
        new Axis('vertical', 87, 83)

        this.loop()
    }

    loop() {

        // set accelleration
        this.accelleration.x = document.querySelector('#axis-horizontal').dataset.state * this.multiplier
        this.accelleration.y = document.querySelector('#axis-vertical').dataset.state * this.multiplier

        // add accelleration
        this.velocity.x += this.accelleration.x
        this.velocity.y += this.accelleration.y

        // clear accelleration
        this.accelleration.x = 0
        this.accelleration.y = 0

        // limit velocity
        this.velocity.x = this.velocity.x > this.limit ? this.limit : this.velocity.x
        this.velocity.y = this.velocity.y > this.limit ? this.limit : this.velocity.y

        // set position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        document.body.style.backgroundPosition = `left ${this.position.x}px top ${-this.position.y}px`
        requestAnimationFrame(this.loop.bind(this))
    }
})