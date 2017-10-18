module.exports = {
  construct: function(self, options) {
    var superGetOption = self.getOption;
    self.getOption = function(req, dotPathOrArray, def) {
      if (!req.aposOptions) {
        // Too soon
        return superGetOption(req, dotPathOrArray, def);
      }
      return _.get(req.aposOptions[self.__meta.name], dotPathOrArray, def);
    };
  }
};
