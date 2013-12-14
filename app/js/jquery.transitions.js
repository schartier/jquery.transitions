(function($) {

    // Petit hack pour contourner l'implementation de reverse par prototype.js
    var reverseArray = (typeof []._reverse === 'undefined') ? [].reverse : []._reverse;

    function animationComplete($element, options) {
        // Clean up everything, I guess...
        $('.transitions-dn', $element).remove();
        $('.transitions-el', $element).removeClass('transitions-el').addClass('transitions-dn').css({zIndex: 0});
        $('.transitions-fi', $element).removeClass('transitions-fi').addClass('transitions-dn').css({zIndex: 0});

        if (options.onAnimationComplete) {
            options.onAnimationComplete.call(this, $element, options);
        }
    }

    function fi(src, css) {
        var _css = $.extend({
            zIndex: 1,
            backgroundImage: src ? 'url(' + src + ')' : '',
            backgroundColor: src ? 'transparent' : '#ffffff',
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            width: '100%',
            height: '100%',
            display: 'block',
            left: 0,
            top: 0
        }, css);

        return $('<div/>').css(_css).addClass('transitions-fi');
    }

    function el(src, css) {
        var _css = $.extend({
            backgroundImage: src ? 'url(' + src + ')' : '',
            backgroundColor: src ? 'transparent' : '#ffffff',
            backgroundPosition: '0 0',
            backgroundRepeat: 'no-repeat',
            position: 'absolute',
            zIndex: 1,
            opacity: 0
        }, css);

        return $('<div/>').css(_css).addClass('transitions-el');
    }

    function hideIt($element, options, i) {
        var index = options.circles - i;
        var op = 1 - (index + 1) / 10;
        $('.transitions-el:eq(' + index + ')', $element).animate({opacity: op}, options.timeFactor, function() {
            if (i < $('.transitions-el', $element).length - 1) {
                i++;
                hideIt($element, options, i);
            }
            else {
                $('.transitions-el', $element).animate({opacity: 0}, options.animationSpeed);
                setTimeout(function() {
                    animationComplete($element, options);
                }, (options.animationSpeed + 1));
            }
        });
    }

    function spiralify(cols, rows) {
        var matrix = [],
                val = 0;

        for (var i = 0; i < rows; i++) {
            var subArray = new Array();
            matrix.push(subArray);
            for (var j = 0; j < cols; j++) {
                subArray.push(val);
                val++;
            }
        }

        function _spiralify(matrix) {
            if (matrix.length === 1) {
                return matrix[0];
            }

            var firstRow = matrix[0]
                    , numRows = matrix.length
                    , nextMatrix = []
                    , newRow
                    , rowIdx
                    , colIdx = matrix[1].length - 1;

            for (colIdx; colIdx >= 0; colIdx--) {
                newRow = [];
                for (rowIdx = 1; rowIdx < numRows; rowIdx++) {
                    newRow.push(matrix[rowIdx][colIdx]);
                }

                nextMatrix.push(newRow);
            }

            firstRow.push.apply(firstRow, _spiralify(nextMatrix));
            return firstRow;
        }

        return _spiralify(matrix);
    }
    function swapDirection(index, options) {
        if (index % options.cols === 0) {
            options.currentRow++;
            if (options.direction === 'forward')
                options.direction = 'backward';
            else
                options.direction = 'forward';
        }
    }
    function createBoxes($element, src, options, css) {
        var w = options.width / options.cols,
                h = options.height / options.rows;

        options.timeFactor = options.animationSpeed / (options.rows * options.cols);
        options.coordinates = [];
        for (var i = 0; i < options.rows; i++) {
            for (var j = 0; j < options.cols; j++) {
                options.coordinates.push({
                    left: j * w,
                    top: i * h
                });

                el(src, $.extend({
                    backgroundPosition: '' + (j * -w) + 'px ' + (i * -h) + 'px',
                    width: Math.ceil(w) + 'px',
                    height: Math.ceil(h) + 'px',
                    top: (i * h) + 'px',
                    left: (j * w) + 'px',
                    opacity: 0
                }, css)).appendTo($element);
            }
        }

        return $('.transitions-el', $element);
    }
    function createCircles($element, src, options, css) {
        var zindex = 100,
                w = 0,
                left,
                top,
                elements = [],
                element;

        options.timeFactor = options.animationSpeed / options.circles;
        options.minCircumference = options.width / options.circles;
        for (var i = 0; i < options.circles; i++) {
            w += options.minCircumference;
            left = (options.width - w) / 2;
            top = (options.height - w) / 2;

            element = el(src, $.extend({
                backgroundPosition: -left.toFixed(6) + 'px ' + -top.toFixed(6) + 'px',
                borderRadius: '50%',
                left: left,
                top: top,
                width: Math.ceil(w),
                height: Math.ceil(w),
                zIndex: zindex--
            }, css));

            elements.push(element);
        }
        elements[elements.length - 1].css({borderRadius: 0});
        $element.append(elements);

        return $('.transitions-el', $element);
    }
    function createVBars($element, src, options, css) {
        var vBars = options.cols * 2,
                w = options.width / vBars,
                i;

        options.timeFactor = options.animationSpeed / vBars;
        for (var i = 0; i < vBars; i++) {
            el(src, $.extend({
                width: Math.ceil(w),
                height: options.height,
                left: i * w,
                backgroundPosition: '' + (-i * w) + 'px 0px',
                opacity: 0
            }, css)).appendTo($element);
        }

        return $('.transitions-el', $element);
    }
    function createHBars($element, src, options, css) {
        var hBars = options.rows * 2,
                h = options.height / hBars,
                i;

        options.timeFactor = options.animationSpeed / hBars;
        for (var i = 0; i < hBars; i++) {
            el(src, $.extend({
                height: Math.ceil(h),
                width: options.width,
                top: i * h,
                backgroundPosition: '0px ' + (-i * h) + 'px',
                opacity: 0
            }, css)).appendTo($element);
        }

        return $('.transitions-el', $element);
    }

    var transitions = {};

    transitions.randomFade = function($element, options) {
        return transitions.boxes($element, options, true, false, true);
    };
    transitions.randomDimensions = function($element, options) {
        return transitions.boxes($element, options, true, true);
    };
    transitions.boxes = function($element, options, random, dimensions, fade, reverse, matrix) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                noOfBoxes = options.rows * options.cols,
                $elements = createBoxes($element, options.src, options),
                factor = 0,
                cssFrom = {opacity: 1},
                cssTo = {opacity: 1};

        if (random) {
            $elements.sort(function(a, b) {
                return Math.random() - 0.5;
            });
        } else if (reverse) {
            $elements = reverseArray.call($elements);
        }

        if (dimensions) {
            cssFrom.width = 0;
            cssFrom.height = 0;
            cssTo.width = Math.ceil(w);
            cssTo.height = Math.ceil(h);
        } else {
            fade = true;
        }

        if (fade) {
            cssFrom.opacity = 0;
        }

        $elements.css(cssFrom);
        $elements.each(function(index, element) {
            setTimeout(function() {
                $(element).animate(cssTo,
                        options.animationSpeed,
                        function() {
                            if (index === noOfBoxes - 1) {
                                animationComplete($element, options);
                            }
                        }
                );
            }, factor * 1.5);
            factor += options.timeFactor;
        });
    };
    transitions.linearPealDimensions = function($element, options, fade, reverse) {
        return transitions.boxes($element, options, false, true, fade, reverse);
    };
    transitions.linearPealReverseDimensions = function($element, options, fade) {
        return transitions.linearPealDimensions($element, options, fade, true);
    };
    transitions.linearPeal = function($element, options, reverse) {
        return transitions.boxes($element, options, false, false, true, reverse);
    };
    transitions.linearPealReverse = function($element, options) {
        return transitions.linearPeal($element, options, true);
    };

    transitions.spiral = function($element, options, dimensions, fade, reverse) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                noOfBoxes = options.rows * options.cols,
                $elements = createBoxes($element, options.src, options),
                factor = 0,
                cssFrom = {opacity: 1},
        cssTo = {opacity: 1},
        indeces;

        if (reverse) {
            $elements = reverseArray.call($elements);
        }

        if (dimensions) {
            cssFrom.width = 0;
            cssFrom.height = 0;
            cssTo.width = Math.ceil(w);
            cssTo.height = Math.ceil(h);
        } else {
            fade = true;
        }

        if (fade) {
            cssFrom.opacity = 0;
        }

        $elements.css(cssFrom);

        indeces = spiralify(options.cols, options.rows);
        if (reverse)
            indeces = reverseArray.call(indeces);

        for (var i = 0; i < indeces.length; i++) {
            (function(index) {
                setTimeout(function() {
                    $elements.eq(indeces[index]).animate(cssTo,
                            options.animationSpeed / 2,
                            function() {
                                if (index === indeces.length - 1) {
                                    animationComplete($element, options);
                                }
                            });
                }, factor * 1.5);
                factor += options.timeFactor;
            })(i);
        }
    };
    transitions.spiralReverse = function($element, options) {
        return transitions.spiral($element, options, false, true);
    };
    transitions.spiralDimension = function($element, options) {
        return transitions.spiral($element, options, true, false);
    };
    transitions.spiralReverseDimension = function($element, options) {
        return transitions.spiral($element, options, true, false, true);
    };
    transitions.boxFade = function($element, options, out, rotate, toggle, swirl) {
        var $elements = createCircles($element, out ? options.previousImage : options.src, options, {
            opacity: out ? 1 : 0
        });

        if (!swirl) {
            $elements.css({borderRadius: 0});
        }

        if (out) {
            $elements = reverseArray.call($elements);
            fi(options.src).prependTo($element);
        }

        var degree = 20;
        $elements.each(function(index, element) {
            degree += 5;

            var cssTo = {
                opacity: out ? 0 : 1,
                rotation: rotate ? 360 : 0
            };

            if (rotate && toggle && index % 2) {
                cssTo.rotation = -cssTo.rotation;
            }

            setTimeout(function() {
                $(element).animate(cssTo, {
                    duration: options.animationSpeed,
                    step: function(now, fx) {
                        if (fx.prop === 'rotation') {
                            $(this).css({'transform': 'rotate(' + now + 'deg)'});
                        }
                    },
                    done: function() {
                        if (index === $elements.length - 1)
                            animationComplete($element, options);
                    }
                });
            }, 100 * index);
        });
    };
    transitions.boxFadeOut = function($element, options, rotate, toggle) {
        return transitions.boxFade($element, options, true, rotate, toggle);
    };
    transitions.boxFadeOutRotate = function($element, options, toggle) {
        return transitions.boxFadeOut($element, options, true, toggle);
    };
    transitions.boxFadeOutRotateFancy = function($element, options) {
        return transitions.boxFadeOutRotate($element, options, true);
    };
    transitions.boxFadeIn = function($element, options, rotate, toggle) {
        return transitions.boxFade($element, options, false, rotate, toggle);
    };
    transitions.boxFadeInRotate = function($element, options, toggle) {
        return transitions.boxFadeIn($element, options, true, toggle);
    };
    transitions.boxFadeInRotateFancy = function($element, options, toggle) {
        return transitions.boxFadeInRotate($element, options, true);
    };
    transitions.swirlFadeIn = function($element, options, rotate, toggle) {
        return transitions.boxFade($element, options, false, rotate, toggle, true);
    };
    transitions.swirlFadeInRotate = function($element, options, toggle) {
        return transitions.swirlFadeIn($element, options, true, toggle);
    };
    transitions.swirlFadeInRotateFancy = function($element, options) {
        transitions.swirlFadeInRotate($element, options, true);
    };
    transitions.swirlFadeOut = function($element, options, rotate, toggle) {
        return transitions.boxFade($element, options, true, rotate, toggle, true);
    };
    transitions.swirlFadeOutRotate = function($element, options, toggle) {
        return transitions.swirlFadeOut($element, options, true, toggle);
    };
    transitions.swirlFadeOutRotateFancy = function($element, options) {
        transitions.swirlFadeOutRotate($element, options, true);
    };

    transitions.diagonalFade = function($element, options, reverse, animateSize) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                factor = 0,
                noOfDiagonals = options.rows + options.cols - 1,
                complete = 0,
                $elements = createBoxes($element, options.src, options).css({
            width: animateSize ? 0 : Math.ceil(w),
            height: animateSize ? 0 : Math.ceil(h),
            opacity: animateSize ? 1 : 0
        });

        var diagonal = new Array();
        for (var i = 0; i < noOfDiagonals; i++) {
            diagonal.push(i);
            diagonal[i] = new Array();
            for (var j = Math.min(options.rows, i + 1) - 1; j >= Math.max(0, i - options.cols + 1); j--) {
                diagonal[i].push((j * options.cols) + i - j);
            }
        }

        if (reverse)
            diagonal.reverse();

        $(diagonal).each(function(index, elements) {
            setTimeout(function() {

                $(elements).each(function(i, val) {
                    $elements.eq(val).animate({
                        opacity: 1,
                        width: Math.ceil(w),
                        height: Math.ceil(h)
                    },
                    options.animationSpeed,
                            function() {
                                if (++complete === $elements.length) {
                                    animationComplete($element, options);
                                }
                            });
                });
            }, factor * 6);
            factor += options.timeFactor;
        });
    };
    transitions.diagonalFadeReverse = function($element, options) {
        return transitions.diagonalFade($element, options, true, false);
    };
    transitions.diagonalShow = function($element, options) {
        return transitions.diagonalFade($element, options, false, true);
    };
    transitions.diagonalShowReverse = function($element, options) {
        return transitions.diagonalFade($element, options, true, true);
    };
//        transitions.slabs = function($element, options) {
//            return transitions.vBars($element, options, false, false, false, false, false, false, true);
//            var vBars = options.cols * 2,
//                    w = options.width / vBars,
//                    factor = 0;
//
//            for (var i = 0; i < vBars; i++) {
//                $('<div/>').css({
//                    width: Math.ceil(w),
//                    height: options.height,
//                    left: -w,
//                    position: 'absolute',
//                    backgroundImage: 'url(' + options.src + ')',
//                    backgroundPosition: '' + (-i * w) + 'px 0px',
//                    opacity: 0
//                }).addClass('transitions-el').appendTo($element);
//            }
//            options.timeFactor = options.animationSpeed / vBars;
//            $('.transitions-el', $element).each(function(index) {
//                var i = vBars - index;
//                var el = $('.transitions-el', $element).eq(i);
//                var left = i * w;
//                setTimeout(function() {
//                    el.animate({left: left, opacity: 1}, options.animationSpeed);
//                }, factor);
//                factor += options.timeFactor;
//            });
//            factor -= options.timeFactor;
//            setTimeout(function() {
//                $('.transitions-el', $element).eq(0).animate({left: 0, opacity: 1}, options.animationSpeed, function() {
//                    animationComplete($element, options);
//                });
//            }, factor);
//        };
    transitions.horizontalBlind = function($element, options, reverse, fade) {
        return transitions.hBars(
                $element,
                options,
                false, // direction
                false, // order
                reverse, // reverse
                false, // toggle
                fade, // fade
                true, // dimensions
                false // slabs
                );
    };
    transitions.horizontalBlindReverse = function($element, options) {
        return transitions.horizontalBlind($element, options,
                true // reverse
                );
    };
    transitions.verticalBlind = function($element, options, reverse, fade) {
        return transitions.vBars($element, options,
                false, // direction
                false, // order
                reverse, // reverse
                false, // toggle
                fade, // fade
                true, // dimensions
                false // slabs
                );
    };
    transitions.verticalBlindReverse = function($element, options) {
        return transitions.verticalBlind($element, options,
                true // reverse
                );
    };
    transitions.horizontalBlindFade = function($element, options, reverse, dimensions) {
        return transitions.hBars(
                $element,
                options,
                false, // direction
                false, // order
                reverse, // reverse
                false, // toggle
                true, // fade
                dimensions, // dimensions
                false // slabs
                );
    };
    transitions.horizontalBlindFadeReverse = function($element, options, dimensions) {
        return transitions.horizontalBlindFade($element, options,
                true, // reverse
                dimensions // dimensions
                );
    };
    transitions.verticalBlindFade = function($element, options, reverse, dimensions) {
        return transitions.vBars(
                $element,
                options,
                false, // direction
                false, // order
                reverse, // reverse
                false, // toggle
                true, // fade
                dimensions, // dimensions
                false // slabs
                );
    };
    transitions.verticalBlindFadeReverse = function($element, options, dimensions) {
        return transitions.verticalBlindFade($element, options,
                true, // reverse
                dimensions // dimensions
                );
    };
    transitions.horizontalBars = function($element, options, right, reverse, fade, dimensions) {
        // $element, options, direction, order, reverse, toggle, fade, dimensions, slabs
        return transitions.hBars($element, options,
                right ? 2 : 1, //: (direction === 2) ? 2 : true,
                false, //: order,
                reverse, //: reverse,
                false, //: toggle,
                fade, //: fade,
                dimensions //: dimensions
                );
    };
    transitions.horizontalBarsReverse = function($element, options, right, fade, dimensions) {
        return transitions.horizontalBars($element, options, right, true, fade, dimensions);
    };
    transitions.horizontalBarsLeft = function($element, options, reverse, fade, dimensions) {
        return transitions.horizontalBars($element, options, false, reverse, fade, dimensions);
    };
    transitions.horizontalBarsLeftReverse = function($element, options, fade, dimensions) {
        return transitions.horizontalBarsReverse($element, options, false, fade, dimensions);
    };
    transitions.horizontalBarsRight = function($element, options, reverse, fade, dimensions) {
        return transitions.horizontalBars($element, options, true, reverse, fade, dimensions);
    };
    transitions.horizontalBarsRightReverse = function($element, options, fade, dimensions) {
        return transitions.horizontalBarsReverse($element, options, true, fade, dimensions);
    };

    transitions.hBars = function($element, options, direction, order, reverse, toggle, fade, dimensions, slabs) {
        var hBars = options.rows * 2,
                h = options.height / hBars,
                factor = 0,
                $elements = createHBars($element, order ? options.previousImage : options.src, options, {
                    opacity: order ? 1 : 0,
                    zIndex: order ? 2 : 1
                }),
        cssFrom = {opacity: 1},
        cssTo = {opacity: 1};

        if (order) {
            fi(options.src).prependTo($element);
        }

        if (reverse) {
            $elements = reverseArray.call($elements);
        }

        if (dimensions) {
            cssFrom.height = 0;
            cssTo.height = Math.ceil(h);
        }

        if (fade) {
            cssFrom.opacity = 0;
        }

        if (direction) {
            cssFrom.marginLeft = (direction === 1) ? options.width : -options.width;
            cssTo.marginLeft = 0;
        }

        if (direction && toggle && index % 2) {
            cssFrom.marginLeft = -cssFrom.marginLeft;
        }

        if (order) {
            // Hide elements instead of show elements
            var temp = -cssFrom.marginLeft;

            cssFrom.marginLeft = -cssTo.marginLeft;
            cssTo.marginLeft = temp;

            temp = cssFrom.height;

            cssFrom.height = cssTo.height;
            cssTo.height = temp;

            temp = cssFrom.opacity;

            cssFrom.opacity = cssTo.opacity;
            // Leave opacity if it's the only visible effect...
            cssTo.opacity = (direction || dimensions) ? temp : 0;
        }

        $elements.each(function(index, element) {
            if (direction && toggle && index % 2) {
                cssFrom.marginLeft = -cssFrom.marginLeft;
            }

            setTimeout(function() {
                $(element).css(cssFrom).animate(cssTo,
                        options.animationSpeed,
                        function() {
                            if (index === $elements.length - 1) {
                                animationComplete($element, options);
                            }
                        });
            }, factor * 1.5);
            factor += options.timeFactor;
        });
    };
    transitions.vBars = function($element, options, direction, order, reverse, toggle, fade, dimensions) {
        var vBars = options.cols * 2,
                w = options.width / vBars,
                factor = 0,
                $elements = createVBars($element, order ? options.previousImage : options.src, options);

        if (order) {
            $elements.css({opacity: 1, zIndex: 2});
            fi(options.src).prependTo($element);
        }

        if (reverse) {
            $elements = reverseArray.call($elements);
        }

        $elements.each(function(index, element) {
            var marginFrom = direction ? ((direction === 1) ? options.height : -options.height) : 0,
                    marginTo = 0,
                    widthFrom = dimensions ? 0 : Math.ceil(w),
                    widthTo = Math.ceil(w),
                    opacityFrom = fade ? 0 : 1,
                    opacityTo = 1,
                    cssFrom,
                    cssTo;


            if (toggle && index % 2) {
                marginFrom = -marginFrom;
            }

            if (order) {
                // Hide elements instead of show elements
                var temp = -marginFrom;

                marginFrom = -marginTo;
                marginTo = temp;

                temp = widthFrom;

                widthFrom = widthTo;
                widthTo = temp;

                temp = opacityFrom;

                opacityFrom = opacityTo;
                opacityTo = (direction || dimensions) ? temp : 0;
            }

            cssFrom = {
                marginTop: marginFrom,
                width: widthFrom,
                opacity: opacityFrom
            };
            cssTo = {
                marginTop: marginTo,
                width: widthTo,
                opacity: opacityTo
            };
            setTimeout(function() {
                $(element).css(cssFrom).animate(cssTo,
                        options.animationSpeed,
                        function() {
                            if (index === $elements.length - 1) {
                                animationComplete($element, options);
                            }
                        });
            }, factor * 1.5);
            factor += options.timeFactor;
        });
    };
    transitions.mixBars = function($element, options) {
        return transitions.vBars($element, options, 2, false, false, true);
    };
    transitions.mixBarsFancy = function($element, options) {
        var $elements = createVBars($element, options.src, options),
                factor = 0,
                i;

        for (i = 0; i < options.cols; i++) {
            setTimeout(function(index) {
                $elements.eq(index).css({marginTop: options.height}).animate({marginTop: 0, opacity: 1}, options.animationSpeed);
                $elements.eq(index + 1).css({marginTop: -options.height}).animate({marginTop: 0, opacity: 1}, options.animationSpeed, function() {
                    if (index === options.cols - 2)
                        animationComplete($element, options);
                });
            }(i * 2), factor * 1.5);
            factor += options.timeFactor;
        }
    };
    transitions.barsDown = function($element, options) {
        return transitions.vBars($element, options, 2);
    };
    transitions.barsDownReverse = function($element, options) {
        return transitions.vBars($element, options, 2, true);
    };
    transitions.barsUp = function($element, options) {
        return transitions.vBars($element, options, 1);
    };
    transitions.explode = function($element, options, fancy) {
        var factor = 0,
                w = options.width / options.cols,
                h = options.height / options.rows,
                $elements = createBoxes($element, options.src, options).css({
            left: (options.width - w) / 2,
            top: (options.height - h) / 2,
            width: fancy ? 0 : Math.ceil(w),
            height: fancy ? 0 : Math.ceil(h)
        });

        function _explode(index, element) {
            $(element).animate({
                left: options.coordinates[index].left,
                top: options.coordinates[index].top,
                opacity: 1,
                width: Math.ceil(w),
                height: Math.ceil(h)
            },
            options.animationSpeed * 2,
                    function() {
                        if (index === $elements.length - 1) {
                            animationComplete($element, options);
                        }
                    }
            );
            factor += options.timeFactor;
        }
        ;

        if (fancy) {
            $elements.each(function(index, element) {
                setTimeout(function() {
                    _explode(index, element);
                }, factor * 2);
                factor += options.timeFactor;
            });
        } else {
            $elements.each(function(index, element) {
                _explode(index, element);
            });
        }
    };
    transitions.explodeFancy = function($element, options) {
        return transitions.explode($element, options, true);
    };
    transitions.fade = function($element, options, reverse) {
        el(options.src, {
            zIndex: 100,
            opacity: 0,
            width: options.width,
            height: options.height
        }).appendTo($element).animate({opacity: 1},
        options.animationSpeed * 2, function() {
            animationComplete($element, options);
        }
        );
    };
    transitions.slideInFancy = function($element, options) {
        var hBars = options.rows * 2,
                h = options.height / hBars,
                factor = 0,
                timeFactor = options.animationSpeed / hBars;

        //reconsider this condition
        if (options.cols - options.rows >= options.cols / 2) {
            hBars += options.rows;
        }
        for (var i = 0; i < hBars; i++) {
            (function(index) {
                var element = $('<div/>').css({
                    width: options.width,
                    height: Math.ceil(h),
                    marginLeft: (i % 2 === 0) ? -options.width : options.width,
                    top: i * h,
                    position: 'absolute',
                    backgroundImage: 'url(' + options.src + ')',
                    backgroundPosition: '0px ' + (-i * h) + 'px',
                    opacity: 0
                }).addClass('transitions-el').appendTo($element);

                setTimeout(function() {
                    element.animate({marginLeft: 0, opacity: 1}, options.animationSpeed, function() {
                        if (index === hBars - 1) {
                            animationComplete($element, options);
                        }
                    });
                }, factor * 2);
                factor += timeFactor;
            })(i);
        }
    };
    transitions.chop = function($element, options, right, dimensions, diagonal, reverse, toggle) {
        return transitions.hBars($element, options, right ? 2 : 1, true, reverse, toggle, false, dimensions, false);
    };
    transitions.chopDimensions = function($element, options) {
        return transitions.chop($element, options, (Math.random() > 0.5), true);
    };
//        transitions.chopDiagonal = function($element, options) {
//            return transitions.chop($element, options, false, true, false);
//        };
//        transitions.chopDiagonalReverse = function($element, options) {
//            return transitions.chop($element, options, false, false, true);
//        };
    transitions.slide = function($element, options, direction) {
        var leftFrom = 0,
                topFrom = 0,
                leftTo = 0,
                topTo = 0;

        switch (direction) {
            case "up":
                topFrom = options.height;
                topTo = '-=' + options.height;
                break;
            case "right":
                leftFrom = -options.width;
                leftTo = '+=' + options.width;
                break;
            case "down":
                topFrom = -options.height;
                topTo = '+=' + options.height;
                break;
            default:
                leftFrom = options.width;
                leftTo = '-=' + options.width;
                break;
        }

        el(options.src, {
            width: options.width,
            height: options.height,
            left: leftFrom,
            top: topFrom,
            zIndex: 100,
            opacity: 1
        }).appendTo($element);

        el(options.previousImage, {
            width: options.width,
            height: options.height,
            left: 0,
            top: 0,
            zIndex: 100,
            opacity: 1
        }).appendTo($element);

        $('.transitions-el', $element).each(function(index, element) {
            $(element).animate({
                left: leftTo,
                top: topTo,
                opacity: 1
            },
            options.animationSpeed,
                    function() {
                        if (index === 1)
                            animationComplete($element, options);
                    });
        });
    };
    transitions.slideLeft = function($element, options) {
        transitions.slide($element, options, 'left');
    };
    transitions.slideRight = function($element, options) {
        return transitions.slide($element, options, 'right');
    };
    transitions.slideDown = function($element, options) {
        return transitions.slide($element, options, 'down');
    };
    transitions.slideUp = function($element, options) {
        return transitions.slide($element, options, 'up');
    };
    window.Transitions = function(options) {
        var defaultOptions = {
            effect: null,
            animationSpeed: 500,
            rows: 6,
            cols: 12,
            previousImage: null,
            coordinates: new Array(),
            timeFactor: 0,
            circles: 10,
            direction: 'backward', //for reverse peal animation
            minCircumference: 0,
            currentRow: 0,
            width: 0,
            height: 0,
            previousImageWidth: null,
            previousImageHeight: null
        };

        return {
            _: function($element, options) {
                $('<img/>').attr('src', options.src).load(function() {
                    var _options = $.extend({},
                            defaultOptions,
                            options,
                            {
                                previousImageWidth: options.originalWidth,
                                previousImageHeight: options.originalHeight,
                                originalWidth: this.width,
                                originalHeight: this.height,
                                width: options.width ? options.width : this.width,
                                height: options.height ? options.height : this.height,
                                currentRow: 0
                            });

                    if (!_options.effect) {
                        var _transitions = Object.keys(transitions);
                        _options.effect = _transitions[Math.floor(Math.random() * _transitions.length)];
                    }

                    $element.css({
                        width: _options.width,
                        height: _options.height,
                        position: 'relative',
                        overflow: 'hidden'
                    });

                    transitions[_options.effect]($element, _options);
                });
            }
        };
    };

    Transitions.transitions = function() {
        return transitions;
    }

})(jQuery);