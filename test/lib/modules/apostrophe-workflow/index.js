// Mock apostrophe-workflow module just for the tests.
// apostrophe-option-overrides tests for its existence

module.exports = {
  construct: function(self, options) {
    // Establish locale so we can test locale overrides
    self.expressMiddleware = function(req, res, next) {
      if (req.query.locale) {
        req.locale = req.query.locale;
      } else {
        req.locale = 'default';
      }
      return next();
    };
    self.liveify = function(s) {
      return s.replace(/\-draft$/, '');
    };
  }
};
