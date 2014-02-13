
(function($) {
    $.fn.extend({
        transitionsCarousel: function(options, images) {
            var defaultTransitionsOptions = {
                    animationSpeed: 500,
                    rows: 4,
                    cols: 12,
                    effect: 'explode',
                    width: null,
                    height: null
                },
                defaultTransitionsCarouselOptions = {
                    pauseTime: 4000,
                    effect: 'explode',
                    transitions: Object.keys(Transitions.transitions()),
                    navType: 'navigation-bullets', // navigation-bullets, navigation-numbers, navigation-thumbnails
                    navOrientation: 'navigation-horizontal', // navigation-vertical, navigation-horizontal,
                    width: null,
                    height: null,
                    isPlaying: false,
                    isAnimating: false
                };

            var transitions = new Transitions($.extend({}, defaultTransitionsOptions, options));

            return this.each(function() {
                var settings = $.extend({}, defaultTransitionsCarouselOptions),
                    container = $(this).attr('class', 'transitions-carousel')
                        .prepend(link),
                    navWrapper = null,
                    wrapper = $('<div/>').addClass('transitions-carousel-wrapper')
                        .insertBefore(container)
                        .append(container),
                    link = $('<a/>').addClass('transitions-link');


                function addNavigationControls() {
                    if(navWrapper)
                        navWrapper.remove();

                    navWrapper = $('<div/>').addClass('transitions-nav-wrapper').appendTo(wrapper);
                    var nav = $('<div/>').addClass('transitions-nav-container').appendTo(navWrapper);

                    $(images).each(function(index, image) {
                       $('<span/>').attr('rel', index)
                           .addClass('transitions-nav-control')
                           .html('<span class="transitions-index">' + index + '</span>')
                           .appendTo(nav)
                           .on('click', onNavClick)
                           .append(
                                $('<span/>').addClass('transitions-thumbnail-preview')
                                .css({background: 'url(' + this.src + ') transparent no-repeat center center', backgroundSize: 'cover'})
                            );
                    });
                }
                function destroy() {
                    stop();
                    wrapper.remove();
                }
                function reset(options) {
                    $.extend(settings, options);
                    navWrapper.attr('style', '');
                    animateNavigation();
                }

                function init(_options, _images) {
                     $.extend(settings, _options);

                    images = _images;

                    settings.width = settings.width ? settings.width : container.width();
                    settings.height = settings.height ? settings.height : container.height();

                    wrapper.css({'width': settings.width, 'height': settings.height});
                    link.css({'width': settings.width, 'height': settings.height, display: 'none'});

                    $('<span/>').addClass('transitions-nav transitions-prev').click(function() {
                        previous();
                    }).appendTo(wrapper);

                    $('<span/>').addClass('transitions-nav transitions-next').click(function() {
                        next();
                    }).appendTo(wrapper);

                    wrapper.mouseenter(pause).mouseleave(resume);

                    addNavigationControls();
                    start();
                }
                function start() {
                    if (!settings.isPlaying) {
                        settings.isPlaying = true;

                        if (!settings.isAnimating)
                            gotoIdx(0);
                    }
                }
                function pause() {
                    window.clearTimeout(settings.animationTimeout);
                    settings.isPlaying = false;
                }
                function resume() {
                    if (!settings.isPlaying) {
                        settings.isPlaying = true;

                        if (!settings.isAnimating)
                            next();
                    }
                }
                function next() {
                    var idx = (settings.currentImageIndex + 1) % images.length;
                    gotoIdx(idx);
                }
                function previous() {
                    var idx = (settings.currentImageIndex + images.length - 1) % images.length;
                    return gotoIdx(idx);
                }
                function gotoIdx(index) {
                    if (!settings.isAnimating) {
                        settings.previousImage = settings.currentImage;
                        window.clearTimeout(settings.animationTimeout);
                        settings.currentImageIndex = index;
                        settings.currentImage = images[settings.currentImageIndex];
                        runAnimation();
                    }
                }
                function onNavClick() {
                    if (!settings.isAnimating && !$(this).hasClass('active')) {
                        var index = parseInt($(this).attr('rel'));
                        gotoIdx(index);
                    }
                    return false;
                }
                function runAnimation() {
                    if (!settings.isAnimating) {
                        settings.isAnimating = true;

                        var effect = settings.effect;
                        if(!effect) {
                            effect = settings.transitions[Math.floor(Math.random() * settings.transitions.length)];
                        }

                        animateNavigation();
                        transitions._(container , {
                            src: settings.currentImage.src,
                            previousImage: settings.previousImage ? settings.previousImage.src : null,
                            width: settings.width,
                            height: settings.height,
                            effect: settings.effect,
                            onAnimationComplete: function($element, options) {
                                settings.isAnimating = false;
                                if(settings.currentImage.href) {
                                    link.attr({href: currentImage.href, target: '_blank'})
                                        .css({display: 'block'});
                                } else {
                                    link.css({display: 'none'});
                                }

                                if (settings.isPlaying) {
                                    // Schedule next loop
                                    settings.animationTimeout = window.setTimeout(function() {next();}, settings.pauseTime);
                                }
                            }
                        });
                    }
                }
                function animateNavigation() {
                    var activeNav = $('.transitions-nav-control', navWrapper).removeClass('active')
                            .eq(settings.currentImageIndex)
                            .addClass('active'),
                            offsetParent = activeNav.offsetParent();
                    
                    if (settings.navType === 'navigation-thumbnails') {
                        if (settings.navOrientation === 'navigation-vertical') {
                            // Vertical navigation
                            var activeNavTop = activeNav.prop("offsetTop"),
                                    offsetParentTop = offsetParent.prop("offsetTop"),
                                    dy = offsetParentTop + activeNavTop,
                                    median = settings.height / 2;

                            if (dy < 0) {
                                offsetParent.animate({'top': -activeNavTop}, 'slow');
                            } else if (dy > median
                                    && offsetParent.prop("scrollHeight") + offsetParentTop > container.height()) {
                                offsetParent.animate({'top': '-=' + (dy - median) + 'px'}, 'slow');
                            }
                        } else {
                            // Horizontal navigation
                            var activeNavLeft = activeNav.prop("offsetLeft"),
                                    offsetParentLeft = offsetParent.prop("offsetLeft"),
                                    dx = offsetParentLeft + activeNavLeft,
                                    median = container.width() / 2;

                            if (dx < 0) {
                                offsetParent.animate({'left': -activeNavLeft}, 'slow');
                            } else if (dx > median
                                    && offsetParent.prop("scrollWidth") + offsetParentLeft > container.width()) {
                                offsetParent.animate({'left': '-=' + (dx - median) + 'px'}, 'slow');
                            }
                        }
                    }
                }

                this.transitionsCarousel = {
                    destroy: destroy,
                    reset: reset,
                    next: next,
                    previous: previous,
                    pause: pause,
                    resume: resume
                }

                init(options, images);
            });
        }
    });
})(jQuery);