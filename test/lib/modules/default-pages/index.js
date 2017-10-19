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
    }
  ],
  overrideOptions: {
    editable: {
      'apos.analytics-button-widgets.eventId': 'analyticsEventId',
      'apos.analytics-button-widgets.channelIds6': { $append: 'extraChannelId' }
    }
  }
};
