import apiClient from "api/base";
import { connect } from "react-redux";
import React, { useEffect, useState } from "react";
import { Card, CardBody, Col, Row, Spinner, Table } from "reactstrap";
import { Delete, Edit2 } from "react-feather";
import Swal from "sweetalert2";
import { history } from "../../history";
import NetworkError from "components/common/NetworkError";

const CategoryList = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingError, setLoadingError] = useState(null);
  const [categories, setCategories] = useState([]);
  const seller = props.user.name;

  useEffect(() => {
    apiClient
      .get("/inventory/categories")
      .then((response) => {
        const categories = response.data;
        setCategories(categories);
      })
      .catch((error) => {
        setLoadingError(error.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  function deleteCategory(id) {
    const category = categories.find((c) => c.id === id);
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete category!",
    }).then((result) => {
      if (result.value) {
        apiClient.delete("/inventory/categories/" + id).then((response) => {
          if (response.status === 204) {
            setCategories(categories.filter((cat) => cat.id !== id));
            Swal.fire(`Category Deleted: ${category.name}`);
          }
        });
      }
      return false;
    });

    apiClient.delete("/inventory/categories/" + id).then((response) => {
      console.log(response);
    });
  }

  function deleteSubCategory(id){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete category!",
    }).then((result) => {
      if (result.value) {
        apiClient.delete("/inventory/categories/" + id).then((response) => {
          if (response.status === 204) {
            Swal.fire(`Sub-Category Deleted`);
            window.location.reload()
          }
        });
      }
      return false;
    });

    apiClient.delete("/inventory/categories/" + id).then((response) => {
      console.log(response);
    });
  }



  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              {isLoading && <Spinner />}
              {!isLoading && loadingError && (
                <NetworkError error={loadingError} />
              )}
              {!isLoading && categories && (
                <Table responsive bordered>
                  <thead>
                    <tr>
                      <th>Secret Id</th>
                      <th>Category Name</th>
                      <th>No. of product</th>
                      <th>Type.</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.map((category, index) => (
                      <>
                        <tr key={category.id}>
                          <td className="text-bold-600">{index + 1}</td>
                          <td className="text-bold-600">{category.name}</td>
                          <td className="text-bold-600">{category.no_of_product || "NA"}</td>
                          <td className="text-bold-600 text-capitalize">{category.action}</td>
                          <td>
                            <Edit2
                              size="16"
                              className="mr-1 cursor-pointer"
                              onClick={() =>
                                history.push(
                                  "/inventory/categories/edit/" + category.id
                                )
                              }
                            />
                            <Delete
                              size="16"
                              onClick={() => deleteCategory(category.id)}
                              className="cursor-pointer"
                            />
                          </td>
                        </tr>
                     
                        {category.sub_categories.map((sub_category, pos) => (
                          <tr key={sub_category.id}>
                            <td>
                              <span className="ml-2">{`${index + 1}.${
                                pos + 1
                              }`}</span>
                            </td>
                            <td>
                              <span className="ml-2">{sub_category.name}</span>
                            </td>
                            <td>
                              <span className="ml-2">{sub_category.no_of_product || "NA"}</span>
                            </td>
                            <td>
                              <span className="ml-2 text-capitalize">{sub_category.action || "NA"}</span>
                            </td>
                            <td>
                              <Edit2
                                size="16"
                                className="mr-1 cursor-pointer"
                                onClick={() =>
                                  history.push(
                                    "/inventory/categories/edit/" +
                                      sub_category.id
                                  )
                                }
                              />
                              <Delete
                                size="16"
                                onClick={() => deleteSubCategory(sub_category.id,index)}
                                className="cursor-pointer"
                              />
                            </td>
                          </tr>
                        ))}
                   
                      </>
                    ))}
                  </tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
  };
};

export default connect(mapStateToProps)(CategoryList);
