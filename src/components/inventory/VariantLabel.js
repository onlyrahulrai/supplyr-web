import React from 'react'

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
      <>
        {labelData.map((data, index) => {
          return (
            <div key={index}>
              <span style={{fontWeight: 'bold', color: colorScheme.optionName}}>
                {data.name}
                {': '}
              </span>
              <span style={{color: colorScheme.optionValue}}>
                {data.value}
                {index !== (labelData.length - 1) ? ', ' : null }
              </span>
            </div>
          )
        })}
      </>
    )
  }