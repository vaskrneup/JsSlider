# BASIC JS SLIDER

### To Use Please follow the following conventions

* Provide `id` for identifying the carousel with class `slider`. Then add class of `slide` to inner wrapper, then
  add `img` tags within `slide` div.
    ```
    <div class="slider" id="first-slider">
        <div class="slide">
            <img src="https://www.w3schools.com/howto/img_nature_wide.jpg" alt="">
            <img src="https://www.w3schools.com/howto/img_snow_wide.jpg" alt="">
            <img src="https://www.w3schools.com/howto/img_mountains_wide.jpg" alt="">
        </div>
    </div>
    ```

* You can now use
  ```
  const carousel = new Carousel('first-slider', 500, 1000);
  ```
  to create a carousel object, where `First Paramerter: id of div`
  , `Second Paramerter: time taken to slide to next slide`, `Third Paramerter: Wait time before displaying next image`
  ```
  carousel.render();
  ```
  to render the carousel to DOM.
