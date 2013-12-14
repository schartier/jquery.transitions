(function($) {
    /**
     * Consider:
     *
     *   boundVariable: A variable to hold the value selected from the group.
     *
     * Usage example:
     *
     *   {{radiobutton selection=boundVariable value='test'}}
     *
     * boundVariable will take the value 'test' when the radiobutton is clicked.
     */
    Ember.RadioButton = Ember.View.extend({
        tagName: "input",
        type: "radio",
        attributeBindings: ["name", "type", "value", "checked:checked:"],
        click: function() {
            this.set("selection", this.$().val())
        },
        // Computed property to determine if the tag should be checked or not.
        checked: function() {
            // Reproduce the radio button behavior and set the tag to checked
            // when the bound variable value equals this button value.
            return this.get("value") === this.get("selection");
        }.property()
    });
    // Allow the use of {{radiobutton ...}} tag inside templates
    Ember.Handlebars.registerHelper('radiobutton', function(options) {
        Ember.assert('You can only pass attributes to the `radiobutton` helper, not arguments', arguments.length < 2);
        return Ember.Handlebars.helpers.view.call(this, Ember.RadioButton, options);
    });
})(jQuery);