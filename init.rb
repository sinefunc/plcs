ROOT_DIR = File.expand_path(File.dirname(__FILE__)) unless defined? ROOT_DIR

require "rubygems"
require "vendor/dependencies/lib/dependencies"
require "haml"
require "less"
require "sinatra/base"
require 'syntax/convertor/html'

class Main < Sinatra::Base
  set :root, File.dirname(__FILE__)
  set :run, lambda { $0 == __FILE__ }

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
      ['Ruby', 'Python', 'PHP']
    end

    def format_code(code, language)
      conv = Syntax::Convertor::HTML.for_syntax language
      conv.convert(code)
    end
  end
end

Main.run! if Main.run?
