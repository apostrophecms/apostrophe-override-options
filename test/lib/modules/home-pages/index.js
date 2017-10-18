module.exports = {
  name: 'home',
  extend: 'apostrophe-custom-pages',
  overrideOptions: {
    fixed: {
      'apos.analytics-button-widgets.eventId': 'from-home',
      'apos.analytics-button-widgets.flavor.mouthfeel': 'bitter'
    }
  }
};
