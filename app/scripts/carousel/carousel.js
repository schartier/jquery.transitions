(function($) {
    var attr = DS.attr;

    /**
     * Model for the carousel with a minimum of informations required to display
     * the carousel. We want to reuse the carousel on the customer websites without
     * modifications.
     *
     * Inside the template, fields from the view's model are accessible directly.
     *
     * Ex:
     * {{params.navType}}
     *
     * {{#each image in images}}
     *   {{image.url}}
     * {{/each}}
     */
    App.DkCarouselModel = DS.Model.extend({
        params: attr(),
        images: attr()
    });

    /**
     * View for the carousel. Should also provide minimal functionnalities to
     * display the carousel on the customers websites.
     *
     * Since the templates are rendered after the window "load" event. Manipulations
     * that you would normally have inserted inside the load event should be done
     * inside the didInsertElement callback.
     *
     * Other events are also available:
     *
     *  - didInsertElement
     *  - parentViewDidChange
     *  - willClearRender
     *  - willDestroyElement
     *  - willInsertElement
     */
    App.DkCarouselView = Ember.View.extend({
        templateName: 'dk-carousel',
        didInsertElement: function() {
            this._super();
            // Create the "dkarousel-slider"
            this.$('.dkarousel-slider.original').dkarousel(this.get('params'));
        },
        willDestroyElement: function() {
            this._super();
            // Destroy the "dkarousel-slider"

            var $element = this.$('.dkarousel-slider.original');
            if ($element.length && $element[0].dkarousel) {
                $element[0].dkarousel.destroy();
            }
        }
    });
})(jQuery);
