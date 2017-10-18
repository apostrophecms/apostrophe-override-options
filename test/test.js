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
        'apostrophe-option-overrides': {}
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
      assert.equal(apos.testResults.mouthfeel, 'bitter');
      assert.equal(apos.testResults.sweetness, 'very');
      done();
    });
  });
  
});

  