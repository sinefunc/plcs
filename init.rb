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
  set :reference_file, File.join(File.dirname(__FILE__), 'reference.yml')

  get '/:languages' do |langs|
    langs.gsub!(' ', '+')
    redirect "/##{langs}", 301
  end

  get '/' do
    @ref = Reference.new(settings.reference_file)
    haml :home, {}, :content => @ref.content, :languages => @ref.languages
  end
end

Dir['app/**/*.rb'].each { |file| require File.join('.', file) }
Main.run! if Main.run?
