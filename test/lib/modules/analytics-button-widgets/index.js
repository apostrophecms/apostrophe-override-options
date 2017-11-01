module.exports = {
  extend: 'apostrophe-widgets',
  name: 'analytics-button',
  label: 'Analytics Button',
  addFields: [
    {
      type: 'string',
      name: 'label'
    },
    {
      type: 'string',
      name: 'eventId4',
      label: 'Event ID'
    }
  ],
  eventId: 'module-default',
  eventId3: 'module-default',
  eventId4: 'module-default',
  channelIds: [ 3, 5 ],
  channelIds2: [ 3, 5 ],
  channelIds3: [ 3, 5 ],
  channelIds4: [ 3, 5 ],
  channelIds5: [ 3, 5 ],
  channelIds6: [ 3, 5 ],
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
  overrideOptions: {
    editable: {
      'eventId4': 'eventId4'
    }
  },
  construct: function(self, options) {
    self.pageBeforeSend = function(req) {
      try {
        self.apos.testResults.eventId = self.getOption(req, 'eventId', 'default');
        self.apos.testResults.eventId2 = self.getOption(req, 'eventId2', 'default');
        self.apos.testResults.eventId3 = self.getOption(req, 'eventId3', 'default');
        self.apos.testResults.channelIds = self.getOption(req, 'channelIds', []);
        self.apos.testResults.channelIds2 = self.getOption(req, 'channelIds2', []);
        self.apos.testResults.channelIds3 = self.getOption(req, 'channelIds3', []);
        self.apos.testResults.channelIds4 = self.getOption(req, 'channelIds4', []);
        self.apos.testResults.channelIds5 = self.getOption(req, 'channelIds5', []);
        self.apos.testResults.channelIds6 = self.getOption(req, 'channelIds6', []);
        self.apos.testResults.mouthfeel = self.getOption(req, 'flavor.mouthfeel', 'default');
        self.apos.testResults.sweetness = self.getOption(req, 'flavor.sweetness', 'default');
        self.apos.testResults.incredible = self.getOption(req, 'flavor.incredible', false);
      } catch (e) {
        console.error(e);
      }
    };
  }
};
