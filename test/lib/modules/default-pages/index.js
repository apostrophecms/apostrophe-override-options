module.exports = {
  name: 'default',
  extend: 'apostrophe-custom-pages',
  addFields: [
    {
      type: 'string',
      name: 'analyticsEventId'
    },
    {
      type: 'integer',
      name: 'extraChannelId'
    },
    {
      type: 'array',
      name: 'analyticTags',
      label: 'Analytic Tags',
      schema: [
        {
          name: 'key',
          label: 'Tag key',
          type: 'string'
        }, {
          name: 'value',
          label: 'Tag value',
          type: 'string'
        }
      ]
    }
  ],
  overrideOptions: {
    editable: {
      'apos.analytics-button-widgets.eventId': 'analyticsEventId',
      'apos.analytics-button-widgets.channelIdsAppendEditable': { $append: 'extraChannelId' },
      'apos.analytics-button-widgets.channelObjectsReplaceEditable': { $replace: [ 'analyticTags' ], comparator: 'key' },
      'apos.analytics-button-widgets.channelObjectsMergeEditable': { $merge: [ 'analyticTags' ], comparator: 'key' }
    }
  }
};
