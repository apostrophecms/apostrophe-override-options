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
  channelIdsAppend: [ 3, 5 ],
  channelIdsAppendUnique: [ 3, 5 ],
  channelIdsPrepend: [ 3, 5 ],
  channelIdsPrependUnique: [ 3, 5 ],
  channelIdsRemove: [ 3, 5 ],
  channelIdsAppendEditable: [ 3, 5 ],
  channelObjectsReplaceEditable: [
    { key: 'key1', value: 'val1' },
    { key: 'key2', value: 'val2' },
    { key: 'key3', value: 'val3' },
    { key: 'key4', value: 'val4' }
  ],
  channelObjectsAppend: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsAppendUnique: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsAppendUniqueString: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsAppendUniqueFunc: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsPrepend: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsPrependUnique: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsPrependUniqueString: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsPrependUniqueFunc: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsReplaceString: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsReplaceFunc: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsRemove: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsRemoveString: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
  channelObjectsRemoveFunc: [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'} ],
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
        self.apos.testResults.channelIdsAppend = self.getOption(req, 'channelIdsAppend', []);
        self.apos.testResults.channelIdsAppendUnique = self.getOption(req, 'channelIdsAppendUnique', []);
        self.apos.testResults.channelIdsPrepend = self.getOption(req, 'channelIdsPrepend', []);
        self.apos.testResults.channelIdsPrependUnique = self.getOption(req, 'channelIdsPrependUnique', []);
        self.apos.testResults.channelIdsRemove = self.getOption(req, 'channelIdsRemove', []);
        self.apos.testResults.channelIdsAppendEditable = self.getOption(req, 'channelIdsAppendEditable', []);
        self.apos.testResults.channelObjectsReplaceEditable = self.getOption(req, 'channelObjectsReplaceEditable', []);
        self.apos.testResults.channelObjectsAppend = self.getOption(req, 'channelObjectsAppend', []);
        self.apos.testResults.channelObjectsAppendUnique = self.getOption(req, 'channelObjectsAppendUnique', []);
        self.apos.testResults.channelObjectsAppendUniqueString = self.getOption(req, 'channelObjectsAppendUniqueString', []);
        self.apos.testResults.channelObjectsAppendUniqueFunc = self.getOption(req, 'channelObjectsAppendUniqueFunc', []);
        self.apos.testResults.channelObjectsPrepend = self.getOption(req, 'channelObjectsPrepend', []);
        self.apos.testResults.channelObjectsPrependUnique = self.getOption(req, 'channelObjectsPrependUnique', []);
        self.apos.testResults.channelObjectsPrependUniqueString = self.getOption(req, 'channelObjectsPrependUniqueString', []);
        self.apos.testResults.channelObjectsPrependUniqueFunc = self.getOption(req, 'channelObjectsPrependUniqueFunc', []);
        self.apos.testResults.channelObjectsReplaceString = self.getOption(req, 'channelObjectsReplaceString', []);
        self.apos.testResults.channelObjectsReplaceFunc = self.getOption(req, 'channelObjectsReplaceFunc', []);
        self.apos.testResults.channelObjectsRemove = self.getOption(req, 'channelObjectsRemove', []);
        self.apos.testResults.channelObjectsRemoveString = self.getOption(req, 'channelObjectsRemoveString', []);
        self.apos.testResults.channelObjectsRemoveFunc = self.getOption(req, 'channelObjectsRemoveFunc', []);
        self.apos.testResults.mouthfeel = self.getOption(req, 'flavor.mouthfeel', 'default');
        self.apos.testResults.sweetness = self.getOption(req, 'flavor.sweetness', 'default');
        self.apos.testResults.incredible = self.getOption(req, 'flavor.incredible', false);
      } catch (e) {
        console.error(e);
      }
    };
  }
};
