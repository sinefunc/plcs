# The Reference model
class Reference
  def self.[](name = 'reference')
    ref = Reference.new(name)
    File.exists?(ref.filename) ? ref : nil
  end

  def self.all_languages
    Dir[path('*.yml')].map do |file|
      name = File.basename(file, '.yml')
      { name => YAML::load_file(file)["languages"] }
    end
  end

  def self.path(*a)
    File.join([Main.root, "data", a].flatten)
  end

  def initialize(name = 'reference')
    @name = name
    @filename = self.class.path("#{name}.yml")
  end

  attr_reader :filename
  attr_reader :name

  def mtime
    File.mtime(filename)
  end

  def content
    @content || lazyload[:content]
  end

  def languages
    @languages || lazyload[:languages]
  end

private
  def lazyload
    require "yaml"
    stream = YAML::load_stream(File.open(filename))
    @languages = stream.documents[0]['languages']

    # Make sure the snippets are an array of hashes.
    @content = stream.documents[1].map do |hash|
      hash.inject({}) do |a, (section, features)|
        a[section] = features.map do |hash2|
          hash2.inject({}) do |ac, (feature, snippets)|
            ac[feature] = languages.map do |language|
              { language => (snippets[language] || '') }
            end; ac
          end
        end; a
      end
    end

    { :content => @content,
      :languages => @languages }
  end
end
