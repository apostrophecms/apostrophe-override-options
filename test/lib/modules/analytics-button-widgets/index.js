module.exports = {
  extend: 'apostrophe-widgets',
  name: 'analytics-button',
  label: 'Analytics Button',
  addFields: [
    {
      type: 'string',
      name: 'label'
    }
  ],
  eventId: 'module-default',
  flavor: {
    mouthfeel: 'tangy',
    sweetness: 'very'
  },
  localized: {
    en: {
      'flavor.sweetness': 'very-en'
    },
    default: {
      'flavor.sweetness': 'very-default',
      'flavor.incredible': true
    }
  },
  construct: function(self, options) {
    self.pageBeforeSend = function(req) {
      try {
        self.apos.testResults.eventId = self.getOption(req, 'eventId', 'default');
        self.apos.testResults.mouthfeel = self.getOption(req, 'flavor.mouthfeel', 'default');
        self.apos.testResults.sweetness = self.getOption(req, 'flavor.sweetness', 'default');
        self.apos.testResults.incredible = self.getOption(req, 'flavor.incredible', false);
      } catch (e) {
        console.error(e);
      }
    };
  }
};
