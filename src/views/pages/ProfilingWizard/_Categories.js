import { Component } from "react";
import {
  Row,
  Col,
  Container,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  Button,
  UncontrolledTooltip,
} from "reactstrap";
import { Plus, X, Check, ChevronLeft } from "react-feather";
import Chip from "components/profiling/ChipSelectable";
import apiClient from "api/base";
import {
  RiCheckboxMultipleLine,
  RiCheckboxMultipleBlankLine,
} from "react-icons/ri";

function CategoryEmptyPlaceholder(props) {
  return (
    <>
      <h1 className="text-center mt-5 display-4 text-muted">
        <ChevronLeft size={50} />
        Please select categories of your choice
      </h1>
      <h3 className="text-center mt-5 text-muted">
        You can customize further after selecting categories from here.
      </h3>
    </>
  );
}

class CategoryListItem extends Component {
  render() {
    let isSelected = this.props.isSelected;
    let add_category_btn = isSelected ? (
      <Check size={15} />
    ) : (
      <Plus size={15} onClick={this.removeCard} />
    );
    return (
      <Card className="mb-1">
        <CardBody className="p-1">
          <Row className="align-items-center">
            <Col xs="9" sm="10" md="9 pr-0">
              {this.props.name}
            </Col>
            <Col xs="3" sm="2" md="3">
              <Button.Ripple
                className="rounded-circle btn-icon"
                disabled={isSelected}
                color={isSelected ? "light" : "primary"}
                onClick={this.props.selectCategory}
              >
                {add_category_btn}
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

class CategoryDetailed extends Component {
  render() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{this.props.category.name}</CardTitle>
          <div className="actions">
            <Button.Ripple
              className="rounded-circle btn-icon mr-1"
              id="addAllSubCategories"
              size="sm"
              color="primary"
              onClick={this.props.addAllSubCategories}
            >
              <RiCheckboxMultipleLine />
            </Button.Ripple>
            <UncontrolledTooltip placement="top" target="addAllSubCategories">
              Select All
            </UncontrolledTooltip>

            <Button.Ripple
              className="rounded-circle btn-icon mr-1"
              id="removeAllSubCategories"
              size="sm"
              color="secondary"
              onClick={this.props.removeAllSubCategories}
            >
              <RiCheckboxMultipleBlankLine />
            </Button.Ripple>
            <UncontrolledTooltip
              placement="top"
              target="removeAllSubCategories"
            >
              Unselect All
            </UncontrolledTooltip>

            <Button.Ripple
              className="rounded-circle btn-icon"
              id="removeCategory"
              size="sm"
              color="danger"
              onClick={this.props.removeCategory}
            >
              <X />
            </Button.Ripple>
            <UncontrolledTooltip placement="top" target="removeCategory">
              Remove Category
            </UncontrolledTooltip>
          </div>
        </CardHeader>

        <CardBody>
          {this.props.category.sub_categories.map((subCategory) => {
            return (
              <SubCategory
                name={subCategory.name}
                isSelected={this.props.selectedSubcategories.includes(
                  subCategory.id
                )}
                toggleSelect={() =>
                  this.props.toggleSubcategory(subCategory.id)
                }
                key={subCategory.id}
              />
            );
          })}
        </CardBody>
      </Card>
    );
  }
}

class SubCategory extends Component {
  state = {
    isSelected: true,
  };
  render() {
    let isSelected = this.props.isSelected;
    return (
      <Chip
        color={isSelected ? "primary" : ""}
        text={this.props.name}
        selectable
        className="mr-1"
        isSelected={isSelected}
        onSelectToggle={this.props.toggleSelect}
      />
    );
  }
}

export default class Categories extends Component {
  state = {
    selectedCategories: [],
    selectedSubcategories: [],
    categories: [],
  };

  constructor(props) {
    super(props);
    let apiData = this.props.categoriesData;
    if (apiData) {
      let categories = apiData.categories;
      let selectedSubcategories = apiData.selected_sub_categories;

      this.state.categories = categories;
      this.state.selectedSubcategories = selectedSubcategories;

      let selectedCategories = [];
      selectedSubcategories.forEach((subcat_id) => {
        let category_id = categories.filter((category) =>
          category.sub_categories.map((subcat) => subcat.id).includes(subcat_id)
        )[0]?.id;

        if (category_id && !selectedCategories.includes(category_id)) {
          selectedCategories.push(category_id);
        }
      });
      this.state.selectedCategories = selectedCategories;
    }
  }

  getCategoryFromId = (category_id) =>
    this.state.categories.filter((category) => category.id === category_id)[0];

  toggleSubcategory = (subcategoryId) => {
    let subcategories = this.state.selectedSubcategories;
    this.setState({
      selectedSubcategories: subcategories.includes(subcategoryId)
        ? subcategories.filter((id) => id !== subcategoryId)
        : [...subcategories, subcategoryId],
    });
  };

  addCategory = (categoryId) => {
    let selectedCategories = this.state.selectedCategories;
    if (!selectedCategories.includes(categoryId)) {
      this.setState({
        selectedCategories: [...selectedCategories, categoryId],
      });
    }

    this.addAllSubCategories(categoryId);
  };

  removeCategory = (categoryId) => {
    let selectedCategories = this.state.selectedCategories;
    this.setState({
      selectedCategories: selectedCategories.filter((id) => id !== categoryId),
    });

    this.removeAllSubCategories(categoryId);
  };

  addAllSubCategories = (category_id) => {
    let category = this.getCategoryFromId(category_id);
    let subcategoriesToBeAdded = [];
    category.sub_categories
      .map((subcat) => subcat.id)
      .forEach((subcateg_id) => {
        if (!this.state.selectedSubcategories.includes(subcateg_id)) {
          subcategoriesToBeAdded.push(subcateg_id);
        }
      });
    this.setState({
      selectedSubcategories: [
        ...this.state.selectedSubcategories,
        ...subcategoriesToBeAdded,
      ],
    });
  };

  removeAllSubCategories = (category_id) => {
    let category = this.getCategoryFromId(category_id);

    this.setState({
      selectedSubcategories: this.state.selectedSubcategories.filter(
        (subcat) => !category.sub_categories.map((sc) => sc.id).includes(subcat)
      ),
    });
  };

  saveSelection = (e) => {
    apiClient
      .post("/profile/categories/", {
        sub_categories: this.state.selectedSubcategories,
      })
      .then((response) => {
        this.props.forceStepRefresh ? this.props.forceStepRefresh():this.props.setAddCategory(false)
      });
  };

  render() {
    let selectedSubcategories = this.state.selectedSubcategories;
    let selectedCategories = this.state.selectedCategories;
    let categories = this.state.categories;

    console.log(selectedSubcategories,selectedCategories,categories)

    return (
      <div>
        <Container>
          <h4 className="">Area of Operation</h4>
          <hr />
          <h6 className="text-bold-400 mb-2 text-gray">
            <small>
              Please select the categories your business deals in. You can also
              refine your selection with sub-categories.
            </small>
          </h6>
          <Row>
            <Col md={4} lg={3}>
              {categories.map((category) => {
                return (
                  <CategoryListItem
                    name={category.name}
                    key={category.id}
                    isSelected={selectedCategories.includes(category.id)}
                    selectCategory={() => this.addCategory(category.id)}
                  />
                );
              })}
            </Col>
            <Col md={8} lg={9}>
              {selectedCategories.length > 0 && (
                <>
                  {selectedCategories.map((category_id) => {
                    let category = categories.filter(
                      (cat) => cat.id === category_id
                    )?.[0];
                    return (
                      <CategoryDetailed
                        category={category}
                        selectedSubcategories={selectedSubcategories}
                        toggleSubcategory={this.toggleSubcategory}
                        key={category_id}
                        removeCategory={() => this.removeCategory(category.id)}
                        addAllSubCategories={() =>
                          this.addAllSubCategories(category.id)
                        }
                        removeAllSubCategories={() =>
                          this.removeAllSubCategories(category.id)
                        }
                      />
                    );
                  })}

                  <Button
                    color="primary"
                    size="lg"
                    className="float-right"
                    onClick={this.saveSelection}
                    disabled={this.state.selectedSubcategories.length === 0}
                  >
                    Save
                  </Button>
                </>
              )}
              {selectedCategories.length === 0 && <CategoryEmptyPlaceholder />}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}
