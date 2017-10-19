module.exports = {
  name: 'home',
  extend: 'apostrophe-custom-pages',
  overrideOptions: {
    fixed: {
      'apos.analytics-button-widgets.eventId': 'from-home',
      'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter',
      'apos.analytics-button-widgets.channelIds': { $append: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIds2': { $appendUnique: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIds3': { $prepend: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIds4': { $prependUnique: [ 5, 7, 9 ] },
      'apos.analytics-button-widgets.channelIds5': { $remove: [ 5, 7, 9 ] },
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
