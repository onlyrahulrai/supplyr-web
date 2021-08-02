import Chip from "components/@vuexy/chips/ChipComponent";
import React, { lazy, useState } from "react";
import { Edit, Plus, X } from "react-feather";
import { connect } from "react-redux";
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


const Category = lazy(() => import("../ProfilingWizard/_Categories"))

function CategoryItem({ category, subCategories }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{category}</CardTitle>
      </CardHeader>
      <CardBody>
        {subCategories.map((sc) => (
          <Badge color="primary" className="mr-1 mb-1 badge-glow rounded" key={sc.id}>
            <span>{sc.name}</span>
          </Badge>
        ))}
      </CardBody>
    </Card>
  );
}

const UserCategory = (props) => {
  const sub_categories = props.user.profile.sub_categories;
  const categories_data = props.user.profiling_data.categories_data
  const [addCategory, setAddCategory] = useState(false);

  var obj = sub_categories.reduce((a, c) => {
    if (a[c.category]) a[c.category].push(c);
    else a[c.category] = [c];
    return a;
  }, {});

  return (
    <>
      <Row className="justify-content-end">
        <Col className="d-flex justify-content-end align-items-center">
          {addCategory ? (
            <Button.Ripple color="danger" onClick={() => setAddCategory(false)}>
              <X size={14} className="mr-1" />
              Cancel
            </Button.Ripple>
          ) : (
            <Button.Ripple color="primary" onClick={() => setAddCategory(true)}>
              <Plus size={14} className="mr-1" />
              Add Category
            </Button.Ripple>
          )}
        </Col>
      </Row>

      <hr />

      <Row>
        
        {!addCategory &&
          Object.entries(obj).map(([key, value], i) => (
            <Col sm="6" key={i}>
              <CategoryItem category={key} subCategories={value} />
            </Col>
          ))}
        {addCategory && <Category categoriesData={categories_data} setAddCategory={setAddCategory} />}
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
