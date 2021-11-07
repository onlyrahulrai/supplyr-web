import apiClient from "api/base";
import React, { useState } from "react";
import { Search } from "react-feather";
import { Button, Form, FormGroup, Input } from "reactstrap";
import BuyerSidebarCard from "./BuyerSidebarCard";
import { useDebouncedCallback } from 'use-debounce';

const debounce = (callback,delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => callback(...args),delay)
  }
} 

class BuyerSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.state = {
      value: "",
      error: false,
      loading: false,
      buyers: [],
      hasMore: true,
      page: 1,
    };
  }

  

  fetchBuyers = () => {
    this.setState({ loading: true });
    let url;
    if (this.state.value) {
      url = `inventory/seller-buyers/?search=${this.state.value}&page=${this.state.page}`;
    } else {
      url = `inventory/seller-buyers/?page=${this.state.page}`;
    }

    apiClient.get(url).then((res) => {
      const {
        state: { value, page, buyers },
      } = this;
      let _data;
      if ((value && page === 1) || page === 1) {
        _data = [...res.data.results];
      } else if (page > 1) {
        _data = [...buyers, ...res.data.results];
      }
      this.setState({
        loading: false,
        buyers: _data,
        hasMore: res.data.links.next ? true : false,
        page: res.data.links.next ? page : 1,
      });
    });
  };

  componentDidMount() {
    this.fetchBuyers();
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.fetchBuyers();
  };

  
  debouncedLog = debounce(text => {
    this.fetchBuyers()
  },2000)

  handleChange = (e) => {
    this.setState({value:e.target.value})
    this.debouncedLog(e.target.value)
  }


  capitalizeString = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  render() {
    console.log("buyers >>> ", this.state.buyers);
    return (
      <React.Fragment>
        <div className="mr-2 mt-1">
          <Form onSubmit={this.handleSubmit}>
            <FormGroup className="position-relative has-icon-left mx-1 py-0 w-100">
              <Input
                className="round"
                type="text"
                placeholder="Search Buyer profiles..."
                value={this.state.value}
                onChange={this.handleChange}
              />
              <div className="form-control-position">
                <Search size={15} />
              </div>
            </FormGroup>
          </Form>
        </div>
        <div
          className="overflow-scroll-y buyer-discount-sidebar-users h-75 px-1 mt-1"
          onScroll={this.handleScroll}
          ref={this.myRef}
        >
          {this.state.buyers?.map((buyer, index) => (
            <BuyerSidebarCard
              key={index}
              title={buyer.buyer.business_name}
              discount="10"
              noOfProducts={5}
              buyer={`${this.capitalizeString(buyer.buyer.buyer_name)} (${buyer.buyer.email})`}
            />
          ))}
          <div className="d-flex align-items-center pb-5 justify-content-center">
            {this.state.hasMore ? (
              <button
                type="button"
                className="mx-auto btn btn-primary  btn-sm"
                onClick={() => {
                  this.setState(
                    (prevState) => {
                      return { page: prevState.page + 1 };
                    },
                    () => {
                      this.fetchBuyers();
                    }
                  );
                }}
              >
                Load More
              </button>
            ) : (
              <span className="text-center">
                {
                  this.state.buyers.length > 0  ? "no more buyer's" : "no results"
                }
                
              </span>
            )}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default BuyerSidebar;
