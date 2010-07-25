class Array
  def each_hash(&blk)
    each { |hash| hash.each &blk }
  end

  def map_hash(&blk)
    map { |hash| hash.inject({}) { |a, (k,v)| a = yield(k, v) } }
  end
end

