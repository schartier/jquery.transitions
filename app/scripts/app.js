(function($) {
    // Create the new application
    var App = window.App = Ember.Application.create();

    // Skipping... Ember data!
    App.Store = DS.Store.extend();
    App.ApplicationAdapter = DS.FixtureAdapter;

    // Application router
    App.Router.map(function() {
        this.resource("transitions");
    });

    App.ApplicationRoute = Ember.Route.extend({
        beforeModel: function() {
            this.transitionTo('transitions')
        }
    });

    /* Order and include as you please. */
    require('scripts/transitions/*');

})(jQuery);