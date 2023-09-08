import React, { lazy, useState } from "react";
import { Plus, X } from "react-feather";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardColumns,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";


const Category = lazy(() => import("../ProfilingWizard/_Categories"));
const CategoryAdd = lazy(() => import("../../inventory/CategoryAdd"));

function CategoryItem({ category,selected_sub_categories }) {
  console.log()
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category.name}</CardTitle>
      </CardHeader>
      <CardBody>
        {/* {subCategories.map((sc) => (
          <Badge
            color="primary"
            className="mr-1 mb-1 badge-glow rounded"
            key={sc.id}
          >
            <span>{sc.name}</span>
          </Badge>
        ))} */}
        {
          category.sub_categories.map((subCategory) => 
          {
            return (
              <div key={subCategory.id}>
                {
                  selected_sub_categories.includes(subCategory.id) ? <Badge
                  color="primary"
                  className="mr-1 mb-1 badge-glow rounded"
                  key={subCategory.id}
                >
                  <span>{subCategory.name}</span>
                </Badge>:("")
                }
              </div>
            )
          })
        }
      </CardBody>
    </Card>
  );
}


const UserCategory = (props) => {
  // const sub_categories = props.user.profile.sub_categories;
  const categories_data = props.user.profiling_data.categories_data;
  const categories = props.user.profiling_data.categories_data.categories;
  const selected_sub_categories =  props.user.profiling_data.categories_data.selected_sub_categories
  const user = props.user
  const [addCategory, setAddCategory] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const history = useHistory()


  // var obj = sub_categories.reduce((a, c) => {
  //   if (a[c.category] && c.category !== "(Category)") a[c.category].push(c);
  //   else a[c.category] = [c];
  //   return a;
  // }, {});


  let selectedCategories = [];
  selected_sub_categories.forEach((subcat_id) => {
    let category_id = categories_data.categories.filter((category) =>
      category.sub_categories.map((subcat) => subcat.id).includes(subcat_id)
      )[0]?.id;

      if (category_id && !selectedCategories.includes(category_id)) {
          selectedCategories.push(category_id);
      }
    })

  return (
    <>
      <Row className="justify-content-end">
        <Col className="d-flex justify-content-between align-items-center">
          {addCategory ? (
            <>
              <div></div>
              <div>
                <Button.Ripple
                  color="primary"
                  className="mr-1"
                  onClick={() => {
                    history.push("/inventory/categories/add")
                    // setCreateCategory(true);
                    // setAddCategory(false);
                  }}
                >
                  <Plus size={14} className="mr-1" />
                  Create Category
                </Button.Ripple>
                <Button.Ripple
                  color="danger"
                  onClick={() => {
                    setAddCategory(false);
                    setCreateCategory(false);
                  }}
                >
                  <X size={14} className="mr-1" />
                  Cancel
                </Button.Ripple>
              </div>
            </>
          ) : (
            <>
              {createCategory ? (
                <>
                  <Button.Ripple
                    color="danger"
                    onClick={() => {
                      setAddCategory(true);
                      setCreateCategory(false);
                    }}
                  >
                    <X size={14} className="mr-1" />
                    Cancel
                  </Button.Ripple>
                </>
              ) : (
                <>
                  <h3 className="mb-0">Selected Categories</h3>
                  <Button.Ripple
                    color="primary"
                    onClick={() => setAddCategory(true)}
                  >
                    <Plus size={14} className="mr-1" />
                    Edit Categories
                  </Button.Ripple>
                </>
              )}
            </>
          )}
        </Col>
      </Row>

      <hr />      

      <>
        <CardColumns>
          {!addCategory &&
            !createCategory &&
            // Object.entries(obj).map(([key, value], i) => (
            //     <CategoryItem category={key} key={key} subCategories={value} />
            // ))
            selectedCategories.map((category_id,index) => {
              let category = categories.filter((cat) => cat.id === category_id)?.[0]
              return(
                <CategoryItem category={category} key={category_id} selected_sub_categories={selected_sub_categories} />
              )
            })
          }
         </CardColumns>
        {addCategory && (
          <>
            <Category
              user={user}
              categoriesData={categories_data}
              setAddCategory={setAddCategory}
            />
          </>
        )}
        {!addCategory && createCategory && <CategoryAdd />}
      </>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
  };
};

export default connect(mapStateToProps)(UserCategory);
