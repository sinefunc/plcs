;(function($) {
  var RF = window.RF;

  $.extend(RF, {
    init: function() {
      var self = this;

      $.hashListen('', function() {
        self.loadLanguages(['ruby', 'python']);
        self.normalize();
        $(".preload").removeClass('preload');
      });

      $.hashListen(':languages', function(languages) {
        languages = languages.split('+');
        self.loadLanguages(languages);
        self.normalize();
        $(".preload").removeClass('preload');
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

    normalize: function() {
      var self = this;
      var selector = [];

      // Make a list of TDs for all active languages.
      var langs = self.getLanguages();
      for (i in langs) { selector.push("td." + langs[i]); }
      selector = selector.join(",");

      // Hide the unused table rows.
      $("tr").each(function() {
        var $tds   = $(this).find(selector),
            $th    = $(this).find('th'),
            text   = $tds.text().trim();

        if (text == '') { $(this).addClass('hidden'); }
        else { $(this).removeClass('hidden'); }
      });

      // Hide unused sections.
      $("section").each(function() {
        var $trs = $(this).find("tr:not(.hidden)");
        if ($trs.length == 0) { $(this).addClass('hidden'); }
        else { $(this).removeClass('hidden'); }
      });
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
