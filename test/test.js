var assert = require('assert');
var _ = require('lodash');
var async = require('async');
var request = require('request');
var fs = require('fs');

describe('Override Options', function() {

  var apos;

  var testResults = {};

  this.timeout(5000);

  // after(function() {
  //   apos.db.dropDatabase();
  // });

  //////
  // EXISTENCE
  //////

  it('should be a property of the apos object', function(done) {
    apos = require('apostrophe')({
      testModule: true,
      
      modules: {
        'apostrophe-express': {
          port: 7900
        },
        'apostrophe-pages': {
          park: [
            {
              title: 'Tab',
              type: 'default',
              slug: '/tab',
              published: true,
              body: {
                type: 'area',
                items: [
                  {
                    type: 'analytics-button',
                    // nonempty string SHOULD override
                    eventId4: 'edited'
                  },
                  {
                    type: 'analytics-button',
                    // empty string should not override
                    eventId4: ''
                  },
                ]
              },
              _children: [
                {
                  title: 'Grandkid',
                  type: 'default',
                  analyticsEventId: 'setting-grandkid',
                  extraChannelId: 12,
                  analyticTags: [
                    { key: 'anotherKey1', value: 'anotherValue1Authored'},
                    { key: 'key2', value: 'newVal2Authored' },
                    { key: 'key3', value: 'newVal3Authored'},
                    { key: 'anotherKey2', value: 'anotherValue2Authored'}
                  ],
                  slug: '/tab/grandkid',
                  published: true
                }
              ]
            },
            {
              title: 'Products',
              type: 'products-page',
              slug: '/products',
              published: true
            }
          ],
          types: [
            {
              name: 'home',
              label: 'Home'
            },
            {
              name: 'default',
              label: 'Default'
            },
            {
              name: 'products',
              label: 'Products'
            }
          ]
        },
        'analytics-button-widgets': {},
        'default-pages': {},
        'home-pages': {},
        'products': {
          overrideOptions: {
            fixed: {
              'apos.analytics-button-widgets.eventId': 'product-fixed-event-id',
              'apos.analytics-button-widgets.eventId3': function(req, options, path, val) {
                return req.data.piece ? req.data.piece._id : val;
              },
            },
            editable: {
              'apos.analytics-button-widgets.eventId2': 'analyticsEventId',
            }
          }
        },
        'products-pages': {},
        'apostrophe-override-options': {},
        // mock
        'apostrophe-workflow': {
          locales: [
            {
              name: 'default',
              private: true,
              children: [
                {
                  name: 'fr',
                  label: 'Français'
                },
                {
                  name: 'en',
                  label: 'English'
                },
                {
                  name: 'it',
                  label: 'Italian'
                }
              ]
            }
          ]  
        }
      },
      afterInit: function(callback) {
        assert(apos.modules['apostrophe-override-options']);
        return callback(null);
      },
      afterListen: function(err) {
        done();
      }
    });
    apos.testResults = {};
  });
  
  it('should see the right options after pageBeforeSend', function(done) {
    request('http://localhost:7900/tab/grandkid', function(err, response, body) {
      assert(!err);
      assert(response.statusCode < 400);
      assert.equal(apos.testResults.eventId, 'setting-grandkid');
      // Default locale is in effect
      assert.equal(apos.testResults.mouthfeel, 'bitter-default');
      assert.equal(apos.testResults.sweetness, 'very-default');
      done();
    });
  });

  describe('Arrays', function() {
    it('should append values to array option', function(done) {
      request('http://localhost:7900/tab/grandkid', function(err, response, body) {
        assert(!err);
        assert(response.statusCode < 400);
        assert.deepEqual(apos.testResults.channelIdsAppend, [ 3, 5, 5, 7, 9 ]);
        assert.deepEqual(apos.testResults.channelIdsAppendUnique, [ 3, 5, 7, 9 ]);
        assert.deepEqual(apos.testResults.channelIdsAppendEditable, [ 3, 5, 12 ]);
        assert.deepEqual(apos.testResults.channelObjectsAppend, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsAppendUnique, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsAppendUniqueString, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsAppendUniqueFunc, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        done();
      });
    });

    it('should prepend values to array option', function(done) {
      request('http://localhost:7900/tab/grandkid', function(err, response, body) {
        assert(!err);
        assert(response.statusCode < 400);
        assert.deepEqual(apos.testResults.channelIdsPrepend, [ 5, 7, 9, 3, 5 ]);
        assert.deepEqual(apos.testResults.channelIdsPrependUnique, [ 7, 9, 3, 5 ]);
        assert.deepEqual(apos.testResults.channelObjectsPrepend, [{foo: 'foo', bar: 'bar'}, {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsPrependUnique, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsPrependUniqueString, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        assert.deepEqual(apos.testResults.channelObjectsPrependUniqueFunc, [{foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'bar'}]);
        done();
      });
    });

    it('should replace an item matching in array option', function(done) {
      request('http://localhost:7900/tab/grandkid', function(err, response, body) {
        assert(!err);
        assert(response.statusCode < 400);
        assert.deepEqual(apos.testResults.channelObjectsReplaceString, [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'newBar'} ]);
        assert.deepEqual(apos.testResults.channelObjectsReplaceFunc, [ {foo: 'bar', bar: 'foo'}, {foo: 'foo', bar: 'newBar'} ]);
        assert.deepEqual(apos.testResults.channelObjectsReplaceEditable, [
          { key: 'key1', value: 'val1' },
          { key: 'key2', value: 'newVal2Authored' },
          { key: 'key3', value: 'newVal3Authored' },
          { key: 'key4', value: 'val4' }
        ]);
        done();
      });
    });

    it('should merge items (replace matching items and append the rest)', function(done) {
      request('http://localhost:7900/tab/grandkid', function(err, response, body) {
        assert(!err);
        assert(response.statusCode < 400);
        var expected = [
          { key: 'key1', value: 'val1' },
          { key: 'key2', value: 'newVal2Authored' },
          { key: 'key3', value: 'newVal3Authored' },
          { key: 'key4', value: 'val4' },
          { key: 'anotherKey1', value: 'anotherValue1Authored'},
          { key: 'anotherKey2', value: 'anotherValue2Authored'}
        ];
        assert.deepEqual(apos.testResults.channelObjectsMerge, expected);
        assert.deepEqual(apos.testResults.channelObjectsMergeEditable, expected);
        done();
      });
    });

    it('should remove values to array option', function(done) {
      request('http://localhost:7900/tab/grandkid', function(err, response, body) {
        assert(!err);
        assert(response.statusCode < 400);
        assert.deepEqual(apos.testResults.channelIdsRemove, [ 3 ]);
        assert.deepEqual(apos.testResults.channelObjectsRemove, [{foo: 'bar', bar: 'foo'}]);
        assert.deepEqual(apos.testResults.channelObjectsRemoveString, [{foo: 'bar', bar: 'foo'}]);
        assert.deepEqual(apos.testResults.channelObjectsRemoveFunc, [{foo: 'bar', bar: 'foo'}]);
        done();
      });
    });
  })

  it('should see the impact of localized options for en', function(done) {
    // This URL is designed to work specifically with the mock workflow module provided
    request('http://localhost:7900/tab/grandkid?locale=en', function(err, response, body) {
      assert(!err);
      assert(response.statusCode < 400);
      assert.equal(apos.testResults.eventId, 'setting-grandkid');
      assert.equal(apos.testResults.mouthfeel, 'bitter-en');
      assert.equal(apos.testResults.sweetness, 'very-en');
      assert.equal(apos.testResults.incredible, true);
      done();
    });
  });
  
  it('insert a test piece', function(done) {
    var piece = apos.modules.products.newInstance();
    _.assign(piece, {
      title: 'gadget',
      analyticsEventId: 'edited'
    });
    apos.modules.products.insert(apos.tasks.getReq(), piece, function(err) {
      assert(!err);
      done();
    });
  });

  it('should see the impact of widget option overrides at the piece show page level', function(done) {
    // This URL is designed to work specifically with the mock workflow module provided
    request('http://localhost:7900/products/gadget', function(err, response, body) {
      assert(!err);
      assert(response.statusCode < 400);
      assert.equal(apos.testResults.eventId, 'product-fixed-event-id');
      assert.equal(apos.testResults.eventId2, 'edited');
      // should be an apostrophe id
      assert(apos.testResults.eventId3.match(/^c/));
      done();
    });
  });

  it('should see the impact of widget level editable overrides', function(done) {
    request('http://localhost:7900/tab', function(err, response, body) {
      assert(!err);
      assert(response.statusCode < 400);
      var widget1 = body.indexOf('data-analytics-id="edited"');
      var widget2 = body.indexOf('data-analytics-id="module-default"');
      assert(widget1 !== -1);
      assert(widget2 !== -1);
      assert(widget2 > widget1);
      var templateLevel = body.indexOf('data-analytics-id-2="from-template"');
      assert(templateLevel !== -1);
      done();
    });
  });
  
});

  