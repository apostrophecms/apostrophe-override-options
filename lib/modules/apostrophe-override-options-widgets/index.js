var _ = require('lodash');

module.exports = {
  
  improve: 'apostrophe-widgets',
  
  construct: function(self, options) {
    
    var superGetOption = self.getOption;
    
    self.getOption = function(req, dotPathOrArray, def) {
      var overrideOptions = self.apos.modules['apostrophe-override-options'];
      var editable, field, value, path;
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

      editable = self.options.overrideOptions && self.options.overrideOptions.editable;
      if (editable) {
        var value = overrideOptions.getNewOptionValue(req, (req.aposOptions && req.aposOptions[self.__meta.name]) || {}, path, overrideOptions.getEditableFieldValue(req.aposRenderingWidget, dotPathOrArray));
        if (value || (value === 0)) {
          return value;
        }
      }
      if (req.aposRenderingWidgetOptions) {
        var value = _.get(req.aposRenderingWidgetOptions, path);
        if (value !== undefined) {
          return value;
        }
      }
      if (field) {
        value = req.aposRenderingWidget[field];
        if (value || (value === 0)) {
          return 
        }
      }
      return superGetOption(req, dotPathOrArray, def);
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
