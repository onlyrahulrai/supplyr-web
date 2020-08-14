import React, { Component } from 'react';

import CreatableSelect from 'react-select/creatable';

const components = {
  DropdownIndicator: null,
};

const createOption = (label: string) => ({
  label,
  value: label,
});

export default class CreatableInputOnly extends Component<*, State> {
  state = {
    inputValue: '',
    value: [],
  };

  componentDidMount() {
    if (this.props.defaultValues) {
      let _value = this.props.defaultValues.map(v => createOption(v) )
      this.setState({value: _value})
    }
  }

  propogateValuesToParent = values => {
    let values_filtered = values.map(value => value.value)
    this.props.onChange(values_filtered)
  }

  handleChange = (value: any, actionMeta: any) => {
    // Mainly handles when item gets removed
    // console.group('Value Changed');
    // console.log(value);
    // console.log(`action: ${actionMeta.action}`);
    // console.groupEnd();
    this.setState({ value: value ?? [] });
    this.propogateValuesToParent(value ?? []);
  };
  handleInputChange = (inputValue: string) => {
    this.setState({ inputValue });
  };
  handleKeyDown = (event: SyntheticKeyboardEvent<HTMLElement>) => {
    let { inputValue, value } = this.state;
    inputValue = inputValue.trim()
    if (!inputValue) return;
    switch (event.key) {
      case 'Enter':
      case 'Tab':
        if(value.map(o => o.value).includes(inputValue)){
          //If value already exists
          this.setState({
            inputValue: ''
          })
          break;
        }
        console.group('Value Added');
        console.log(value);
        console.groupEnd();
        let updatedValues = [...value, createOption(inputValue)]
        this.setState({
          inputValue: '',
          value: updatedValues,
        });
        event.preventDefault();
        this.propogateValuesToParent(updatedValues)
    }
  };
  render() {
    const { inputValue, value } = this.state;
    return (
      <CreatableSelect
        components={components}
        inputValue={inputValue}
        isClearable
        isMulti
        menuIsOpen={false}
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        onKeyDown={this.handleKeyDown}
        placeholder={this.props.placeholder ?? "Type something and press enter..."}
        value={this.props.values?.map(v => createOption(v)) ?? value}
        className={this.props.className}
      />
    );
  }
}