import React from 'react'
import { Row, Col, Container, Card, CardHeader, CardBody, CardTitle, Button } from 'reactstrap'
import { Plus, X, Check, ChevronLeft } from 'react-feather'
import Avatar from 'components/@vuexy/avatar/AvatarComponent'
import Chip from 'components/profiling/Chip';
import apiClient from 'api/base';

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
    )
}


class CategoryListItem extends React.Component {
  
  render() {
    let isSelected = this.props.isSelected;
    let add_category_btn = isSelected 
                  ? <Check size={15} />
                  : <Plus size={15} onClick={this.removeCard} />
    return (
      <Card className="mb-1">
        <CardBody className="p-1">
          <Row className="align-items-center">
            <Col md="auto mr-auto">{this.props.name}</Col>
            <Col md="auto p-0 pr-1">
              {/* <Avatar color={this.props.isSelected ? '' : 'primary'} icon={add_category_btn} /> */}
              <Button.Ripple className="rounded-circle btn-icon" disabled={isSelected} color={isSelected ? "light" : "primary"} onClick={this.props.selectCategory}>
                {add_category_btn}
              </Button.Ripple>
            </Col>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

class CategoryDetailed extends React.Component {
    render() {
        return (
            <Card
            >
                <CardHeader>
                <CardTitle>{this.props.category.name}</CardTitle>
                <div className="actions">
                    <Button.Ripple className="rounded-circle btn-icon" size="sm" color="danger" onClick={this.props.removeCategory}>
                      <X />
                    </Button.Ripple>
                </div>
                </CardHeader>

                <CardBody>
                    {
                        this.props.category.sub_categories.map(subCategory => {
                            return (
                              <SubCategory
                                name={subCategory.name}
                                isSelected={this.props.selectedSubcategories.includes(
                                  subCategory.id
                                )}
                                toggleSelect={() =>
                                  this.props.toggleSubcategory(subCategory.id)
                                }
                                key = {subCategory.id}
                              />
                            );
                            
                        })
                    }
                </CardBody>
            </Card>
        )
    }
}

class SubCategory extends React.Component {
    state = {
        isSelected: true,
    }
    render() {
        let isSelected = this.props.isSelected
        return (
          <Chip
            color={isSelected ? 'primary': ''}
            text={this.props.name}
            selectable
            className="mr-1"
            isSelected = {isSelected}
            onSelectToggle = {this.props.toggleSelect}
          />
        );
    }
}

export default class Categories extends React.Component {
    state = {
        selectedCategories : [],
        selectedSubcategories: [],
        categories: [],
    }

    componentDidMount() {
      console.log("Mounter")
      apiClient.get('/categories/')
      .then((response) => {
        let data = response.data
        let selectedSubcategories = data?.selected_sub_categories
        let categories = data?.categories

        this.setState({ 
          selectedSubcategories: selectedSubcategories,
          categories: categories
        })

        selectedSubcategories.map()

      })
      .catch(error => {
        console.log(error)
      })
    }
  

    toggleSubcategory = subcategoryId => {
        let subcategories = this.state.selectedSubcategories
        this.setState({
          selectedSubcategories: subcategories.includes(subcategoryId)
                            ? subcategories.filter(id => id !== subcategoryId)
                            : [...subcategories, subcategoryId]
        })
    }


    addCategory = categoryId => {
      let selectedCategories = this.state.selectedCategories
      let selectedSubcategories = this.state.selectedSubcategories
      if (!selectedCategories.includes(categoryId)) {
        this.setState({
          selectedCategories: [...selectedCategories, categoryId],
        });
      }

      let categoryAdded = this.categories.filter(cat => cat.id === categoryId)[0]
      let subcategoriesToBeAdded = categoryAdded.sub_categories
        .filter((subcat) => !selectedSubcategories.includes(subcat.id))
        .map((subcat) => subcat.id);

      this.setState({
        selectedSubcategories: [...selectedSubcategories, ...subcategoriesToBeAdded]
      })
      // categoryAdded.sub_categories.map
    }

    removeCategory = categoryId => {
      let selectedCategories = this.state.selectedCategories
      let selectedSubcategories = this.state.selectedSubcategories
      this.setState({
        selectedCategories: selectedCategories.filter(id => id !== categoryId),
      });

      let categoryRemoved = this.categories.filter(cat => cat.id === categoryId)[0]
      this.setState({
        selectedSubcategories: selectedSubcategories.filter(
          (subcat) =>
            !categoryRemoved.sub_categories
              .map((subcat) => subcat.id)
              .includes(subcat)
        ),
      });
    }



    categories = [
        {
          "id": 4,
          "name": "Computer & Accessories",
          "sub_categories": [
            {
              "id": 1,
              "name": "velit consequat"
            },
            {
              "id": 2,
              "name": "quis ad"
            },
            {
              "id": 3,
              "name": "duis quis"
            },
            {
              "id": 4,
              "name": "anim cupidatat"
            },
            {
              "id": 5,
              "name": "veniam nostrud"
            },
            {
              "id": 6,
              "name": "reprehenderit laborum"
            },
            {
              "id": 7,
              "name": "enim nostrud"
            }
          ]
        },
        {
          "id": 0,
          "name": "Mobile & Accessories",
          "sub_categories": [
            {
              "id": 10,
              "name": "aute sunt"
            },
            {
              "id": 9,
              "name": "id culpa"
            },
            {
              "id": 8,
              "name": "nostrud proident"
            },
            {
              "id": 11,
              "name": "sit velit"
            },
            {
              "id": 12,
              "name": "velit non"
            }
          ]
        },
        {
          "id": 1,
          "name": "Hardware",
          "sub_categories": [
            {
              "id": 13,
              "name": "id fugiat"
            },
            {
              "id": 14,
              "name": "ipsum incididunt"
            },
            {
              "id": 15,
              "name": "in aute"
            },
            {
              "id": 16,
              "name": "ipsum deserunt"
            }
          ]
        },
        {
          "id": 7,
          "name": "Sheri Le",
          "sub_categories": [
            {
              "id": 17,
              "name": "commodo Lorem"
            },
            {
              "id": 18,
              "name": "aliqua occaecat"
            },
            {
              "id": 19,
              "name": "voluptate enim"
            },
            {
              "id": 20,
              "name": "ullamco magna"
            },
            {
              "id": 21,
              "name": "consequat irure"
            },
            {
              "id": 22,
              "name": "officia officia"
            }
          ]
        },
        {
          "id": 5,
          "name": "Rutledge Mcdowell",
          "sub_categories": [
            {
              "id": 23,
              "name": "sit aute"
            },
            {
              "id": 24,
              "name": "laboris aute"
            },
            {
              "id": 25,
              "name": "veniam consequat"
            },
            {
              "id": 26,
              "name": "labore dolor"
            },
            {
              "id": 27,
              "name": "culpa nostrud"
            }
          ]
        },
        {
          "id": 9,
          "name": "Gilbert Bullock",
          "sub_categories": [
            {
              "id": 28,
              "name": "voluptate adipisicing"
            },
            {
              "id": 29,
              "name": "irure amet"
            },
            {
              "id": 30,
              "name": "ut est"
            },
            {
              "id": 31,
              "name": "laboris velit"
            },
            {
              "id": 32,
              "name": "et culpa"
            }
          ]
        }
      ]

    render() {
        let selectedSubcategories = this.state.selectedSubcategories
        let selectedCategories = this.state.selectedCategories
        console.log(selectedSubcategories)
        console.log(selectedCategories)
        console.log('this.state.categories', this.state.categories)

        return (
            <div>
                <Container>
                <h4 className="">Area of Operation</h4>
                <hr />
                <h6 className="text-bold-400 mb-2 text-gray">
                <small>Please select the categories your business deals in. You can also refine your selection with sub-categories.</small>
                </h6>
                    <Row>
                        <Col md={3}>
                        {
                            this.categories.map(category => {
                                return (
                                    <CategoryListItem name={category.name} key={category.id} isSelected={selectedCategories.includes(category.id)} selectCategory={() => this.addCategory(category.id)} />
                                )
                            })
                        }
                        </Col>
                        <Col md={9}>
                            {selectedCategories.length > 0 && 
                                
                                selectedCategories.map(category_id => {
                                    let category = this.categories.filter(cat => cat.id == category_id)?.[0]
                                    {/* let sub_categories = category.sub_categories */}
                                    return (
                                        <CategoryDetailed category={category} selectedSubcategories={selectedSubcategories} toggleSubcategory={this.toggleSubcategory} key={category_id} removeCategory={() => this.removeCategory(category.id)} />
                                    )
                                })
                            }
                            {selectedCategories.length === 0 &&
                              <CategoryEmptyPlaceholder />
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}