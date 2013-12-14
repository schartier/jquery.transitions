(function($) {
    /**
     * Provides carousel editor model to the carousel controller (in this case,
     * generated automatically by ember).
     *
     * The model fields will be available in the carousel route template and can be
     * passed to the carousel and carouselEditor views as needed.
     */
    App.CarouselRoute = Ember.Route.extend({
        model: function() {
            // Meet the store... this is part of ember data, we will skip this part.
            // You could also have simply returned the data without inserting it
            // in the store.
            var store = this.get('store');

            store.push('dk-carousel-editor', {
                id: 1,
                params: {
                    preset: 'custom',
                    speed: 'medium-speed',
                    colors: 'colors-light',
                    arrowSize: 'arrows-medium',
                    bulletsSize: 'bullets-medium',
                    thumbnailsSize: 'thumbnails-medium',
                    animationSpeed: 1000,
                    pauseTime: 3000,
                    hasNextPrev: true,
                    nextText: 'next',
                    previousText: 'previous',
                    applyTransitionsRandomly: true,
                    rows: 4,
                    cols: 12,
                    transitionsGroup: 'simple',
                    transitions: ['fade', 'slideLeft', 'slideRight', 'slideUp', 'slideDown'],
                    // Dakis options
                    navType: 'navigation-thumbnails', // bullets, navigation-numbers, thumbnails
                    navPositionV: 'navigation-bottom',
                    navPositionH: 'navigation-right',
                    navOrientation: 'navigation-vertical', // vertical, horizontal
                    navAlwaysVisible: true,
                    arrowClass: 'arrow1',
                    bulletClass: 'bullet1',
                },
                images: [
                    {url: 'static/images/nature/1.jpg', title: 'Image 1', description: '1. Description de l\'image 1', link: 'http://getbootstrap.com/2.3.2'},
                    {url: 'static/images/nature/2.jpg', title: 'Image 2', description: '2. Description de l\'image 2', link: 'http://emberjs.com/'},
                    {url: 'static/images/nature/3.jpg', title: 'Image 3', description: '3. Description de l\'image 3', link: 'http://www.buzzfeed.com/lukelewis/28-things-only-developers-will-find-funny'},
                    {url: 'static/images/nature/4.jpg', title: 'Image 4', description: '4. Description de l\'image 4', link: 'http://getbootstrap.com/2.3.2'},
                    {url: 'static/images/nature/5.jpg', title: 'Image 5', description: '5. Description de l\'image 5', link: 'http://emberjs.com/'},
                    {url: 'static/images/nature/6.jpg', title: 'Image 6', description: '6. Description de l\'image 6', link: 'http://getbootstrap.com/2.3.2'},
                    {url: 'static/images/nature/7.jpg', title: 'Image 7', description: '7. Description de l\'image 7', link: 'http://emberjs.com/'}
                ]
            });

            return store.find('dk-carousel-editor', 1);
        }
    });
})(jQuery);
