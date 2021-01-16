class Carousel {
    /**
     * @param {String} sliderSelector       Id of slider.
     * @param  {Number} transactionTime     Time for animation before reaching another page, if not given 1000 will be used.
     * @param  {Number} holdTime            Time to hold on active image, if not given 5000 will be used.
     */
    constructor(
        sliderSelector,
        transactionTime = 1000,
        holdTime = 5000,
    ) {
        this.transactionTime = transactionTime;
        this.holdTime = holdTime;

        this.imageHoldHandler = null;

        this.slider = document.getElementById(sliderSelector);
        this.slide = this.slider.querySelector('.slide');

        this.sliderNextBtn = document.createElement('button');
        this.sliderPreviousBtn = document.createElement('button');

        this.currentImageIndex = 0;
        this.lastImageIndex = 0;
        this.images = this.slide.querySelectorAll('img');
        this.imageCount = this.images.length;
        this.imageWidth = (100 / this.imageCount).toFixed(6);
        this.slideLeft = this.currentImageIndex * 100;

        this.sliderStateDots = [];
    }

    animateToNthImage = (n) => {
        const targetWidth = n * 100;
        const direction = this.currentImageIndex > n ? -1 : 1;
        const timePerFrame = (this.transactionTime / ((n * 100) - this.slideLeft)) * direction;
        this.currentImageIndex = n;

        this.sliderStateDots[this.lastImageIndex].classList.remove("active")

        const animate = setInterval(() => {
            this.slideLeft += direction;
            this.slide.style.left = (-this.slideLeft) + '%';
            this.sliderStateDots[n].classList.add("active")

            if (direction === 1 ? this.slideLeft >= targetWidth : this.slideLeft <= targetWidth) {
                this.slide.style.left = (-targetWidth) + '%';
                clearInterval(animate);
                this.lastImageIndex = n;
            }
        }, timePerFrame);
    }

    showNextImage = () => {
        const nextImgIndex = this.currentImageIndex + 1;
        if (nextImgIndex > this.imageCount - 1) this.animateToNthImage(0);
        else this.animateToNthImage(nextImgIndex);
    }

    showPreviousImage = () => {
        const preImgIndex = this.currentImageIndex - 1;
        if (preImgIndex < 0) this.animateToNthImage(this.imageCount - 1);
        else this.animateToNthImage(preImgIndex - 1);
    }

    addListeners() {
        this.sliderNextBtn.addEventListener("click", this.showNextImage)
        this.sliderPreviousBtn.addEventListener("click", this.showPreviousImage)

        this.slider.addEventListener("mouseenter", () => {
            clearInterval(this.imageHoldHandler);
        })
        this.slider.addEventListener("mouseleave", () => {
            this.imageHoldHandler = setInterval(() => {
                this.showNextImage()
            }, this.holdTime);
        })
    }

    createSliderDots = () => {
        for (let i = 0; i < this.imageCount; i++) {
            const currentImageIndicator = document.createElement('span');
            currentImageIndicator.classList.add("current-image-dot")

            currentImageIndicator.addEventListener("click", () => this.animateToNthImage(i))
            this.sliderStateDots.push(currentImageIndicator);
        }

        this.sliderStateDots[0].classList.add("active")
    }

    renderSliderDots = () => {
        const currentImageDotContainer = document.createElement("div");
        currentImageDotContainer.classList.add("current-image-dot-container");

        this.slider.appendChild(currentImageDotContainer);
        this.sliderStateDots.forEach(value => {
            currentImageDotContainer.appendChild(value);
        })
    }

    addStyles() {
        this.addSliderStyles();
        this.addButtonStyles();
    }

    addSliderStyles() {
        this.slide.style.width = (this.imageCount * 100) + '%';
        this.images.forEach(img => (img.style.width = this.imageWidth + '%'));
    }


    addButtonStyles() {
        this.sliderNextBtn.classList.add('slider-btn', 'slider-next-btn');
        this.sliderPreviousBtn.classList.add('slider-btn', 'slider-prev-btn');
    }

    renderSliderButtons() {
        this.sliderNextBtn.innerHTML = '&#10095;';
        this.sliderPreviousBtn.innerHTML = '&#10094;';

        this.slider.appendChild(this.sliderNextBtn);
        this.slider.appendChild(this.sliderPreviousBtn);
    }

    render() {
        this.createSliderDots()
        this.renderSliderDots();
        this.addStyles();
        this.addListeners();
        this.renderSliderButtons();

        this.imageHoldHandler = setInterval(() => {
            this.showNextImage()
        }, this.holdTime);
    }
}

const carousel = new Carousel('first-slider', 1000);
carousel.render();
// carousel.animateToNthImage(1)