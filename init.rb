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
end

Dir['app/**/*.rb'].each { |file| require File.join('.', file) }

class Main
  # Alias for C++
  get '/c  ' do
    redirect '/cpp', 301
  end

  # Refs (/programming, /css, etc)
  Reference.all.each do |ref|
    get "/#{ref}" do
      load_reference(ref)
    end
  end

  get '/:language' do
    Reference.all_languages.each_hash do |section, langs|
      langs.map! { |str| to_slug(str) }
      if langs.include?(params[:language])
        section = ''  if section == 'programming'
        redirect "/#{to_slug(section)}##{to_slug(params[:language])}", 301
      end
    end
    raise Sinatra::NotFound
  end

  get '/' do
    load_reference('programming')
  end

private
  def load_reference(name)
    @page = Reference[name]
    raise Sinatra::NotFound  if @page.nil?

    unless settings.development?
      etag @page.mtime
      last_modified @page.mtime
      cache_control :public, :max_age => 86400
    end

    haml :home, {}, :content => @page.content, :languages => @page.languages
  end
end

class Array
  def each_hash(&blk)
    each { |hash| hash.each &blk }
  end

  def map_hash(&blk)
    map { |hash| hash.inject({}) { |a, (k,v)| a = yield(k, v) } }
  end
end

Main.run! if Main.run?
