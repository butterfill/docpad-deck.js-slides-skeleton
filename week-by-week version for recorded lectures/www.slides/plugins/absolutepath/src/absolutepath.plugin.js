// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  module.exports = function(BasePlugin) {
    var absolutePathPlugin;
    return absolutePathPlugin = (function(superClass) {
      extend(absolutePathPlugin, superClass);

      function absolutePathPlugin() {
        return absolutePathPlugin.__super__.constructor.apply(this, arguments);
      }

      absolutePathPlugin.prototype.name = 'absolutepath';

      absolutePathPlugin.prototype.config = {
        url: "/"
      };

      absolutePathPlugin.prototype.renderAfter = function(opts, next) {
        var database, docpad, href, src;
        docpad = this.docpad;
        if (indexOf.call(docpad.getEnvironments(), 'static') >= 0) {
          docpad.log('debug', 'Writing absolute urls');
          href = 'href="' + this.config.url;
          src = 'src="' + this.config.url;
          database = docpad.getCollection('html');
          database.forEach(function(document) {
            var content;
            content = document.get('contentRendered');
            if (/href="\//.test(content)) {
              content = content.replace(/href="\//g, href);
            }
            if (/src="\//.test(content)) {
              content = content.replace(/src="\//g, src);
            }
            return document.set('contentRendered', content);
          });
          next() != null;
        } else {
          next() != null;
        }
        return this;
      };

      return absolutePathPlugin;

    })(BasePlugin);
  };

}).call(this);