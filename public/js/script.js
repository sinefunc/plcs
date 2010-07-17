;(function($) {
  var RF = window.RF;

  $.extend(RF, {
    init: function() {
      $(document.body).removeClass('preload');

      var self = this;

      $.hashListen('', function() {
        self.loadLanguages([self.languages[0]]);
        self.normalize();
      });

      $("select[name=see-also]").live("change", function() {
        window.location = $(this).val();
        $(this).val('');
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

        if (languages.length > 1) {
          $('label.active').removeClass('active');
          $('.tabs').addClass('multiple');
        }
        else {
          $('.tabs').removeClass('multiple');
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
      $("tbody tr").each(function() {
        var $tds   = $(this).find(selector),
            $th    = $(this).find('th'),
            text   = $tds.text();

        if (text.match(/^\s*$/) != null) { $(this).addClass('hidden'); }
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
          if ($tds.text().match(/^\s*$/) != null) {
            $stuff.addClass('unused');
          }
          else {
            $stuff.removeClass('unused');
          }
        }
      });

      // Rearrange table stripes
      self.stripe();

      // Compact mode.
      var languages = self.getLanguages();
      if (languages.length == 1) {
        $(document.body).addClass("compact");
        $("#content").unmason();
        $("#content").masonry({ singleMode: true, itemSelector: 'section:not(.hidden)' });
      }
      else {
        $(document.body).removeClass("compact");
        $("#content").unmason();
      }

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

  $.fn.unmason = function() {
    $(this)
      .removeClass("masoned")
      .css({"height": "auto"})
      .data("masonry", null)
      .find(">*").css({"position": "static"}).end();
  };
})(jQuery);

