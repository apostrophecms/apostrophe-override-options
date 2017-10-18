var _ = require('lodash');

module.exports = {

  moogBundle: {
    modules: [ 'apostrophe-option-overrides-module', 'apostrophe-option-overrides-pages' ],
    directory: 'lib/modules'
  },

  construct: function(self, options) {
    
    // Populates `req.aposOptions` with a version of
    // the options object for each module that has been
    // overridden by settings related to the current page,
    // per the documentation of this module. Invoked by
    // an override of `apos.pages.pageServe`
    self.calculateOverrides = function(req) {

      req.aposOptions = {};
      var workflow = self.apos.modules['apostrophe-workflow'];

      _.each(self.apos.modules, function(module, name) {
        // This is not a deep clone. Deep cloning is used
        // in overrideKey below for the primaries (top level options)
        // that are altered. This leaves options.apos alone,
        // for instance, and potentially other expensive/large
        // objects as well
        req.aposOptions[name] = _.cloneWith(module.options, cloneCustom);
        req.aposOptions[name].__clonedPrimaries = {};
        if (workflow) {
          var locale = workflow.liveify(locale);
          _.each((module.options.localized  && module.options.localized[locale]) || {}, function(val, key) {
            self.overrideKey(req, key, val);
          });
        }
      });

      self.applyOverridesFromDoc(req, req.data.global || {});
      var ancestors = (req.data.bestPage && req.data.bestPage._ancestors) || [];
      if (req.data.bestPage) {
        ancestors.push(req.data.bestPage);
      }
      _.each(ancestors, function(ancestor) {
        self.applyOverridesFromDoc(req, ancestor);
      });
    };
    
    self.overrideKey = function(req, key, val) {
      var path = key.split(/\./);
      var primary;
      if (path[0] !== 'apos') {
        return callback(new Error('Key for fixed override must start with apos. and an instantiated module name or alias'));
      }
      var module = self.apos.modules[path[1]];
      if (!module) {
        module = apos[path[1]];
        if (module.alias !== path[1]) {
          // Something sneaky is going on
          return callback(new Error('Key for fixed override must start with apos. and an instantiated existing module name or alias'));
        }
      }
      if (!module) {
        return callback(new Error('Key for fixed override must start with apos. and an instantiated module name or alias'));
      }
      primary = path[2];
      if (primary === 'apos') {
        // Cloning it deeply would be prohibitively expensive
        return callback(new Error('Option overrides may not alter the apos object passed to a module'));
      }
      var name = module.__meta.name;
      if (!req.aposOptions[name].__clonedPrimaries[primary]) {
        req.aposOptions[name][primary] = _.cloneDeepWith(req.aposOptions[module.__meta.name][primary], cloneCustom);
        req.aposOptions[name].__clonedPrimaries[primary] = true;
      }
      _.set(req.aposOptions[module.__meta.name], path.slice(2), val);        
    };
    
    // Apply option overrides based on a particular document's
    // type and settings, per the `overrideOptions` configuration
    // of its manager module or, if provided, the module passed
    // as `optionsSource`.
    
    self.applyOverridesFromDoc = function(req, doc, optionsSource) {
      var manager;
      if (!optionsSource) {
        optionsSource = self.apos.docs.getManager(doc.type);
      }
      if (!optionsSource) {
        return;
      }
      if (!optionsSource.options.overrideOptions) {
        return;
      }
      var overrideOptions = optionsSource.options.overrideOptions;
      var fixed = overrideOptions.fixed;
      var localized = overrideOptions.localized;
      var editable = overrideOptions.editable;
      var workflow = self.apos.modules['apostrophe-workflow'];
      _.each(fixed || {}, function(val, key) {
        self.overrideKey(req, key, val);
      });
      if (workflow) {
        _.each((localized && localized[workflow.liveify(req.locale)]) || {}, function(val, key) {
          self.overrideKey(req, key, val);
        });
      }
      _.each(editable || {}, function(field, key) {
        var val = doc[field];
        if (val || (val !== '0')) {
          self.overrideKey(req, key, val);
        }
      });
    };
    
    // Make sure cloned options still include functions.
    // _.clone handles most other types well.

    function cloneCustom(item) {
      if (typeof(item) === 'function') {
        return item;
      }
    }

  }
};
