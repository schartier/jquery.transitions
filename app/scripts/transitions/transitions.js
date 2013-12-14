(function($) {
    App.TransitionsRoute = Ember.Route.extend({
        setupController: function(controller, model) {
            controller.set('model', model);
        },
        model: function(params) {
            return {
                images: [
                    {src: '/images/paysage.jpg', link: 'http://google.com'},
                    {src: '/images/jimi-hendrix.jpg', link: 'http://facebook.com'}
                ],
                params: {
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
                    width: 500,
                    height: 313
                }
            };
        }
    });

    App.TransitionsController = Ember.ObjectController.extend({
        actions: {
            next: function() {
                this.get('carousel').next();
            },
            previous: function() {
                this.get('carousel').previous();
            },
            pause: function() {
                this.get('carousel').pause();
            },
            resume: function() {
                this.get('carousel').resume();
            }
        }
    })

    App.TransitionsComponentView = Ember.View.extend({
        tagName: 'div',
        classNames: ['carousel-wrapper'],
        classNameBindings: [
            'params.arrowClass',
            'params.bulletsSize',
            'params.thumbnailsSize',
            'params.arrowSize',
            'params.colors',
            'params.bulletClass',
            'params.hasNextPrev:hasNextPrev',
            'params.navAlwaysVisible:navAlwaysVisible',
            'params.navType',
            'params.navPositionV',
            'params.navPositionH',
            'params.navOrientation',
            'params.navPlacement'
        ],
        didInsertElement: function() {
            var $this = this.$(),
                    $transitionsCarousel = $('<div/>').appendTo($this),
                    images = this.get('controller.images'),
                    params = this.get('controller.params');

            if ($this.width() < params.width) {
                var ratio = $this.width() / params.width;
                params.width *= ratio;
                params.height *= ratio;
            }

            $this.css({
                overflow: 'hidden',
                width: params.width,
                height: params.height
            });

            $transitionsCarousel.transitionsCarousel(params, images);

            this.set('controller.carousel', $transitionsCarousel[0].transitionsCarousel);
        },
        willDestroyElement: function() {
            this._super();
            this.get('controller.carousel').destroy();
        }
    });
})(jQuery);
