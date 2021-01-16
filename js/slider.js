class Carousel {
    /**
     * @param {String} sliderSelector       Id of slider.
     * @param  {Number} transactionTime     Time for animation before reaching another page, if not given 1000 will be used.
     * @param  {Number} holdTime            Time to hold on active image, if not given 1000 will be used.
     */
    constructor(
        sliderSelector,
        transactionTime = 1000,
        holdTime = 1000,
    ) {
        this.transactionTime = transactionTime;
        this.holdTime = holdTime;

        this.slider = document.getElementById(sliderSelector);
        this.slide = this.slider.querySelector('.slide');

        this.sliderNextBtn = document.createElement('button');
        this.sliderPreviousBtn = document.createElement('button');

        this.currentImageIndex = 0;
        this.images = this.slide.querySelectorAll('img');
        this.imageCount = this.images.length;
        this.imageWidth = (100 / this.imageCount).toFixed(6);
        this.slideLeft = this.currentImageIndex * 100;
    }

    animateToNthPicture = (n) => {
        const targetWidth = n * 100;
        const direction = this.currentImageIndex > n ? -1 : 1;
        const timePerFrame = (this.transactionTime / ((n * 100) - this.slideLeft)) * direction;
        this.currentImageIndex = n;

        const animate = setInterval(() => {
            this.slideLeft += direction;
            this.slide.style.left = (-this.slideLeft) + '%';

            if (direction === 1 ? this.slideLeft >= targetWidth : this.slideLeft <= targetWidth) {
                clearInterval(animate)
            }
        }, timePerFrame);
    }

    showNextPicture = () => {
        const nextImgIndex = this.currentImageIndex + 1;
        if (nextImgIndex > this.imageCount - 1) this.animateToNthPicture(0);
        else this.animateToNthPicture(nextImgIndex);
    }

    showPreviousPicture = () => {
        const preImgIndex = this.currentImageIndex - 1;
        if (preImgIndex < 0) this.animateToNthPicture(this.imageCount - 1);
        else this.animateToNthPicture(preImgIndex - 1);
    }

    addListeners() {
        this.sliderNextBtn.addEventListener("click", this.showNextPicture)
        this.sliderPreviousBtn.addEventListener("click", this.showPreviousPicture)
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
        this.addStyles();
        this.addListeners();
        this.renderSliderButtons();
    }
}

const carousel = new Carousel('first-slider');
carousel.render();
// carousel.animateToNthPicture(1)