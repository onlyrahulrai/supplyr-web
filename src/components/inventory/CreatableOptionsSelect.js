import React, { Component } from "react";

import CreatableSelect from "react-select/creatable";
// import { colourOptions } from '../data';

const createOption = (value: string) => ({
  value,
  label: value,
});

export default class CreatableSingle extends Component<*, State> {
  state = {
    options: [],
  };
  componentDidMount() {
    let initialOptions = undefined;
    let defaultValue = undefined;

    if (this.props.defaultOptions) {
      initialOptions = this.props.defaultOptions.map((value) => createOption(value));
    }
    if(this.props.defaultValue) {
      defaultValue = createOption(this.props.defaultValue)
    }
    this.setState({ 
      options: initialOptions,
      value: defaultValue
      });
  }
  handleChange = (newValue: any, actionMeta: any) => {
    this.setState({
      value: newValue,
    });
    if (this.props.onChange) this.props.onChange(newValue?.value);
  };
  handleCreate = (value) => {
    this.props.onNewValueCreation(value);
    this.props.onChange(value);
    let newOptions = [...this.state.options, createOption(value)];
    this.setState({ value: createOption(value), options: newOptions });
  };
  handleInputChange = (inputValue: any, actionMeta: any) => {
  };
  render() {
    return (
      <CreatableSelect
        isClearable
        onChange={this.handleChange}
        onInputChange={this.handleInputChange}
        options={this.state.options}
        value={this.state.value}
        onCreateOption={this.handleCreate}
      />
    );
  }
}
