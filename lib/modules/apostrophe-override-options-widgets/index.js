var _ = require('lodash');

module.exports = {

  improve: 'apostrophe-widgets',

  construct: function(self, options) {

    var superGetOption = self.getOption;

    self.getOption = function(req, dotPathOrArray, def) {
      var overrideOptions = self.apos.modules['apostrophe-override-options'];
      var path;
      if ((!req.aposRenderingWidget) || (req.aposRenderingWidget.type !== self.name)) {
        return superGetOption(req, dotPathOrArray, def);
      }

      if (!Array.isArray(dotPathOrArray)) {
        path = dotPathOrArray.split('.');
      } else {
        path = dotPathOrArray;
      }
      // If the path refers to a module and it's not this module, it's not our business
      if (
        (path[0] === 'apos') &&
        (
          (path[1] !== self.__meta.name) &&
          (!(self.options.alias && path[1] === self.options.alias))
        )
      ) {
        return superGetOption(req, dotPathOrArray, def);
      }

      // If the path refers to this module explicitly, skip that part
      if (path[0] === 'apos') {
        path = path.slice(2);
      }

      // Start with a shallow clone, let the cloned primaries mechanism
      // reduce inefficiency relative to a deep clone
      var outerOptions = (req.aposOptions && req.aposOptions[self.__meta.name]) || {};
      var options = _.cloneWith(outerOptions, cloneCustom);
      options.__clonedPrimaries = {};
      req.aposOptions = req.aposOptions || {};
      req.aposOptions[self.__meta.name] = options;
      // Now we can apply overrides from the widget via `editable`
      // as if it were any other doc, but pop back to the original
      // options afterwards
      overrideOptions.applyOverridesFromDoc(req, req.aposRenderingWidget, self);
      // Options passed to the template win in their entirety
      _.assign(options, req.aposRenderingWidgetOptions);
      req.aposOptions[self.__meta.name] = outerOptions;
      return _.get(options, dotPathOrArray, def);

      // Make sure cloned options still include functions.
      // _.clone handles most other types well.

      function cloneCustom(item) {
        if (typeof (item) === 'function') {
          return item;
        }
      }

    };

    // Set `req.aposRenderingWidget` and `req.aposRenderingWidgetOptions`
    // for the duration of a call to the widget's `output` method,
    // so they can be consulted to influence `getOptions`. Push and pop
    // any value already present from an outer widget so `getOptions`
    // continues to work after a subwidget is rendered.

    var superOutput = self.output;
    self.output = function(widget, options) {
      var req = self.apos.templates.contextReq;
      var oldAposRenderingWidget = req.aposRenderingWidget;
      var oldAposRenderingWidgetOptions = req.aposRenderingWidgetOptions;
      req.aposRenderingWidget = widget;
      req.aposRenderingWidgetOptions = options;
      var result = superOutput(widget, options);
      req.aposRenderingWidget = oldAposRenderingWidget;
      req.aposRenderingWidgetOptions = oldAposRenderingWidgetOptions;
      return result;
    };
  }
};
