class Carousel {
    /**
     * @param {String} sliderSelector       Id of slider.
     * @param  {Number} transactionTime     Time for animation before reaching another page, if not given 1000 will be used.
     * @param  {Number} holdTime            Time to hold on active image, if not given 5000 will be used.
     * @param {boolean} autoplay            Signifies if slider must start playing by itself, default is set to true.
     */
    constructor(
        sliderSelector,
        transactionTime = 1000,
        holdTime = 5000,
        autoplay = true,
    ) {
        this.transactionTime = transactionTime;
        this.holdTime = holdTime;

        this.imageHoldHandler = null;

        this.autoplay = autoplay;
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

    // OLD ALGO !!
    // animateToNthImage = (n) => {
    //     const targetWidth = n * 100;
    //     const direction = this.currentImageIndex > n ? -1 : 1;
    //     const timePerFrame = (this.transactionTime / ((n * 100) - this.slideLeft)) * direction;
    //     this.currentImageIndex = n;
    //
    //     this.sliderStateDots[this.lastImageIndex].classList.remove('active');
    //
    //     // const animate = setInterval(() => {
    //     //     this.slideLeft += direction;
    //     //     this.slide.style.left = (-this.slideLeft) + '%';
    //     //     this.sliderStateDots[n].classList.add('active');
    //     //
    //     //     if (direction === 1 ? this.slideLeft >= targetWidth : this.slideLeft <= targetWidth) {
    //     //         this.slide.style.left = (-targetWidth) + '%';
    //     //         clearInterval(animate);
    //     //         this.lastImageIndex = n;
    //     //     }
    //     // }, timePerFrame);
    // }
    /**
     *  Slides to nth position with animation.
     *  @param n {Number}       slides to this index.
     * */
    animateToNthImage = (n) => {
        // disable slider buttons until the animation is complete !!
        this.sliderNextBtn.disabled = true;
        this.sliderPreviousBtn.disabled = true;

        const targetWidth = n * 100;
        const direction = this.currentImageIndex > n ? -1 : 1;
        const perFrameWidth = ((targetWidth - this.slideLeft) / (60 * (this.transactionTime / 1000)));
        this.currentImageIndex = n;

        this.sliderStateDots[this.lastImageIndex].classList.remove('active');
        this.sliderStateDots[n].classList.add('active');

        const animate = () => {
            this.slideLeft += perFrameWidth;
            this.slide.style.left = (-this.slideLeft) + '%';

            if (direction === 1 ? this.slideLeft >= targetWidth : this.slideLeft <= targetWidth) {
                this.slideLeft = targetWidth;
                this.slide.style.left = (-targetWidth) + '%';
                this.lastImageIndex = n;

                this.sliderNextBtn.disabled = false;
                this.sliderPreviousBtn.disabled = false;
            } else {
                requestAnimationFrame(animate);
            }
        };

        animate();
    }
    /**
     *  Slides to next image if available else, to first image.
     * */
    showNextImage = () => {
        const nextImgIndex = this.currentImageIndex + 1;
        if (nextImgIndex > this.imageCount - 1) this.animateToNthImage(0);
        else this.animateToNthImage(nextImgIndex);
    }

    /**
     *  Slides to previous image if available else, to last image.
     * */
    showPreviousImage = () => {
        const preImgIndex = this.currentImageIndex - 1;
        if (preImgIndex < 0) this.animateToNthImage(this.imageCount - 1);
        else this.animateToNthImage(preImgIndex);
    }

    /**
     *  Place to add listeners, which are supposed to change or overridden.
     * */
    addListeners = () => {
        this.sliderNextBtn.addEventListener('click', this.showNextImage);
        this.sliderPreviousBtn.addEventListener('click', this.showPreviousImage);

        this.slider.addEventListener('mouseenter', this.stopSliderInterval);
        this.slider.addEventListener('mouseleave', this.startSliderInterval);

        document.addEventListener('visibilitychange', () => {
            if (this.imageHoldHandler) {
                this.stopSliderInterval();
            } else {
                this.startSliderInterval();
            }
        });
    };

    /**
     *  Creates slider dots.
     * */
    createSliderDots = () => {
        for (let i = 0; i < this.imageCount; i++) {
            const currentImageIndicator = document.createElement('span');
            currentImageIndicator.classList.add('current-image-dot');

            currentImageIndicator.addEventListener('click', () => this.animateToNthImage(i));
            this.sliderStateDots.push(currentImageIndicator);
        }

        this.sliderStateDots.length && this.sliderStateDots[0].classList.add('active');
    }

    /**
     *  Renders slider dots to the DOM.
     * */
    renderSliderDots = () => {
        const currentImageDotContainer = document.createElement('div');
        currentImageDotContainer.classList.add('current-image-dot-container');

        this.slider.appendChild(currentImageDotContainer);
        this.sliderStateDots.forEach(value => {
            currentImageDotContainer.appendChild(value);
        });
    }

    /**
     *  Runs sub methods for adding styles, can be overridden for changing styles.
     * */
    addStyles() {
        this.addSliderStyles();
        this.addButtonStyles();
    }

    /**
     *  Creates slider dots, override to change slider styles.
     * */
    addSliderStyles() {
        this.slide.style.width = (this.imageCount * 100) + '%';
        this.images.forEach(img => (img.style.width = this.imageWidth + '%'));
    }

    /**
     *  Creates button, override to change button styles.
     * */
    addButtonStyles() {
        this.sliderNextBtn.classList.add('slider-btn', 'slider-next-btn');
        this.sliderPreviousBtn.classList.add('slider-btn', 'slider-prev-btn');
    }

    /**
     *  Renders slider Buttons.
     * */
    renderSliderButtons = () => {
        this.sliderNextBtn.innerHTML = '&#10095;';
        this.sliderPreviousBtn.innerHTML = '&#10094;';

        this.slider.appendChild(this.sliderNextBtn);
        this.slider.appendChild(this.sliderPreviousBtn);
    };

    /**
     *  Starts auto play in slider.
     * */
    startSliderInterval = () => {
        if (this.autoplay) {
            this.imageHoldHandler = setInterval(() => {
                this.showNextImage()
            }, this.holdTime);
        }
    }

    /**
     *  Stops auto play in slider.
     * */
    stopSliderInterval = () => {
        if (this.autoplay) {
            clearInterval(this.imageHoldHandler);
            this.imageHoldHandler = null;
        }
    }

    /**
     *  Renders all the widgets.
     * */
    render = () => {
        this.createSliderDots();
        this.addStyles();
        this.addListeners();
        this.renderSliderButtons();
        this.renderSliderDots();

        this.startSliderInterval();
    };
}

const carousel = new Carousel('first-slider', 500, 1000, false);
const carousel1 = new Carousel('second-slider', 1000, 1500);
// const carousel2 = new Carousel('third-slider', 700, 2000);
carousel.render();
carousel1.render();
// carousel2.render();
