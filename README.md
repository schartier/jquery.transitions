jquery.transitions
==================

Images transitions collection using jQuery

Available options:

```javascript
            effects: {
                    // See jquery.transitions.js effects for the list of available effects
                    options: Object.keys(Transitions.effects())
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
                        {label: '<i class="icon-bullet-metrostation-on"></i>', value: 'bullet-metrostation'}]
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
```