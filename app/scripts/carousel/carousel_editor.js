(function($) {

    var simpleTransitions = ['fade', 'slideLeft', 'slideRight', 'slideUp', 'slideDown'],
            complexTransitions = ['swirlFadeOutRotate', 'swirlFadeOutRotateFancy', 'swirlFadeIn', 'swirlFadeOut', 'slabs', 'spiral', 'spiralReverse',
                'diagonalShow', 'diagonalShowReverse', 'spiralDimension', 'spiralReverseDimension', 'boxFadeIn', 'boxFadeOutOriginal',
                'boxFadeOutOriginalRotate', 'diagonalFade', 'diagonalFadeReverse',
                'randomFade', 'randomDimensions', 'boxes', 'explode', 'explodeFancy', 'linearPeal', 'linearPealReverse', 'linearPealDimensions',
                'linearPealReverseDimensions', 'blind', 'blindHorizontal', 'barsUp', 'barsDown', 'barsDownReverse',
                'blindFade', 'fallingBlindFade', 'raisingBlindFade', 'mixBars', 'mixBarsFancy', 'blindFadeReverse', 'slideIn',
                'slideInFancy', 'slideInReverse', 'slideIn', 'slideInReverse']

    /**
     * Extended carousel model including all the information required by the
     * carousel editor.
     */
    App.DkCarouselEditorModel = App.DkCarouselModel.extend({
        presets: {
            options: [
                {label: 'Custom', value: ''},
                {label: 'Thumbnails horizontal', value: 'thumbnailsHorizontal'},
                {label: 'Thumbnails vertical light', value: 'thumbnailsVerticalLight'},
                {label: 'Thumbnails vertical dark', value: 'thumbnailsVerticalDark'},
                {label: 'Pure', value: 'pure'},
                {label: 'Small bullets light', value: 'smallBulletsLight'},
                {label: 'Small bullets dark', value: 'smallBulletsDark'}
            ],
            values: {
                thumbnailsHorizontal: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "arrow1",
                    arrowSize: "arrows-medium",
                    bulletClass: "bullet1",
                    bulletsSize: "bullets-medium",
                    colors: "colors-light",
                    cols: 12,
                    transitions: ["blindFadeReverse"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: true,
                    navOrientation: "navigation-horizontal",
                    navPositionH: "navigation-center",
                    navPositionV: "navigation-bottom",
                    navType: "navigation-thumbnails",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-small"
                },
                pure: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "",
                    arrowSize: "arrows-small",
                    bulletClass: "",
                    bulletsSize: "bullets-small",
                    colors: "colors-light",
                    cols: 12,
                    transitions: ["fade", "slideLeft", "slideRight", "slideUp", "slideDown"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: false,
                    navOrientation: "vertical",
                    navPositionH: "right",
                    navPositionV: "top",
                    navType: "none",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-big"
                },
                smallBulletsLight: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "arrow1",
                    arrowSize: "arrows-medium",
                    bulletClass: "bullet2",
                    bulletsSize: "bullets-small",
                    colors: "colors-light",
                    cols: 12,
                    transitions: ["fade", "slideLeft", "slideRight", "slideUp", "slideDown"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: true,
                    navOrientation: "horizontal",
                    navPositionH: "right",
                    navPositionV: "bottom",
                    navType: "bullets",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-medium"
                },
                thumbnailsVerticalLight: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "arrow1",
                    arrowSize: "arrows-medium",
                    bulletClass: "bullet1",
                    bulletsSize: "bullets-small",
                    colors: "colors-light",
                    cols: 12,
                    transitions: ["fade", "slideLeft", "slideRight", "slideUp", "slideDown"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: true,
                    navOrientation: "vertical",
                    navPositionH: "right",
                    navPositionV: "bottom",
                    navType: "thumbnails",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-medium"
                },
                smallBulletsDark: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "arrow1",
                    arrowSize: "arrows-medium",
                    bulletClass: "bullet2",
                    bulletsSize: "bullets-small",
                    colors: "colors-dark",
                    cols: 12,
                    transitions: ["fade", "slideLeft", "slideRight", "slideUp", "slideDown"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: true,
                    navOrientation: "horizontal",
                    navPositionH: "right",
                    navPositionV: "bottom",
                    navType: "bullets",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-medium"
                },
                thumbnailsVerticalDark: {
                    animationSpeed: 1500,
                    applyTransitionsRandomly: true,
                    arrowClass: "arrow1",
                    arrowSize: "arrows-medium",
                    bulletClass: "bullet1",
                    bulletsSize: "bullets-small",
                    colors: "colors-dark",
                    cols: 12,
                    transitions: ["fade", "slideLeft", "slideRight", "slideUp", "slideDown"],
                    transitionsGroup: "simple",
                    hasNextPrev: true,
                    navAlwaysVisible: true,
                    navOrientation: "vertical",
                    navPositionH: "right",
                    navPositionV: "bottom",
                    navType: "thumbnails",
                    nextText: "next",
                    pauseTime: 4000,
                    preset: "custom",
                    previousText: "previous",
                    rows: 4,
                    speed: "medium-speed",
                    thumbnailsSize: "thumbnails-medium"
                }
            }
        },
        transitions: {
            groups: {
                simple: simpleTransitions,
                complex: complexTransitions,
                all: complexTransitions.concat(simpleTransitions)
            },
            options: [
                {label: 'All', value: 'all'},
                {label: 'Simple', value: 'simple'},
                {label: 'Complex', value: 'complex'}
            ]
        },
        navigation: {
            types: [
                {label: 'None', value: 'navigation-none'},
                {label: 'Bullets', value: 'navigation-bullets'},
                {label: 'Numbers', value: 'navigation-numbers'},
                {label: 'Thumbnails', value: 'navigation-thumbnails'}
            ],
            orientations: [
                {label: 'Horizontal', value: 'navigation-horizontal'},
                {label: 'Vertical', value: 'navigation-vertical'}
            ],
            verticalPositions: [
                {label: 'Top', value: 'navigation-top'},
                {label: 'Bottom', value: 'navigation-bottom'}
            ],
            horizontalPositions: [
                {label: 'Left', value: 'navigation-left'},
                {label: 'Center', value: 'navigation-center'},
                {label: 'Right', value: 'navigation-right'}
            ]
        },
        arrows: {
            sizes: [
                {label: 'Small', value: 'arrows-small'},
                {label: 'Medium', value: 'arrows-medium'},
                {label: 'Big', value: 'arrows-big'}],
            types: [
                {label: '<i class="icon-none"></i>', value: ''},
                {label: '<i class="icon-arrow1-right"></i>', value: 'arrow1'},
                {label: '<i class="icon-arrow2-right"></i>', value: 'arrow2'},
                {label: '<i class="icon-arrow3-right"></i>', value: 'arrow3'},
                {label: '<i class="icon-arrow4-right"></i>', value: 'arrow4'},
                {label: '<i class="icon-arrow5-right"></i>', value: 'arrow5'},
                {label: '<i class="icon-arrow6-right"></i>', value: 'arrow6'},
                {label: '<i class="icon-arrow7-right"></i>', value: 'arrow7'},
                {label: '<i class="icon-arrow-metro1-right"></i>', value: 'arrow-metro1'},
                {label: '<i class="icon-arrow-metro2-right"></i>', value: 'arrow-metro2'},
                {label: '<i class="icon-arrow-metro3-right"></i>', value: 'arrow-metro3'},
                {label: '<i class="icon-arrow-metro4-right"></i>', value: 'arrow-metro4'}
            ]
        },
        bullets: {
            sizes: [
                {label: 'Small', value: 'bullets-small'},
                {label: 'Medium', value: 'bullets-medium'},
                {label: 'Big', value: 'bullets-big'}],
            types: [
                {label: '<i class="icon-bullet-donut"></i>', value: 'bullet1'},
                {label: '<i class="icon-bullet2-on"></i>', value: 'bullet2'},
                {label: '<i class="icon-bullet-circled-star"></i>', value: 'bullet-circledstar'},
                {label: '<i class="icon-bullet-metrostation-on"></i>', value: 'bullet-metrostation'}
            ]
        },
        thumbnails: {
            sizes: [
                {label: 'Small', value: 'thumbnails-small'},
                {label: 'Medium', value: 'thumbnails-medium'},
                {label: 'Big', value: 'thumbnails-big'}]
        },
        animationSpeeds: {
            options: [
                {label: 'Slow', value: 'slow-speed'},
                {label: 'Medium', value: 'medium-speed'},
                {label: 'Fast', value: 'fast-speed'}
            ],
            values: {
                'slow-speed': {
                    animationSpeed: 2000,
                    pauseTime: 6000,
                },
                'medium-speed': {
                    animationSpeed: 1500,
                    pauseTime: 4000,
                },
                'fast-speed': {
                    animationSpeed: 1000,
                    pauseTime: 3000,
                }
            }
        },
        colors: {
            options: [
                {label: 'Light', value: 'colors-light'},
                {label: 'Dark', value: 'colors-dark'}
            ]
        }
    });

    /**
     * Provides all the features required by the carousel editor.
     *
     * The carousel editor template contains the carousel view and changes made
     * to the carousel params are instantly reflected in the carousel since
     * the carousel and the editor shares the same params object.
     */
    App.DkCarouselEditorView = Ember.View.extend({
        templateName: 'dk-carousel-editor',
        actions: {
            // Some changes requires to recreate the dkarousel-slider to avoid
            // ending in an inconsistent state.
            updateCarousel: function() {
                this.send('destroyCarousel');
                this.$('.dkarousel-slider.original').dkarousel(this.get('params'));
            },
            // If we don't destroy the carousel before we "refresh" it, the
            // existing animation loop will continue along with the new one.
            destroyCarousel: function() {
                var $element = this.$('.dkarousel-slider.original');
                if ($element.length && $element[0].dkarousel) {
                    $element[0].dkarousel.destroy();
                }
            },
            // Utility function to log the current params in the console
            // , this is usefull to create presets...
            logParams: function() {
                var params = this.get('params'),
                        cleanedParams = {};

                // Unfortunately, Ember implements getters and setters on objects
                // attributes so just logging the params is not sufficient.
                for (var key in params) {
                    cleanedParams[key] = params[key];
                }

                console.log(cleanedParams);
            }
        },
        // Variables used inside the template to hide/show controls according to
        // the navigation type.
        isNavType: {
            'navigation-none': false,
            'navigation-bullets': false,
            'navigation-numbers': false,
            'navigation-thumbnails': false
        },
        // Update the params according to the "literal" speed selected
        speedDidChange: function() {
            var params = this.get('params'),
                    animationSpeeds = this.get('controller.animationSpeeds.values'),
                    newParams = animationSpeeds[this.get('params.speed')];

            $.extend(params, newParams);
        }.observes('params.speed'),
        // Update the flags (isNavType) used to show/hide controls according to
        // the navigation type
        navTypeDidChange: function(data) {
            var navTypes = this.get('controller.navigation.types'),
                    isNavType = this.get('isNavType'),
                    i;

            for (i = 0; i < navTypes.length; i++) {
                this.set('isNavType.' + navTypes[i].value, false);
            }

            this.set('isNavType.' + this.get('params.navType'), true);
        }.observes('params.navType').on('init'),
        // Bind the transitions list according to the selected transitionsGroup (literal)
        transitionsDidChange: function() {
            var transitionsGroups = this.get('controller.transitions.groups');

            this.set('params.transitions', transitionsGroups[this.get('params.transitionsGroup')]);

            // Trigger the updateCarousel event
            this.send('updateCarousel');
        }.observes('params.transitionsGroup'),
        // Update the carousel when required
        shouldUpdateCarousel: function() {
            // Trigger the updateCarousel event, will be handled by the closest
            // implementation (this view, controller, parent controller, etc.)

            // In the current situation, this will be handled by function
            // this.actions.updateCarousel
            this.send('updateCarousel');
        }.observes('params.speed', 'params.transitionsGroup', 'params.navOrientation', 'params.navType')
    });
})(jQuery);