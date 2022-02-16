import apiClient from "api/base";
import React, { useEffect, useState } from "react";
import { ArrowLeft } from "react-feather";
import {
  Button,
  Card,
  CardBody,
  CardTitle,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
  Table,
} from "reactstrap";
import { capitalizeString, formateDate } from "utility/general";
import { history } from "../../history";
import Select from "react-select";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import DescriptionComponent from "./DescriptionComponent";
import { connect } from "react-redux";
import CustomPagination from "components/common/CustomPagination";

const Swal = withReactContent(_Swal);

const TransactionMode = [
  { label: "Cheque", value: "cheque" },
  { label: "Cash", value: "cash" },
  { label: "Bank Transfer", value: "banktransfer" },
];

const Transaction = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [buyers, setBuyers] = useState([]);
  const [transactionBuyerInfo, setTransactionBuyerInfo] = useState("");
  const [transactionData, setTransactionData] = useState({});
  const [toggleModal, setToggleModal] = useState(false);
  const [ledgers, setLedgers] = useState([]);
  const [page, setPage] = useState(1);

  const sellerBuyerConnections = async () => {
    setIsLoading(true);
    await apiClient
      .get("/inventory/seller-buyers/", {
        params: {
          pagination: "False",
        },
      })
      .then((response) => {
        setBuyers(response.data.results);
        console.log(" <---- seller buyer connection ----> ", response.data);
        setIsLoading(false);
      })
      .catch((error) => console.log(error.message));
  };

  const fetchLedgers = async () => {
    await apiClient
      .get(`/orders/ledgers/${transactionBuyerInfo}/?page=${page}`)
      .then((res) => {
        setLedgers(res.data);

        console.log(" ------ ------ response data ", res.data);
      })
      .catch((error) => console.log(error.message));
  };

  useEffect(() => {
    let unsubscribe;

    if (transactionBuyerInfo) {
      unsubscribe = fetchLedgers();
    }
    return unsubscribe;
  }, [transactionBuyerInfo, page]);

  useEffect(() => {
    const unsubscribe = sellerBuyerConnections();
    return unsubscribe;
  }, []);

  const buyersData = buyers?.map((result) => ({
    value: result.buyer.id,
    label: capitalizeString(result.buyer.business_name),
    email: result.buyer.email,
  }));

  const customSelectStyle = {
    control: (base) => ({
      ...base,
      div: {
        overflow: "initial",
      },
      height: 50,
      minHeight: 50,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 9999,
    }),
  };

  const validForm = () => {
    let errors = [];

    console.log(transactionData);

    if (!transactionBuyerInfo) {
      errors.push("Please select any buyer!");
    }

    if (!transactionData?.amount) {
      errors.push("Transaction amount is required!");
    }

    if (!transactionData?.mode) {
      errors.push("Transaction mode is required!");
    }

    if (errors.length > 0) {
      Swal.fire(
        <div>
          <h1>Error !</h1>
          <h4 className="mb-1">Please correct the following errors</h4>
          {errors.map((error, index) => {
            return (
              <h6 className="text-danger" key={index}>
                {error}{" "}
              </h6>
            );
          })}
        </div>
      );
      return false;
    } else return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validForm();

    if (isValid) {
      setIsLoading(true);
      const transaction = { ...transactionData, buyer: transactionBuyerInfo };
      await apiClient
        .post("orders/transaction/", transaction)
        .then((response) => {
          setTransactionData({});
          fetchLedgers();
          setToggleModal(false);
          Swal.fire("Transaction Saved", "", "success");
        })
        .catch((error) => {
          Swal.fire("Error", JSON.stringify(error.response?.data), "error");
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleToggleModel = () => {
    setToggleModal(!toggleModal);
  };

  return (
    <Row>
      <Col>
        <Card>
          <CardBody>
            {isLoading ? (
              <div className=" py-5 text-center" style={{ margin: "15rem 0" }}>
                <Spinner />
              </div>
            ) : (
              <>
                <Row className="align-items-center">
                  <Col lg="auto d-flex align-items-center">
                    <ArrowLeft
                      size="16"
                      onClick={() =>
                        history.push("/inventory/categories/list/")
                      }
                      className="cursor-pointer"
                    />
                    <CardTitle className="mb-0 pr-2 ml-1 border-right">
                      Ledger
                    </CardTitle>
                  </Col>
                </Row>
                <hr />
                <Row className="justify-content-center">
                  <Col md="7">
                    <Select
                      placeholder={<div>Select buyer...</div>}
                      options={buyersData}
                      formatOptionLabel={({ value, label, email }) => {
                        return (
                          <div>
                            <div>{label}</div>
                            <div className="text-lightgray">({email})</div>
                          </div>
                        );
                      }}
                      menuPortalTarget={document.body}
                      menuPlacement="auto"
                      styles={customSelectStyle}
                      value={
                        buyersData.find(
                          (data) => data.value === transactionBuyerInfo
                        ) || ""
                      }
                      onChange={(data) => setTransactionBuyerInfo(data.value)}
                    />
                  </Col>
                  <Col md="3" className="d-flex align-items-center">
                    <Button.Ripple
                      type="button"
                      disabled={!transactionBuyerInfo}
                      outline
                      color="primary"
                      onClick={
                        transactionBuyerInfo
                          ? handleToggleModel
                          : function anyRef() {}
                      }
                    >
                      Add Payment
                    </Button.Ripple>
                  </Col>
                  {!transactionBuyerInfo ? (
                    <Col
                      md="10"
                      className="d-flex align-items-center justify-content-center pt-5 pb-5 h-30"
                    >
                      <h3>No buyer selected, So please select the buyer!</h3>
                    </Col>
                  ) : (
                    <Col
                      md="10"
                      className="d-flex align-items-center flex-column justify-content-center pt-5"
                    >
                      <Table>
                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Description</th>
                            <th>Amount</th>
                            <th>Balance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ledgers?.data?.map((ledger, index) => (
                            <tr key={index}>
                              <td>{formateDate(ledger.created_at)}</td>
                              <td>
                                <DescriptionComponent
                                  ledger={ledger}
                                  userId={props.userId}
                                />
                              </td>
                              <td>{ledger.amount}</td>
                              <td>{ledger.balance}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                      <div>
                        <CustomPagination
                          pageCount={ledgers?.total_pages}
                          initialPage={1}
                          onPageChange={(data) => setPage(data.selected + 1)}
                        />
                      </div>
                    </Col>
                  )}
                </Row>
                <Modal centered isOpen={toggleModal} toggle={handleToggleModel}>
                  <ModalHeader toggle={handleToggleModel}>
                    Add Payment Information <br /> - for ({" "}
                    {
                      buyers?.find(
                        (result) => result.buyer.id === transactionBuyerInfo
                      )?.buyer?.business_name
                    }
                    )
                  </ModalHeader>
                  <ModalBody>
                    <Form onSubmit={handleSubmit}>
                      <FormGroup>
                        <Label for="mode">Mode</Label>
                        <Select
                          options={TransactionMode}
                          menuPortalTarget={document.body}
                          menuPlacement="auto"
                          styles={customSelectStyle}
                          value={
                            TransactionMode.find(
                              (transaction) =>
                                transaction.value === transactionData.mode
                            ) || ""
                          }
                          onChange={(data) =>
                            setTransactionData((prevState) => ({
                              ...prevState,
                              mode: data.value,
                            }))
                          }
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="amount">Amount</Label>
                        <Input
                          type="number"
                          min="1"
                          placeholder="Amount..."
                          value={transactionData?.amount || ""}
                          onChange={(e) =>
                            setTransactionData((prevState) => ({
                              ...prevState,
                              amount: e.target.value,
                            }))
                          }
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label for="remarks"> Remarks </Label>
                        <Input
                          type="text"
                          placeholder="Type something about transaction..."
                          value={transactionData?.remarks || ""}
                          onChange={(e) =>
                            setTransactionData((prevState) => ({
                              ...prevState,
                              remarks: e.target.value,
                            }))
                          }
                        />
                      </FormGroup>
                    </Form>
                  </ModalBody>
                  <ModalFooter>
                    <Button
                      color="primary"
                      type="submit"
                      onClick={handleSubmit}
                    >
                      Save
                    </Button>{" "}
                    <Button onClick={handleToggleModel}>Cancel</Button>
                  </ModalFooter>
                </Modal>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

const mapStateToProps = (state) => {
  return {
    userId: state.auth.userInfo.id,
  };
};

export default connect(mapStateToProps)(Transaction);
