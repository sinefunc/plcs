ROOT_DIR = File.expand_path(File.dirname(__FILE__)) unless defined? ROOT_DIR

require "rubygems"
require "vendor/dependencies/lib/dependencies"
require "haml"
require "less"
require "sinatra/base"
require "coderay"

class Main < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :run, lambda { $0 == __FILE__ }

  get '/:languages' do |langs|
    langs.gsub!(' ', '+')
    redirect "/##{langs}", 301
  end

  get '/' do
    require 'yaml'
    content = YAML::load_file(File.join(settings.root, 'reference.yml'))
    languages = get_languages(content)

    haml :home, {}, :content => content, :languages => languages
  end

  helpers do
    def to_slug(str)
      str.downcase.gsub(/[^a-z]/, '')
    end

    def get_languages(content)
      ['Ruby', 'Python', 'PHP', 'JavaScript']
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

Main.run! if Main.run?
