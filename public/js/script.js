;(function($) {
  var RF = window.RF;

  $.extend(RF, {
    // Options
    default_languages: ['ruby'],

    // Methods
    init: function() {
      var self = this;

      $.hashListen('', function() {
        self.loadLanguages(self.default_languages);
        self.normalize();
      });

      $("a[href=#beta]").live("click", function() {
        $("label:hidden").show();
        $(this).hide();
        self.normalize();
        return false;
      });

      $.hashListen('all', function() {
        self.loadLanguages(self.languages);
        self.normalize();
      });

      $.hashListen(':languages', function(languages) {
        languages = languages.split('+');
        self.loadLanguages(languages);
        self.normalize();
      });

    },
    
    stripe: function() {
      $("table tr").removeClass('even');
      $("table tr:not(.hidden):even").addClass('even');
    },

    // Loads the languages given in the array.
    loadLanguages: function(languages) {
      var self = this;
      for (i in self.languages) {
        var lang = self.languages[i];
        var $el  = $('.' + lang);

        if (languages.indexOf(lang) != -1) {
          $('.' + lang + ':hidden').show();
          self.$checkbox(lang)
            .parents('label').show().addClass('active').end()
            .attr('checked', 1);
        }
        else {
          $('.' + lang).hide();
          self.$checkbox(lang)
            .parents('label.active').removeClass('active').end()
            .attr('checked', 0);
        }
      }

      // Compact mode.
      if (languages.length == 1) {
        $(document.body).addClass("compact");
      }
      else {
        $(document.body).removeClass("compact");
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
      $("tbody tr").each(function() {
        var $tds   = $(this).find(selector),
            $th    = $(this).find('th'),
            text   = $tds.text().trim();

        if (text == '') { $(this).addClass('hidden'); }
        else { $(this).removeClass('hidden'); }
      });

      // Hide unused sections.
      $("section").each(function() {
        var $trs = $(this).find("tbody tr:not(.hidden)");
        if ($trs.length == 0) { $(this).addClass('hidden'); }
        else { $(this).removeClass('hidden'); }
      });

      // Hide unused columns.
      $("section").each(function() {
        for (i in langs) {
          var lang = langs[i];
          var $tds = $(this).find("td."+lang);
          var $stuff = $(this).find("td."+lang+",th."+lang);
          if ($tds.text().trim() == '') {
            $stuff.hide(); // .css({'opacity': '0'});
          }
          else {
            $stuff.show(); // .css({'opacity': '1.0'});
          }
        }
      });

      // Rearrange table stripes
      self.stripe();

      // Make sure everything is shown.
      $(".preload").removeClass('preload');
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
    var langs = RF.getLanguages();
    if (langs.length > 0) {
      window.location.hash = '#' + langs.join('+');
    }
    else {
      window.location.hash = '#none';
    }
  });

  $(function() { RF.init(); });
  $(function() { RF.init(); });
})(jQuery);
