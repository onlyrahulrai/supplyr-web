import Chip from "components/@vuexy/chips/ChipComponent";
import React, { lazy, useState } from "react";
import { Edit, Plus, X } from "react-feather";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Col,
  Row,
} from "reactstrap";


const Category = lazy(() => import("../ProfilingWizard/_Categories"));
const CategoryAdd = lazy(() => import("../../inventory/CategoryAdd"));

function CategoryItem({ category, subCategories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardBody>
        {subCategories.map((sc) => (
          <Badge
            color="primary"
            className="mr-1 mb-1 badge-glow rounded"
            key={sc.id}
          >
            <span>{sc.name}</span>
          </Badge>
        ))}
      </CardBody>
    </Card>
  );
}

const CreateCategory = () => {
  return <h3>Create Category</h3>;
};

const UserCategory = (props) => {
  const sub_categories = props.user.profile.sub_categories;
  const categories_data = props.user.profiling_data.categories_data;
  const user = props.user
  const [addCategory, setAddCategory] = useState(false);
  const [createCategory, setCreateCategory] = useState(false);
  const history = useHistory()


  var obj = sub_categories.reduce((a, c) => {
    if (a[c.category]) a[c.category].push(c);
    else a[c.category] = [c];
    return a;
  }, {});

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
                    Edit Category
                  </Button.Ripple>
                </>
              )}
            </>
          )}
        </Col>
      </Row>

      <hr />      

      <Row>
      
        {!addCategory &&
          !createCategory &&
          Object.entries(obj).map(([key, value], i) => (
            <Col sm="6" key={i}>
              <CategoryItem category={key} subCategories={value} />
            </Col>
          ))}
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
      </Row>
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
  };
};

export default connect(mapStateToProps)(UserCategory);
