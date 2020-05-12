module.exports = {
  improve: 'apostrophe-doc-type-manager',
  construct: function(self, options) {
    // Extend allowedSchema to calculate overrides first before
    // getOption is sometimes used to alter schemas. This is enough
    // to get us access to locale overrides. Page type based overrides
    // for schemas do not make sense because both pages and pieces
    // may move around and it would be a false claim to try to guarantee
    // that they only have a certain schema because they were "born" in
    // a certain part of the site. Which is fortunate, because
    // req.data.page isn't known yet at this point

    var superAllowedSchema = self.allowedSchema;
    self.allowedSchema = function(req) {
      if (!req.aposOptions) {
        self.apos.modules['apostrophe-override-options'].calculateOverrides(req);
      }
      return superAllowedSchema(req);
    };

  }
};
