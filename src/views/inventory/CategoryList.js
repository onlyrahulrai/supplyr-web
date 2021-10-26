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

  function deleteSubCategory(categoryId,subcategoryId){
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete Subcategory!",
    }).then((result) => {
      if (result.value) {
        setIsLoading(true)
        apiClient.delete("/inventory/categories/" + subcategoryId).then((response) => {
          if (response.status === 204) {
            Swal.fire(`Subcategory Deleted successfully!`);
            const _categoriesCopy = categories
            _categoriesCopy[categoryId].sub_categories =  categories[categoryId].sub_categories.filter((sub_categories) => sub_categories.id !== subcategoryId)
            setCategories(_categoriesCopy)
            setIsLoading(false)
          }
        });
      }
      return false;
    });

    apiClient.delete("/inventory/categories/" + subcategoryId).then((response) => {
      console.log(response);
    });
  }


  console.log(categories)

  return (
    <>
      <Row>
        <Col sm="12">
          <Card>
            <CardBody>
              {isLoading && (
                <div className=" py-5 text-center" style={{margin:"10rem 0"}}>
                  <Spinner />
                </div>
              )}
              {!isLoading && loadingError && (
                <NetworkError error={loadingError} />
              )}

                {
                  !isLoading && categories.length === 0 && (
                    <h4 className="text-center mb-0">Their are no categories to be shown.</h4>
                  )
                }

              {!isLoading && categories.length > 0 && (
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
                    {categories.map((category, categoryId) => (
                      <>
                        <tr key={category.id}>
                          <td className="text-bold-600">{categoryId + 1}</td>
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
                          <tr key={categoryId + sub_category.id}>
                            <td>
                              <span className="ml-2">{`${categoryId + 1}.${
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
                                onClick={() => deleteSubCategory(categoryId,sub_category.id)}
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
