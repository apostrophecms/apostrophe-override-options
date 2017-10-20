module.exports = {
  improve: 'apostrophe-pieces-pages',
  construct: function(self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function(req, callback) {
      if (req.data.piece) {
        self.apos.modules['apostrophe-override-options'].applyOverridesFromDoc(req, req.data.piece, self.pieces);
      }
      return superBeforeShow(req, callback);
    };
  }
};
