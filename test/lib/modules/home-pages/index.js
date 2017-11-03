module.exports = {
  name: 'home',
  extend: 'apostrophe-custom-pages',
  overrideOptions: {
    fixed: {
      'apos.analytics-button-widgets.eventId': 'from-home',
      'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter',
      'apos.analytics-button-widgets.channelIdsAppend': { $append: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIdsAppendUnique': { $appendUnique: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIdsPrepend': { $prepend: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIdsPrependUnique': { $prependUnique: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIdsRemove': { $remove: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelObjectsAppend': {
        $append: [{ foo: 'foo', bar: 'bar' }]
      },
      'apos.analytics-button-widgets.channelIdsRemove': { $remove: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelObjectsAppendUnique': {
        $appendUnique: [{ foo: 'foo', bar: 'bar' }]
      },
      'apos.analytics-button-widgets.channelObjectsAppendUniqueString': {
        $appendUnique: [{ foo: 'foo', bar: 'foo' }],
        comparator: 'foo'
      },
      'apos.analytics-button-widgets.channelObjectsAppendUniqueFunc': {
        $appendUnique: [{ foo: 'foo', bar: 'foo' }],
        comparator: function(value, other) {
          return value.foo === other.foo;
        }
      },
      'apos.analytics-button-widgets.channelObjectsPrepend': {
        $prepend: [{ foo: 'foo', bar: 'bar' }]
      },
      'apos.analytics-button-widgets.channelObjectsPrependUnique': {
        $prependUnique: [{ foo: 'foo', bar: 'bar' }]
      },
      'apos.analytics-button-widgets.channelObjectsPrependUniqueString': {
        $prependUnique: [{ foo: 'foo', bar: 'foo' }],
        comparator: 'foo'
      },
      'apos.analytics-button-widgets.channelObjectsPrependUniqueFunc': {
        $prependUnique: [{ foo: 'foo', bar: 'foo' }],
        comparator: function(value, other) {
          return value.foo === other.foo;
        }
      },
      'apos.analytics-button-widgets.channelObjectsRemove': {
        $remove: [{ foo: 'foo', bar: 'bar' }]
      },
      'apos.analytics-button-widgets.channelObjectsRemoveString': {
        $remove: [{ foo: 'foo', bar: 'whatever' }],
        comparator: 'foo'
      },
      'apos.analytics-button-widgets.channelObjectsRemoveFunc': {
        $remove: [{ foo: 'foo', bar: 'whatever' }],
        comparator: function(value, other) {
          return value.foo === other.foo;
        }
      }
    },
    localized: {
      en: {
        'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter-en'
      },
      default: {
        'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter-default',
        'apos.analytics-button-widgets.flavor.authenticity': 'authentic-default'
      },
    }
  }
};
