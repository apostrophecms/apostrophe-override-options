module.exports = {
  name: 'default',
  extend: 'apostrophe-custom-pages',
  addFields: [
    {
      type: 'string',
      name: 'analyticsEventId'
    }
  ],
  overrideOptions: {
    editable: {
      'apos.analytics-button-widgets.eventId': 'analyticsEventId'
    }
  }
};
