var assert = require('assert');
var _ = require('lodash');
var async = require('async');
var request = require('request');
var fs = require('fs');

describe('Workflow Core', function() {

  var apos;

  var testResults = {};

  this.timeout(5000);

  after(function() {
    apos.db.dropDatabase();
  });

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
              
              _children: [
                {
                  title: 'Grandkid',
                  type: 'default',
                  analyticsEventId: 'setting-grandkid',
                  extraChannelId: 12,
                  slug: '/tab/grandkid',
                  published: true
                }
              ]
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
            }
          ]
        },
        'analytics-button-widgets': {},
        'default-pages': {},
        'home-pages': {},
        'apostrophe-option-overrides': {},
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
        assert(apos.modules['apostrophe-option-overrides']);
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
      // Tests of the array operators like $prepend, see modules
      assert.deepEqual(apos.testResults.channelIds, [ 3, 5, 5, 7, 9 ]);
      assert.deepEqual(apos.testResults.channelIds2, [ 3, 5, 7, 9 ]);
      assert.deepEqual(apos.testResults.channelIds3, [ 5, 7, 9, 3, 5 ]);
      assert.deepEqual(apos.testResults.channelIds4, [ 7, 9, 3, 5 ]);
      assert.deepEqual(apos.testResults.channelIds5, [ 3 ]);
      assert.deepEqual(apos.testResults.channelIds6, [ 3, 5, 12 ]);
      // Default locale is in effect
      assert.equal(apos.testResults.mouthfeel, 'bitter-default');
      assert.equal(apos.testResults.sweetness, 'very-default');
      done();
    });
  });

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
  
});

  