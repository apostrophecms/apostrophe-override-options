module.exports = {
  name: 'home',
  extend: 'apostrophe-custom-pages',
  overrideOptions: {
    fixed: {
      'apos.analytics-button-widgets.eventId': 'from-home',
      'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter'
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
