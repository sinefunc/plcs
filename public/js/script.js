;(function($) {
  var RF = window.RF;

  $.extend(RF, {
    init: function() {
      var self = this;

      $.hashListen('', function() {
        self.loadLanguages(['ruby', 'python']);
        $(".preload").show();
      });

      $.hashListen(':languages', function(languages) {
        languages = languages.split('+');
        self.loadLanguages(languages);
        $(".preload").show();
      });
    },

    // Loads the languages given in the array.
    loadLanguages: function(languages) {
      var self = this;
      for (i in self.languages) {
        var lang = self.languages[i];
        var $el  = $('.' + lang);

        if (languages.indexOf(lang) != -1) {
          $('.' + lang + ':hidden').show();
          self.$checkbox(lang).attr('checked', 1);
        }
        else {
          $('.' + lang).hide();
          self.$checkbox(lang).attr('checked', 0);
        }
      }
    },

    // Returns the selected languages.
    getLanguages: function() {
      var $selector = $('.selector');
      var re = [];
      $selector.find('input:checkbox').each(function() {
        if ($(this).attr('checked'))
          { re.push($(this).attr('name')); }
      });
      return re;
    },

    $checkbox: function(lang) {
      return $('.selector input:checkbox[name='+lang+']');
    }
  });

  $('.selector input:checkbox').live('change', function() {
    window.location.hash = '#' + RF.getLanguages().join('+');
  });

  $(function() { RF.init(); });
})(jQuery);
