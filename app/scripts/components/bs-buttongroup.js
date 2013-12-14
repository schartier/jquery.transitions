(function($) {
    ///////// Bootstrap Button

    /**
     * Consider:
     *
     *   item: {label: "This is a label", value: "Item value"}
     *   boundVariable: A variable to hold the value selected from the group.
     *
     * Usage exemple:
     *
     *   {{#bs-button item=item value=boundVariable}}Allo{{/bs-button}}
     *
     * Result:
     *
     *   <button type="button" {{bind-attr class=":btn :btn-default isActive:active"}}>{{item.label}}</button>
     */
    Ember.BsButton = Ember.View.extend({
        // When a view is composed of a single tag, specify the tag name as follow
        tagName: 'button',
        // Default "type" tag attribute value
        type: 'button',
        // Classes to include in this tag
        classNames: ['btn', 'btn-default'],
        // Dynamic class name bindings
        classNameBindings: ['isActive:active'],
        // These attributes will be automatically transposed to the current tag
        attributeBindings: ['type', 'value'],
        // Item is passed in the ember tag
        item: null,
        // Computed property used to determine if we add the "active" class to the tag
        isActive: function() {
            var item = this.get('item'),
                    value = this.get('value');

            return item.value === value;
        }.property('value'),
        // Click event handler
        click: function() {
            // update the value binding
            var item = this.get('item');
            this.set('value', item.value);
        }
    });
    // Allow the use of {{bs-button ...}} tag inside templates
    Ember.Handlebars.registerHelper('bs-button', function(options) {
        Ember.assert('You can only pass attributes to the `radiobutton` helper, not arguments', arguments.length < 2);
        return Ember.Handlebars.helpers.view.call(this, Ember.BsButton, options);
    });

    ///////// Bootstrap button group

    /**
     * Consider:
     *
     *   boundVariable: A variable to hold the value selected from the group.
     *   options: [
     *    {label: 'option 1', value: 'option_1'}
     *    {label: 'option 2', value: 'option_2'}
     *    {label: 'option 3', value: 'option_3'}
     *   ]
     *
     * Usage example:
     *
     *   {{bs-buttongroup items=options value=boundVariable}}
     *
     *
     * When a button from the group is clicked, the boundVariable will take the
     * according value.
     */
    Ember.BsButtongroup = Ember.View.extend({
        templateName: 'bs-buttongroup',
        items: null,
        valueBinding: null
    });
    // Allow the use of {{bs-buttongroup ...}} tag inside templates
    Ember.Handlebars.registerHelper('bs-buttongroup', function(options) {
        Ember.assert('You can only pass attributes to the `radiobutton` helper, not arguments', arguments.length < 2);
        return Ember.Handlebars.helpers.view.call(this, Ember.BsButtongroup, options);
    });
})(jQuery);