class Main
  helpers do
    def to_slug(str)
      str.downcase.gsub(/[^a-z]/, '')
    end

    def format_code(code, language)
      c = CodeRay.scan(code, language.to_sym).span(:css => :class)
      c.gsub("\n", "<br>")
    end

    def js_assets(package)
      files = Array.new
      if settings.development?
        files << '/js/jquery.min.js'
      else
        files << 'http://ajax.googleapis.com/ajax/libs/jquery/1.4/jquery.min.js'
      end

      files << '/js/jquery.hashlisten.js'
      files << '/js/script.js'

      files.map do |file|
        "<script type='text/javascript' src='#{file}'></script>"
      end.join("\n")
    end
  end
end
