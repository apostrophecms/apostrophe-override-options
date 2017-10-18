module.expoerts = {
  construct: function(self, options) {
    var superBeforeShow = self.beforeShow;
    self.beforeShow = function(req, callback) {
      if (req.data.piece) {
        self.modules['apostrophe-option-overrides'].applyOverridesFromDoc(req, req.data.piece, self.pieces);
      }
      return superBeforeShow(req, callback);
    };
  }
};
