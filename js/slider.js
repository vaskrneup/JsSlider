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

        this.images = this.slide.querySelectorAll('img');
        this.imageCount = this.images.length;
        this.imageWidth = (100 / this.imageCount).toFixed(6);
    }

    render() {
        this.addStyles();

        this.renderSliderButtons();
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
        this.sliderNextBtn.innerHTML = '&#10094;';
        this.sliderPreviousBtn.innerHTML = '&#10095;';

        this.slider.appendChild(this.sliderNextBtn);
        this.slider.appendChild(this.sliderPreviousBtn);
    }
}

const carousel = new Carousel('first-slider');
carousel.render();
