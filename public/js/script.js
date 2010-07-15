;(function($) {
  var RF = window.RF;

  $.extend(RF, {
    init: function() {
    }
  });

  $('.selector input:checkbox').live('change', function() {
    var v    = $(this).attr('checked'),
        name = $(this).attr('name');

    if (v) {
      $("." + name).fadeIn('fast');
    }
    else {
      $("." + name).fadeOut('fast');
    }
  });

  $(function() {
    $(".selector").find("input:checkbox[name=ruby]").attr("checked", 1);
    $(".selector").find("input:checkbox[name=python]").attr("checked", 1);
    for (i in RF.languages) {
      var lang      = RF.languages[i];
      var checkbox  = $(".selector input:checkbox[name="+lang+"]");
      var $elements = $("." + lang);

      if (checkbox.attr("checked"))
        { $elements.show(); }
      else
        { $elements.hide(); }
    }
    $(".preload").show();
  });
})(jQuery);
