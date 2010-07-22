# The Reference model
class Reference
  def self.[](name)
    ref = Reference.new(name)
    File.exists?(ref.filename) ? ref : nil
  end

  # Returns a hash with the keys being the reference names,
  # and the values are arrays of language strings.
  def self.all_languages
    Dir[path('*.yml')].map do |file|
      name = File.basename(file, '.yml')
      { name => YAML::load_file(file)["languages"] }
    end
  end

  def self.all
    Dir[path('*.yml')].map do |file|
      self[File.basename(file, '.yml')]
    end
  end

  def self.path(*a)
    File.join([Main.root, "data", a].flatten)
  end

  def initialize(name)
    @name = name
    @filename = self.class.path("#{name}.yml")
  end

  attr_reader :filename
  attr_reader :name

  def to_s
    name
  end

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
