const formatter = new Intl.ListFormat('en')

Array.prototype.groupBy = function(key) {
    return this.reduce((acc, item) => ((acc[item[key]] = [...(acc[item[key]] || []), item]), acc),{});
  };
  

Array.prototype.limitedListFormat = function(limit = 2) {
  const list = this.map(x => x.toString())
  if(this.length <= limit) {
    return formatter.format(list)
  }
  return `${list.slice(0, limit-1).join(',')} and ${list.length - limit + 1} others`
}