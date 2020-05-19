var _ = require('lodash');

module.exports = {

  moogBundle: {
    modules: [
      'apostrophe-override-options-module',
      'apostrophe-override-options-pages',
      'apostrophe-override-options-doc-type-manager',
      'apostrophe-override-options-pieces-pages',
      'apostrophe-override-options-widgets'
    ],
    directory: 'lib/modules'
  },

  construct: function(self, options) {

    self.modulesReady = function() {
      self.compileLocaleTree();
    };

    // Populates `req.aposOptions` with a version of
    // the options object for each module that has been
    // overridden by settings related to the current page,
    // per the documentation of this module. Invoked
    // as soon as possible by an override of
    // `apos.pages.serveLoaders` and also in certain
    // other contexts such as routes relating to the
    // editing of page settings.

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
          var locale = workflow.liveify(req.locale);
          _.each(self.localeAncestors[locale] || [], function(locale) {
            _.each((module.options.localized && module.options.localized[locale]) || {}, function(val, key) {
              self.overrideKey(req, module, key, val);
            });
          });
        }
      });

      self.applyOverridesFromDoc(req, req.data.global || {});
      // clone so we are not modifying bestPage._ancestors
      var ancestors = _.clone((req.data.bestPage && req.data.bestPage._ancestors) || []);
      if (req.data.bestPage) {
        ancestors.push(req.data.bestPage);
      }
      _.each(ancestors, function(ancestor) {
        self.applyOverridesFromDoc(req, ancestor);
      });
    };

    self.overrideKey = function(req, module, key, val) {
      var path = key.split(/\./);
      var primary;
      if (path[0] === 'apos') {
        module = self.apos.modules[path[1]];
        if (!module) {
          module = self.apos[path[1]];
        }
        path = path.slice(2);
      }
      if (!module) {
        // Something sneaky is going on
        return new Error('If it is not local to the current module, the key for a fixed override must start with apos. and an instantiated existing module name or alias');
      }
      primary = path[0];
      var name = module.__meta.name;
      if (!req.aposOptions[name].__clonedPrimaries[primary]) {
        req.aposOptions[name][primary] = _.cloneDeepWith(req.aposOptions[module.__meta.name][primary], cloneCustom);
        req.aposOptions[name].__clonedPrimaries[primary] = true;
      }

      var moduleOptions = req.aposOptions[name];

      _.set(moduleOptions, path, self.getNewOptionValue(req, moduleOptions, path, val));
    };

    // Given a `moduleOptions` object in which existing values can be found,
    // a path `sliced` *within* that object (which may be a dot path or an array),
    // and an intended value `val` (which may be an object containing any of the
    // documented operators for this module such as ``$append`), return the
    // new value that is appropriate for `path`.

    self.getNewOptionValue = function(req, moduleOptions, sliced, val) {
      if (val && (typeof val === 'object')) {
        var comparator;
        if (typeof val.comparator === 'string') {
          comparator = function(value, other) {
            return value[val.comparator] === other[val.comparator];
          };
        } else if (typeof val.comparator === 'function') {
          comparator = val.comparator;
        } else {
          comparator = _.isEqual;
        }
        var array;
        var added;
        if (val.$append) {
          array = _.get(moduleOptions, sliced) || [];
          return array.concat(val.$append);
        } else if (val.$prepend) {
          array = _.get(moduleOptions, sliced) || [];
          return val.$prepend.concat(array);
        } else if (val.$appendUnique) {
          array = _.get(moduleOptions, sliced) || [];
          added = _.differenceWith(val.$appendUnique, array, comparator);
          return array.concat(added);
        } else if (val.$prependUnique) {
          array = _.get(moduleOptions, sliced) || [];
          added = _.differenceWith(val.$prependUnique, array, comparator);
          return added.concat(array || []);
        } else if (val.$remove) {
          array = _.get(moduleOptions, sliced);
          array = _.differenceWith(array, val.$remove, comparator);
          return array;
        } else if (val.$replace) {
          if (!val.comparator) {
            // eslint-disable-next-line no-console
            console.warn('Using \'$replace\' without \'comparator\' is probably a bug');
          }
          array = _.get(moduleOptions, sliced);
          return _.map(array, function(item) {
            return _.find(val.$replace, function(replaceItem) {
              return comparator(replaceItem, item);
            }) || item;
          });
        } else if (val.$merge) {
          if (!val.comparator) {
            // eslint-disable-next-line no-console
            console.warn('Using \'$merge\' without \'comparator\' is probably a bug');
          }
          array = _.get(moduleOptions, sliced);
          array = _.map(array, function(item) {
            return _.find(val.$merge, function(replaceItem) {
              return comparator(replaceItem, item);
            }) || item;
          });
          var additional = val.$merge.filter(function (replaceItem) {
            return array.every(function (item) {
              return !comparator(item, replaceItem);
            });
          });
          return array.concat(additional);
        } else if (val.$assign) {
          // As an escape mechanism
          return val.$assign;
        } else {
          return val;
        }
      } else if (val && (typeof val === 'function')) {
        return val(req, moduleOptions, sliced, _.get(moduleOptions, sliced));
      } else {
        return val;
      }
    };

    // Given a doc and a field name, return the field value
    // suitable for use with `overrideKey`. This method handles
    // both simple field names like `name` and array modifiers
    // like `{ $append: 'name' }`, returning objects
    // like `'Jane'` and `{$ append: 'Jane' }`.
    self.getEditableFieldValue = function(doc, field) {
      var val;
      if (typeof field === 'object') {
        // It's a command like $append. Build an
        // object like { $append: [ 5 ] } from an
        // object like { $append: 'fieldname' }.
        // If the field is empty treat it as
        // appending nothing. This code looks weird
        // because I'm avoiding hardcoding this for
        // every verb.
        var verb = _.keys(field)[0];
        var comparator = field.comparator;
        field = _.values(field)[0];
        val = doc[field];
        if (!Array.isArray(val)) {
          if (val || (val === 0)) {
            val = [ val ];
          } else {
            val = [];
          }
        }
        var object = {};
        object[verb] = val;
        if (comparator) {
          object.comparator = comparator;
        }
        val = object;
      } else {
        val = doc[field];
      }
      return val;
    };

    // Apply option overrides based on a particular document's
    // type and settings, per the `overrideOptions` configuration
    // of its manager module or, if provided, the module passed
    // as `optionsSource`.

    self.applyOverridesFromDoc = function(req, doc, optionsSource) {
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
      var locale;
      _.each(fixed || {}, function(val, key) {
        self.overrideKey(req, optionsSource, key, val);
      });
      if (workflow && localized) {
        locale = workflow.liveify(req.locale);
        _.each(self.localeAncestors[locale] || [], function(locale) {
          if (localized) {
            _.each((localized[locale]) || {}, function(val, key) {
              self.overrideKey(req, optionsSource, key, val);
            });
          }
        });
      }
      _.each(editable || {}, function(field, key) {
        // like `'Jane'` and `{$ append: 'Jane' }`.
        var val = self.getEditableFieldValue(doc, field);
        if (val || (val === 0)) {
          self.overrideKey(req, optionsSource, key, val);
        }
      });
    };

    self.compileLocaleTree = function() {
      var workflow = self.apos.modules['apostrophe-workflow'];
      if (!workflow) {
        return;
      }
      var locales = workflow.options.locales;
      self.localeAncestors = {};
      exploreLocales(locales, []);

      function exploreLocales(locales, ancestors) {
        _.each(locales, function(locale) {
          self.localeAncestors[locale.name] = ancestors.concat([ locale.name ]);
          if (locale.children) {
            exploreLocales(locale.children, ancestors.concat([ locale.name ]));
          }
        });
      }
    };

    // Make sure cloned options still include functions.
    // _.clone handles most other types well.

    function cloneCustom(item) {
      if (typeof item === 'function') {
        return item;
      }
    }

  }
};
