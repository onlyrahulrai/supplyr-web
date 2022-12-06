import { capitalizeString } from "utility/general"

export default function VariantLabel({variantData, colorTheme = 'light'}) {
    const colorScheme = {
      'dark': {
        optionName: '#eee',
        optionValue: 'white',
      },
      'light': {
        optionName: '#777',
        optionValue: '#333',
      }
    }[colorTheme]

    const labelData =  [1,2,3].reduce(
      (labelData, optionIndex) => {
        let _labelData = [...labelData]
        if(variantData['option' + optionIndex + '_value']) {
          // if(index !== 0) {
          //   label_add += ', '
          // }
          let option_name = variantData['option' + optionIndex + '_name'] 
          let option_value = variantData['option' + optionIndex + '_value'] 
          _labelData.push({name: option_name, value: option_value})
          return _labelData
        }
        return _labelData
      },
      []
    )
    
    return (
      <div>
        {labelData.map((data, index) => {
          return (
            <div key={index} className="d-inline">
              <span style={{fontWeight: 'bold'}} className="text-dark">
                {capitalizeString(data.name)}
                {': '}
              </span>
              <span style={{color: colorScheme.optionValue}}>
                {data.value}
                {index !== (labelData.length - 1) ? ",\t" : null }
              </span>
            </div>
          )
        })}
      </div>
    )
  }