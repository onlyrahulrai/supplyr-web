export const numberFormatter = (n) => {
    const [preDecimal, postDecimal] = n.toString().split('.');
    let formattedNumber = null
    if (n <100000) {
      formattedNumber = preDecimal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
    else {
      let part1 = preDecimal.toString().slice(0, -5).replace(/\B(?=(\d{2})+(?!\d))/g, ",")
      let part2 = preDecimal.toString().slice(-5).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      formattedNumber = part1 + ',' + part2
    }
  
    return formattedNumber + (postDecimal ? ('.' + postDecimal) : '')
  }

export const priceFormatter = _price => <span>&#8377; {numberFormatter(_price)}</span>


export const capitalizeString = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}