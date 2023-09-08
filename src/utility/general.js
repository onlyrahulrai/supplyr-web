export const numberFormatter = (n="") => {
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

// export const priceFormatter = _price => <span>&#8377; {numberFormatter(_price)}</span>
export const priceFormatter = _price => <span>&#36; {numberFormatter(_price)}</span>

export const priceFormatterDollar = _price => <span>&#36; {numberFormatter(_price)}</span>


export const capitalizeString = (str) => {
  return str?.charAt(0)?.toUpperCase() + str?.slice(1)
}

export const calculateTotals = (items) => {
  return items?.reduce(
    (sum, item) => {
      const actualPrice =
        parseFloat(item?.actual_price) * item?.quantity;
      const salePrice =
        parseFloat(item?.price || item?.actual_price) *
        item?.quantity;

      const _sum = {
        actualPrice: sum.actualPrice + actualPrice,
        salePrice: sum.salePrice + salePrice,
      };
      return _sum;
    },
    {
      actualPrice: 0,
      salePrice: 0,
    }
  );
}

export  const extraDiscounts = (buyerData,items) => {
  // console.log(" ------- buyer data from extra discounts function --------",buyerData)
  const discount = items.filter((item) => buyerData?.exclusive_products?.find((exProduct) => exProduct.product.id === item.variant.product.id))

  let sum = 0
  if(discount.length > 0){
      for(var i = 0;i<discount.length;i++){
          const d = buyerData.exclusive_products.find((exProduct) => 
          exProduct.product.id === discount[i].variant.product.id)
          if(d){
              
              if(d.discount_type === "percentage"){
                  sum += (parseInt(d.discount_value) * parseInt(discount[i].variant.price)) / 100
                  
              }else{
                  sum += parseInt(d.discount_value)
              }
          }
      }
  }else{
      if(buyerData?.generic_discount?.discount_type === "percentage"){
        let totals = calculateTotals(items).salePrice
        sum += ((totals * parseInt(buyerData?.generic_discount?.discount_value || 0)) / 100)
      }else{
        sum += parseInt(buyerData?.generic_discount?.discount_value || 0)
      }
      
      // console.log("------- generic discount ------ ")
  }

  return sum
}

export const calculate_extra_discount = (discount,product) => {
  let extra_discount;
  if(discount.discount_type === "percentage"){
      extra_discount = ((product.price*discount.discount_value)/100)
  }else{
      extra_discount = discount.discount_value
  }

  return extra_discount;
}

export const formateDate = (date) => {
  const event = new Date(date);
  const options =  { day: 'numeric', year: 'numeric', month: 'long' };
  return event.toLocaleDateString(undefined, options)
}
export const regx = new Object( {
  alpha: /^[A-Za-z\s]+$/,
  email: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  mobileNumber: /^(\+91|0)?\s?\d{10}$/,
})
export const getTwoDecimalDigit = (digit) => {
  return parseFloat(digit.toFixed(2))
}