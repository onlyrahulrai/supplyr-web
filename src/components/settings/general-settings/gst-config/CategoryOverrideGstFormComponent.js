import CustomAsyncPaginate from "components/common/CustomAsyncPaginate";
import useGstConfigSettingContext from "context/useGstConfigSettingContext";
import React, { useMemo } from "react";
import {
  Button,
  Row,
  Col,
  CustomInput,
  Card,
  CardHeader,
  CardTitle,
  UncontrolledCollapse,
  CardBody,
  Table,
} from "reactstrap";
import Select from "react-select";
import { ChevronDown } from "react-feather";
import { BsDot } from "react-icons/bs";


const GSTCategoryOptionLabel = (props) => {
  const {state} = useGstConfigSettingContext()
  const addedCategoryDefaultGstRate = useMemo(() => {
    const option = state.override_categories.find((option) => option.category.id === props.id)
    return option ? ` ${option.default_gst_rate}% `: ''
  },[props])
  
  return (
    <div className="d-flex justify-content-between">
      <div className="d-flex align-items-center justify-content-center">
        <span>{props.name}</span> {" "}
        {
          addedCategoryDefaultGstRate ? (
            <BsDot size={24} color="#ea5455" />
          ):null
        }
      </div>
      <span>{addedCategoryDefaultGstRate}</span>
    </div>
  )
}

const CategoryOverrideGstFormComponent = () => {
  const {
    isOverideGSTEnabled,
    setIsOverideGSTEnabled,
    gstOptions,
    onSave,
    state,
    dispatch,
  } = useGstConfigSettingContext();

  const groupedOverrideCategories = useMemo(() => {
    const overrideCategories = state.override_categories.reduce(
      (object, data) => {
        (object[data?.default_gst_rate] =
          object[data?.default_gst_rate] || []).push(data);

        return object;
      },
      Object.create(null)
    );
    return Object.keys(overrideCategories)
      .sort((a, b) => parseInt(a) - parseInt(b))
      .reduce((acc, key) => {
        acc[key] = overrideCategories[key];
        return acc;
      }, Object.create(null));
  }, [state]);

  const onAddCategories = () => {
    const { category: _category, default_gst_rate, ...rest } = state;

    const isCategoryIndexExist = rest.override_categories.findIndex(
      (cate) => cate.category.id === _category.id
    );

    if (isCategoryIndexExist !== -1) {
      const updatedOverrideCategories = state.override_categories.map(
        (object, index) => {
          if (index === isCategoryIndexExist) {
            return { ...object, default_gst_rate: default_gst_rate };
          }
          return object;
        }
      );

      dispatch({
        type: "UPDATE_OVERRIDE_CATEGORY",
        payload: updatedOverrideCategories,
      });
    } else if (state.selectedCategory !== -1) {
      const updatedCategories = state.override_categories.map((cate, index) => {
        if (index === state.selectedCategory) {
          return { ...cate, category: { ...state.category } };
        }
        return cate;
      });

      dispatch({
        type: "UPDATE_OVERRIDE_CATEGORY",
        payload: updatedCategories,
      });
    } else {
      dispatch({
        type: "ADD_OVERRIDE_CATEGORY",
        payload: { category: _category, default_gst_rate },
      });
    }
  };

  const onSelectToEdit = (id) => {
    const categoryIndex = state.override_categories.findIndex(
      (cate) => cate.category.id === id
    );
    if (categoryIndex !== -1) {
      dispatch({ type: "onSelectCategoryToEdit", payload: categoryIndex });
    }
  };

  const onRemoveOverridecategory = (id) => {
    const categoryIndex = state.override_categories.findIndex(
      (cate) => cate.category.id === id
    );
    if (categoryIndex !== -1) {
      const overrideCategoriesAfterRemoved = state.override_categories.filter(
        (category, index) => index !== categoryIndex
      );

      dispatch({
        type: "UPDATE_OVERRIDE_CATEGORY",
        payload: overrideCategoriesAfterRemoved,
      });
    }
  };

  return (
    <Row>
      <Col sm="4"></Col>
      <Col sm="8">
        <Col sm="12" className="mb-1">
          <div className="d-flex align-items-center">
            <span className="switch-label">Add GST Override </span>{" "}
            &nbsp;&nbsp;&nbsp;
            <CustomInput
              type="switch"
              id="override"
              name="override"
              inline
              checked={isOverideGSTEnabled}
              onChange={() => setIsOverideGSTEnabled((prevState) => !prevState)}
            ></CustomInput>
          </div>
          {isOverideGSTEnabled ? (
            <Row className="align-items-center">
              <Col md="6">
                <div className="override">
                  <CustomAsyncPaginate
                    menuPlacement="auto"
                    path="inventory/seller-categories/"
                    getOptionLabel={(props) => props.name}
                    getOptionValue={(props) => props.id}
                    className="my-1 override-category"
                    menuPortalTarget={document.body}
                    formatOptionLabel={(props) => <GSTCategoryOptionLabel {...props} />}
                    styles={{
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                    }}
                    value={state.category}
                    onChange={(data, field) => {
                      dispatch({
                        type: "onChange",
                        payload: { field, data: data },
                      });
                    }}
                    name="category"
                    placeholder="Select Category"
                  />
                </div>
              </Col>
              <Col md="4">
                <Select
                  menuPlacement="auto"
                  className="React"
                  classNamePrefix="select"
                  options={gstOptions}
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                  }}
                  name="default_gst_rate"
                  value={
                    gstOptions.find(
                      (option) => option.value === state.default_gst_rate
                    ) || ""
                  }
                  onChange={(data, field) =>
                    dispatch({
                      type: "onChange",
                      payload: { field, data: data.value },
                    })
                  }
                  placeholder="Select GST Rate"
                />
              </Col>
              <Col
                md="2"
                className="d-flex align-items-center justify-content-center"
              >
                <Button.Ripple
                  type="button"
                  color="primary"
                  onClick={onAddCategories}
                >
                  {state.selectedCategory !== -1 ? "Update" : "Add"}
                </Button.Ripple>
              </Col>
            </Row>
          ) : null}
        </Col>
        <div className="vx-collapse collapse-bordered">
          {state.override_categories.length > 0 ? (
            <div>
              <span>Overide GSTs</span>
              <br />
            </div>
          ) : null}

          {Object.keys(groupedOverrideCategories).map((key, index) => (
            <Card key={`parent-${index}`}>
              <CardHeader id={`item-${index}`}>
                <CardTitle className="lead collapse-title collapsed">
                  <strong>GST {key}%</strong>
                </CardTitle>
                <ChevronDown size={15} className="collapse-icon" />
              </CardHeader>
              <UncontrolledCollapse toggler={`#item-${index}`}>
                <CardBody>
                  <Table className="table-hover-animation" responsive>
                    <thead>
                      <tr>
                        <th>#ID</th>
                        <th>Category Name</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedOverrideCategories[key].map((object, index) => (
                        <tr key={`category-${index}`}>
                          <th scope="row">{object.category.id}</th>
                          <td>{object.category.name}</td>
                          <td>
                            <Button.Ripple
                              type="button"
                              color="info"
                              onClick={() => onSelectToEdit(object.category.id)}
                            >
                              Edit
                            </Button.Ripple>
                            &nbsp;&nbsp;
                            <Button.Ripple
                              type="button"
                              color="warning"
                              onClick={() =>
                                onRemoveOverridecategory(object.category.id)
                              }
                            >
                              Remove
                            </Button.Ripple>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </CardBody>
              </UncontrolledCollapse>
            </Card>
          ))}
        </div>

        <div className="my-2">
          <Button.Ripple type="button" color="primary" onClick={onSave}>
            Save
          </Button.Ripple>
        </div>
      </Col>
    </Row>
  );
};

export default CategoryOverrideGstFormComponent;
