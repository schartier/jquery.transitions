(function($) {

    function getLabel(array, value) {
        var i;

        for(i=0; i<array.length; i++) {
            var item = array[i];
            if (item.value == value) {
                return item.label ? item.label : item.value;
            }
        }
    }

    Ember.BsDropdown = Ember.View.extend({
        templateName: 'bs-dropdown',
//        template: Ember.Handlebars.template(function anonymous(Handlebars, depth0, helpers, partials, data) {
//            this.compilerInfo = [4, '>= 1.0.0'];
//            helpers = this.merge(helpers, Ember.Handlebars.helpers);
//            data = data || {};
//            var buffer = '', stack1, hashTypes, hashContexts, escapeExpression = this.escapeExpression, self = this;
//            function program1(depth0, data) {
//                var buffer = '', hashTypes, hashContexts;
//                data.buffer.push("\r\n        <li><span ");
//                hashTypes = {};
//                hashContexts = {};
//                data.buffer.push(escapeExpression(helpers.action.call(depth0, "updateValue", "item", {hash: {}, contexts: [depth0, depth0], types: ["STRING", "ID"], hashContexts: hashContexts, hashTypes: hashTypes, data: data})));
//                data.buffer.push(">");
//                hashTypes = {};
//                hashContexts = {};
//                data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "item.label", {hash: {}, contexts: [depth0], types: ["ID"], hashContexts: hashContexts, hashTypes: hashTypes, data: data})));
//                data.buffer.push("</span></li>\r\n        ");
//                return buffer;
//            }
//
//            data.buffer.push("<div class=\"btn-group\">\r\n    <button type=\"button\" class=\"btn btn-default dropdown-toggle\" data-toggle=\"dropdown\">\r\n        ");
//            hashTypes = {};
//            hashContexts = {};
//            data.buffer.push(escapeExpression(helpers._triageMustache.call(depth0, "view.label", {hash: {}, contexts: [depth0], types: ["ID"], hashContexts: hashContexts, hashTypes: hashTypes, data: data})));
//            data.buffer.push(" <span class=\"caret\"></span>\r\n    </button>\r\n    <ul class=\"dropdown-menu\" role=\"menu\">\r\n        ");
//            hashTypes = {};
//            hashContexts = {};
//            stack1 = helpers.each.call(depth0, "item", "in", "view.items", {hash: {}, inverse: self.noop, fn: self.program(1, program1, data), contexts: [depth0, depth0, depth0], types: ["ID", "ID", "ID"], hashContexts: hashContexts, hashTypes: hashTypes, data: data});
//            if (stack1 || stack1 === 0) {
//                data.buffer.push(stack1);
//            }
//            data.buffer.push("\r\n    </ul>\r\n</div>");
//            return buffer;
//
//        }),
        label: '',
        items: null,
        valueBinding: null,
        init: function() {
            this._super();
            this.set('label', getLabel(this.get('items'), this.get('value')));
        },
        didInsertElement: function() {
            this.$('.dropdown-toggle').dropdown();
        },
        actions: {
            updateValue: function(item) {
                this.set('value', item.value);
                this.toggle();
            }
        },
        toggle: function() {
            this.$('.dropdown-toggle').dropdown('toggle');
        },
        updateLabel: function() {
            this.set('label', getLabel(this.get('items'), this.get('value')));
        }.observes('value')
    });
    Ember.Handlebars.registerHelper('bs-dropdown', function(options) {
        Ember.assert('You can only pass attributes to the `radiobutton` helper, not arguments', arguments.length < 2);
        return Ember.Handlebars.helpers.view.call(this, Ember.BsDropdown, options);
    });
})(jQuery);