# The Reference model
class Reference
  attr_accessor :content
  attr_accessor :languages

  def initialize(fname)
    require "yaml"
    stream = YAML::load_stream(File.open(fname))
    @languages = stream.documents[0]

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
  end
end
