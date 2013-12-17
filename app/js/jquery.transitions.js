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
        var index = options.circles - i,
            op = 1 - (index + 1) / 10;

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
//    function swapDirection(index, options) {
//        if (index % options.cols === 0) {
//            options.currentRow++;
//            options.direction = !options.direction;
//        }
//    }
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

    /**
     * params: random, dimensions, fade, reverse, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function boxes ($element, options, params) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                noOfBoxes = options.rows * options.cols,
                $elements = createBoxes($element, options.src, options),
                factor = 0,
                cssFrom = {opacity: 1},
                cssTo = {opacity: 1};

        if (params.random) {
            $elements.sort(function(a, b) {
                return Math.random() - 0.5;
            });
        } else if (params.reverse) {
            $elements = reverseArray.call($elements);
        }

        if (params.dimensions) {
            cssFrom.width = 0;
            cssFrom.height = 0;
            cssTo.width = Math.ceil(w);
            cssTo.height = Math.ceil(h);
        } else {
            params.fade = true;
        }

        if (params.fade) {
            cssFrom.opacity = 0;
        }

        $elements.css(cssFrom);
        $elements.each(function(index, element) {
            setTimeout(function() {
                $(element).animate(cssTo,
                        options.animationSpeed,
                        options.easing,
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
    transitions.boxFade = function($element, options, reverse, easing) {
        return boxes($element, options, {
            fade: true
        });
    };
    transitions.boxFadeRandom = function($element, options, easing) {
        return boxes($element, options, {
            random: true,
            fade: true,
            easing: easing
        });
    };
    transitions.boxFadeReverse = function($element, options, easing) {
        return boxes($element, options, {
            fade: true,
            reverse: true
        });
    };
    transitions.boxDimensions = function($element, options, easing) {
        return boxes($element, options, {
            dimensions: true,
            easing: easing
        });
    };
    transitions.boxDimensionsRandom = function($element, options, easing) {
        return boxes($element, options, {
            random: true,
            dimensions: true,
            easing: easing
        });
    };
    transitions.boxDimensionsReverse = function($element, options, easing) {
        return boxes($element, options, {
            dimensions: true,
            reverse: true,
            easing: easing
        });
    };

    /**
     * params: dimensions, fade, reverse, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function spiral ($element, options, params) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                $elements = createBoxes($element, options.src, options),
                factor = 0,
                cssFrom = {opacity: 1},
        cssTo = {opacity: 1},
        indeces;

        if (params.reverse) {
            $elements = reverseArray.call($elements);
        }

        if (params.dimensions) {
            cssFrom.width = 0;
            cssFrom.height = 0;
            cssTo.width = Math.ceil(w);
            cssTo.height = Math.ceil(h);
        } else {
            params.fade = true;
        }

        if (params.fade) {
            cssFrom.opacity = 0;
        }

        $elements.css(cssFrom);

        indeces = spiralify(options.cols, options.rows);
        if (params.reverse)
            indeces = reverseArray.call(indeces);

        for (var i = 0; i < indeces.length; i++) {
            (function(index) {
                setTimeout(function() {
                    $elements.eq(indeces[index]).animate(cssTo,
                            options.animationSpeed / 2,
                            options.easing,
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
    transitions.spiralFade = function($element, options, easing) {
        return spiral($element, options, {
            fade: true,
            easing: easing
        });
    };
    transitions.spiralFadeReverse = function($element, options, easing) {
        return spiral($element, options, {
            fade: true,
            reverse: true,
            easing: easing
        });
    };
    transitions.spiralDimensions = function($element, options, easing) {
        return spiral($element, options, {
            dimensions: true,
            easing: easing
        });
    };
    transitions.spiralDimensionsReverse = function($element, options, easing) {
        return spiral($element, options, {
            dimensions: true,
            reverse: true,
            easing: easing
        });
    };

    /**
     * params: out, rotate, toggle, swirl, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function radial ($element, options, params) {
        var $elements = createCircles($element, params.out ? options.previousImage : options.src, options, {
            opacity: params.out ? 1 : 0
        });

        if (!params.swirl) {
            $elements.css({borderRadius: 0});
        }

        if (params.out) {
            $elements = reverseArray.call($elements);
            fi(options.src).prependTo($element);
        }

        var degree = 20;
        $elements.each(function(index, element) {
            degree += 5;

            var cssTo = {
                opacity: params.out ? 0 : 1,
                rotation: params.rotate ? 360 : 0
            };

            if (params.rotate && params.toggle && index % 2) {
                cssTo.rotation = -cssTo.rotation;
            }

            setTimeout(function() {
                $(element).animate(cssTo, {
                    duration: options.animationSpeed,
                    easing: options.easing,
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
    transitions.squareFadeOut = function($element, options, rotate, toggle, easing) {
        return radial($element, options, {
            out: true,
            easing: easing
        });
    };
    transitions.squareFadeOutRotate = function($element, options, toggle, easing) {
        return radial($element, options, {
            out: true,
            rotate: true
        });
    };
    transitions.squareFadeOutRotateFancy = function($element, options, easing) {
        return radial($element, options, {
            out: true,
            rotate: true,
            toggle: true
        });
    };
    transitions.squareFadeIn = function($element, options, rotate, toggle, easing) {
        return radial($element, options, {
            easing: easing
        });
    };
    transitions.squareFadeInRotate = function($element, options, toggle, easing) {
        return radial($element, options, {
            rotate: true
        });
    };
    transitions.squareFadeInRotateFancy = function($element, options, easing) {
        return radial($element, options, {
            rotate: true,
            toggle: true
        });
    };
    transitions.circleFadeOut = function($element, options, rotate, toggle, easing) {
        return radial($element, options, {
            swirl: true,
            out: true,
            easing: easing
        });
    };
    transitions.circleFadeOutRotate = function($element, options, toggle, easing) {
        return radial($element, options, {
            swirl: true,
            out: true,
            rotate: true
        });
    };
    transitions.circleFadeOutRotateFancy = function($element, options, easing) {
        return radial($element, options, {
            swirl: true,
            out: true,
            rotate: true,
            toggle: true
        });
    };
    transitions.circleFadeIn = function($element, options, rotate, toggle, easing) {
        return radial($element, options, {
            swirl: true,
            easing: easing
        });
    };
    transitions.circleFadeInRotate = function($element, options, toggle, easing) {
        return radial($element, options, {
            swirl: true,
            rotate: true
        });
    };
    transitions.circleFadeInRotateFancy = function($element, options, easing) {
        return radial($element, options, {
            swirl: true,
            rotate: true,
            toggle: true
        });
    };
    /**
     * params: reverse, dimensions, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function diagonalFade ($element, options, params) {
        var w = options.width / options.cols,
                h = options.height / options.rows,
                factor = 0,
                noOfDiagonals = options.rows + options.cols - 1,
                complete = 0,
                $elements = createBoxes($element, options.src, options).css({
            width: params.dimensions ? 0 : Math.ceil(w),
            height: params.dimensions ? 0 : Math.ceil(h),
            opacity: params.dimensions ? 1 : 0
        });

        var diagonal = new Array();
        for (var i = 0; i < noOfDiagonals; i++) {
            diagonal.push(i);
            diagonal[i] = new Array();
            for (var j = Math.min(options.rows, i + 1) - 1; j >= Math.max(0, i - options.cols + 1); j--) {
                diagonal[i].push((j * options.cols) + i - j);
            }
        }

        if (params.reverse)
            diagonal.reverse();

        $(diagonal).each(function(index, elements) {
            setTimeout(function() {

                $(elements).each(function(i, val) {
                    $elements.eq(val).animate({
                        opacity: 1,
                        width: Math.ceil(w),
                        height: Math.ceil(h)
                    },
                    {
                        duration:options.animationSpeed,
                        easing: options.easing,
                        done:function() {
                            if (++complete === $elements.length) {
                                animationComplete($element, options);
                            }
                        }
                    });
                });
            }, factor * 6);
            factor += options.timeFactor;
        });
    };
    transitions.diagonalFad = function($element, options) {
        return diagonalFade($element, options);
    }
    transitions.diagonalFadeReverse = function($element, options, easing) {
        return diagonalFade($element, options, {
            reverse: true
        });
    };
    transitions.diagonalShow = function($element, options, easing) {
        return diagonalFade($element, options, {
            dimensions: true
        });
    };
    transitions.diagonalShowReverse = function($element, options, easing) {
        return diagonalFade($element, options, {
            dimensions: true,
            reverse: true
        });
    };
    /**
     * params: direction, out, reverse, toggle, fade, dimensions, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function hBars ($element, options, params) {
        var hBars = options.rows * 2,
                h = options.height / hBars,
                factor = 0,
                $elements = createHBars($element, params.out ? options.previousImage : options.src, options, {
                    opacity: params.out ? 1 : 0,
                    zIndex: params.out ? 2 : 1
                }),
                cssFrom = {opacity: 1},
                cssTo = {opacity: 1};

        if (params.out) {
            fi(options.src).prependTo($element);
        }

        if (params.reverse) {
            $elements = reverseArray.call($elements);
        }

        if (params.dimensions) {
            cssFrom.height = 0;
            cssTo.height = Math.ceil(h);
        }

        if (params.fade) {
            cssFrom.opacity = 0;
        }

        if (params.direction || params.toggle) {
            cssFrom.marginLeft = (params.direction === 'left') ? options.width : -options.width;
            cssTo.marginLeft = 0;
        }

        if (params.direction && params.toggle && params.index % 2) {
            cssFrom.marginLeft = -cssFrom.marginLeft;
        }

        if (params.out) {
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
            cssTo.opacity = (params.direction || params.dimensions) ? temp : 0;
        }

        $elements.each(function(index, element) {
            if (params.direction && params.toggle && index % 2) {
                cssFrom.marginLeft = -cssFrom.marginLeft;
            }

            setTimeout(function() {
                $(element).css(cssFrom).animate(cssTo,
                        options.animationSpeed,
                        options.easing,
                        function() {
                            if (index === $elements.length - 1) {
                                animationComplete($element, options);
                            }
                        });
            }, factor * 1.5);
            factor += options.timeFactor;
        });
    };
    transitions.horizontalBarsFadeIn = function($element, options, right, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            fade: true
        });
    };
    transitions.horizontalBarsFadeInReverse = function($element, options, right, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            fade: true,
            reverse: true
        });
    };
    transitions.horizontalBarsDimensionsIn = function($element, options, reverse, dimensions, easing) {
        return hBars($element, options, {
            dimensions: true
        });
    };
    transitions.horizontalBarsDimensionsInReverse = function($element, options, dimensions, easing) {
        return hBars($element, options, {
            dimensions: true,
            reverse: true
        });
    };
    transitions.horizontalBarsLeftIn = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            direction: 'left'
        });
    };
    transitions.horizontalBarsLeftInReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            direction: 'left',
            reverse: true
        });
    };
    transitions.horizontalBarsRightIn = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            direction: 'right'
        });
    };
    transitions.horizontalBarsRightInReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            direction: 'right',
            reverse: true
        });
    };
    transitions.horizontalBarsToggleIn = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            toggle: true,
        });
    };
    transitions.horizontalBarsToggleInReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            toggle: true,
            reverse: true
        });
    };
    transitions.horizontalBarsFadeOut = function($element, options, right, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            fade: true
        });
    };
    transitions.horizontalBarsFadeOutReverse = function($element, options, right, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            fade: true,
            reverse: true
        });
    };
    transitions.horizontalBarsDimensionsOut = function($element, options, reverse, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            dimensions: true
        });
    };
    transitions.horizontalBarsDimensionsOutReverse = function($element, options, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            dimensions: true,
            reverse: true
        });
    };
    transitions.horizontalBarsLeftOut = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            direction: 'left'
        });
    };
    transitions.horizontalBarsLeftOutReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            direction: 'left',
            reverse: true
        });
    };
    transitions.horizontalBarsRightOut = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            direction: 'right'
        });
    };
    transitions.horizontalBarsRightOutReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            direction: 'right',
            reverse: true
        });
    };
    transitions.horizontalBarsToggleOut = function($element, options, reverse, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            toggle: true
        });
    };
    transitions.horizontalBarsToggleOutReverse = function($element, options, fade, dimensions, easing) {
        return hBars($element, options, {
            out: true,
            toggle: true,
            reverse: true
        });
    };
    /**
     * params: direction, out, reverse, toggle, fade, dimensions, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function vBars ($element, options, params) {
        var vBars = options.cols * 2,
                w = options.width / vBars,
                factor = 0,
                $elements = createVBars($element, params.out ? options.previousImage : options.src, options);

        if (params.out) {
            $elements.css({opacity: 1, zIndex: 2});
            fi(options.src).prependTo($element);
        }

        if (params.reverse) {
            $elements = reverseArray.call($elements);
        }

        $elements.each(function(index, element) {
            var marginFrom = params.direction ? ((params.direction==='up') ? options.height : -options.height) : 0,
                    marginTo = 0,
                    widthFrom = params.dimensions ? 0 : Math.ceil(w),
                    widthTo = Math.ceil(w),
                    opacityFrom = params.fade ? 0 : 1,
                    opacityTo = 1,
                    cssFrom,
           cssTo;


            if (params.toggle && index % 2) {
                marginFrom = -marginFrom;
            }

            if (params.out) {
                // Hide elements instead of show elements
                var temp = -marginFrom;

                marginFrom = -marginTo;
                marginTo = temp;

                temp = widthFrom;

                widthFrom = widthTo;
                widthTo = temp;

                temp = opacityFrom;

                opacityFrom = opacityTo;
                opacityTo = (params.direction || params.dimensions) ? temp : 0;
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
                        options.easing,
                        function() {
                            if (index === $elements.length - 1) {
                                animationComplete($element, options);
                            }
                        });
            }, factor * 1.5);
            factor += options.timeFactor;
        });
    };
    transitions.verticalBarsFadeIn = function($element, options, right, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            fade: true
        });
    };
    transitions.verticalBarsFadeInReverse = function($element, options, right, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            fade: true,
            reverse: true
        });
    };
    transitions.verticalBarsDimensionsIn = function($element, options, reverse, dimensions, easing) {
        return vBars($element, options, {
            dimensions: true
        });
    };
    transitions.verticalBarsDimensionsInReverse = function($element, options, dimensions, easing) {
        return vBars($element, options, {
            dimensions: true,
            reverse: true
        });
    };
    transitions.verticalBarsLeftIn = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            direction: 'left'
        });
    };
    transitions.verticalBarsLeftInReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            direction: 'left',
            reverse: true
        });
    };
    transitions.verticalBarsRightIn = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            direction: 'right'
        });
    };
    transitions.verticalBarsRightInReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            direction: 'right',
            reverse: true
        });
    };
    transitions.verticalBarsToggleIn = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            toggle: true,
        });
    };
    transitions.verticalBarsToggleInReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            toggle: true,
            reverse: true
        });
    };
    transitions.verticalBarsFadeOut = function($element, options, right, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            fade: true
        });
    };
    transitions.verticalBarsFadeOutReverse = function($element, options, right, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            fade: true,
            reverse: true
        });
    };
    transitions.verticalBarsDimensionsOut = function($element, options, reverse, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            dimensions: true
        });
    };
    transitions.verticalBarsDimensionsOutReverse = function($element, options, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            dimensions: true,
            reverse: true
        });
    };
    transitions.verticalBarsLeftOut = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            direction: 'left'
        });
    };
    transitions.verticalBarsLeftOutReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            direction: 'left',
            reverse: true
        });
    };
    transitions.verticalBarsRightOut = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            direction: 'right'
        });
    };
    transitions.verticalBarsRightOutReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            direction: 'right',
            reverse: true
        });
    };
    transitions.verticalBarsToggleOut = function($element, options, reverse, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            toggle: true
        });
    };
    transitions.verticalBarsToggleOutReverse = function($element, options, fade, dimensions, easing) {
        return vBars($element, options, {
            out: true,
            toggle: true,
            reverse: true
        });
    };
    /**
     * params: fancy, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function explode ($element, options, params) {
        var factor = 0,
                w = options.width / options.cols,
                h = options.height / options.rows,
                $elements = createBoxes($element, options.src, options).css({
            left: (options.width - w) / 2,
            top: (options.height - h) / 2,
            width: params.fancy ? 0 : Math.ceil(w),
            height: params.fancy ? 0 : Math.ceil(h)
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
            options.easing,
                    function() {
                        if (index === $elements.length - 1) {
                            animationComplete($element, options);
                        }
                    }
            );
            factor += options.timeFactor;
        }
        ;

        if (params.fancy) {
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
    transitions.explode = function($element, options) {
        return explode($element, options, {});
    }
    transitions.explodeFancy = function($element, options) {
        return transitions.explode($element, options, {
            fancy: true
        });
    };
    /**
     * params: reverse, easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} reverse
     * @returns {undefined}
     */
    function fade ($element, options, params) {
        el(options.src, {
            zIndex: 100,
            opacity: 0,
            width: options.width,
            height: options.height
        }).appendTo($element).animate({opacity: 1},
        options.animationSpeed * 2, options.easing, function() {
            animationComplete($element, options);
        }
        );
    };
    transitions.fade = function($element, options) {
        return fade($element, options, {});
    }
    /**
     * params: easing
     *
     * @param {type} $element
     * @param {type} options
     * @param {type} params
     * @returns {undefined}
     */
    function slideInFancy ($element, options, params) {
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
                    element.animate({marginLeft: 0, opacity: 1}, options.animationSpeed, options.easing, function() {
                        if (index === hBars - 1) {
                            animationComplete($element, options);
                        }
                    });
                }, factor * 2);
                factor += timeFactor;
            })(i);
        }
    };
    transitions.slideInFancy = function($element, options){
        return slideInFancy($element, options, {});
    }
//        transitions.chopDiagonal = function($element, options) {
//            return transitions.chop($element, options, false, true, false);
//        };
//        transitions.chopDiagonalReverse = function($element, options) {
//            return transitions.chop($element, options, false, false, true);
//        };
    /**
     * params: direction, easing
     *
     * @param {type} $element
     * @param {type} options
     * @returns {undefined}
     */
    function slide ($element, options, params) {
        var leftFrom = 0,
                topFrom = 0,
                leftTo = 0,
                topTo = 0;

        switch (params.direction) {
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
            options.easing,
                    function() {
                        if (index === 1)
                            animationComplete($element, options);
                    });
        });
    };
    transitions.slideLeft = function($element, options) {
        return slide($element, options, {direction: 'left'});
    };
    transitions.slideRight = function($element, options) {
        return slide($element, options, {direction: 'right'});
    };
    transitions.slideDown = function($element, options) {
        return slide($element, options, {direction: 'down'});
    };
    transitions.slideUp = function($element, options) {
        return slide($element, options, {direction: 'up'});
    };
    window.Transitions = function(options) {
        var defaultOptions = $.extend({
            effect: null,
            animationSpeed: 500,
            rows: 6,
            cols: 12,
            previousImage: null,
            coordinates: new Array(),
            timeFactor: 0,
            circles: 10,
            direction: false, //for reverse peal animation
            minCircumference: 0,
            currentRow: 0,
            width: 0,
            height: 0,
            previousImageWidth: null,
            previousImageHeight: null,
            easing: 'easeInOutCirc'
        }, options);

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