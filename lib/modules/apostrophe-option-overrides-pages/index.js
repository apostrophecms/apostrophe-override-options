module.exports = {
  improve: 'apostrophe-pages',
  construct: function(self, options) {
    var superServeLoaders = self.serveLoaders;
    self.serveLoaders = function(req, callback) {
      self.apos.modules['apostrophe-option-overrides'].calculateOverrides(req);
      return superServeLoaders(req, callback);
    };
  }  
};
