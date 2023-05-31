import { useState, useEffect } from "react";
import {
  Button,
  Col,
  Row,
  FormGroup,
  Label,
  Card,
  CardBody,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  UncontrolledTooltip,
  Spinner,
  Alert,
} from "reactstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "assets/scss/plugins/extensions/editor.scss";
import Radio from "components/@vuexy/radio/RadioVuexy";
import RichEditor from "./_RichEditor";
import UploadGallery from "components/inventory/UploadGallery";
import classnames from "classnames";
import {
  Plus,
  Edit,
  X,
  Trash2,
  XCircle,
  Info,
  CheckCircle,
  Copy,
} from "react-feather";
import Chip from "components/@vuexy/chips/ChipComponent";
import MultipleOptionsInput from "components/inventory/MultipleOptionsInput";
import CreatableOptionsSelect from "components/inventory/CreatableOptionsSelect";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "assets/scss/inventory/add-product.scss";
import cloneGenerator from "rfdc";
import _Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import apiClient from "api/base";
import { history } from "../../history";
import ImagePicker from "components/inventory/react-image-picker";
import Select from "react-select";
import { connect } from "react-redux";
import { SimpleInputField } from "components/forms/fields";
import BreadCrumb from "components/@vuexy/breadCrumbs/BreadCrumb";

import CreatableSelect from "react-select/creatable";
import { CountryData } from "../../assets/data/CountryData";
import Translatable from "components/utils/Translatable";

const Swal = withReactContent(_Swal);

const clone = cloneGenerator();
const listFormatter = new Intl.ListFormat("en", {
  style: "long",
  type: "conjunction",
});

function areArraysEqual(array1, array2) {
  if (array1.length !== array2.length) return false;
  return array1.every((item, index) => item === array2[index]);
}

function VariantFields(props) {
  const variantData = props.variantData;

  const applyMinumumQuantityToAllVariants = () => {
    Swal.fire({
      // title: 'Are you sure?',
      text: "Apply this minimum quantity to all variants?",
      icon: "warning",
      showCancelButton: true,
      // confirmButtonColor: '#83d',
      confirmButtonText: "Confirm",
    }).then((result) => {
      if (result.value) {
        props.onChangeAll(
          "minimum_order_quantity",
          variantData.minimum_order_quantity
        );
      }
    });
  };

  console.log(variantData);

  return (
    <>
      <Row>
        <Col>
          <SimpleInputField
            label="Sale Price"
            name="price"
            step="0.01"
            type="number"
            onChange={(e) => props.onChange("price", e.target.value)}
            value={variantData.price ?? ""}
            min="0"
            requiredIndicator
            required={props.singleVariant}
          />
        </Col>
        <Col>
          <SimpleInputField
            label="Actual Price"
            name="actual_price"
            type="number"
            step="0.01"
            min="0"
            onChange={(e) => props.onChange("actual_price", e.target.value)}
            requiredIndicator
            required={props.singleVariant}
            value={variantData.actual_price ?? ""}
          />
        </Col>
      </Row>

      {parseFloat(variantData.sale_price) > parseFloat(variantData.price) && (
        <Alert color="warning">
          <Info size={20} /> <b>Warning:</b> Sale price should be lower than or
          equal to actual price.
        </Alert>
      )}

      <SimpleInputField
        // label="Quantity Available"
        label={<Translatable text="quantity" />}
        placeholder="Quantity Available in Inventory"
        name="quantity"
        type="number"
        onChange={(e) => props.onChange("quantity", e.target.value)}
        requiredIndicator
        required={props.singleVariant}
        value={variantData.quantity ?? ""}
        min="0"
      />

      <Row>
        <Col>
          <SimpleInputField
            // label="Minimum Order Quantity"
            label={<Translatable text="quantity" prefix="Minimum Order" />}
            name="minumum_order_quantity"
            type="number"
            onChange={(e) =>
              props.onChange("minimum_order_quantity", e.target.value)
            }
            value={variantData.minimum_order_quantity ?? 1}
            min="1"
          />
        </Col>
        {!props.singleVariant && (
          <Col md={3} xs={4} className="align-self-center">
            <Button
              outline
              color="dark"
              className="btn-block"
              onClick={applyMinumumQuantityToAllVariants}
            >
              Apply to all
            </Button>
          </Col>
        )}
      </Row>
      {parseInt(variantData.minimum_order_quantity) >
        parseInt(variantData.quantity) && (
        <Alert color="warning">
          <Info size={20} /> The product will be shown <b>Out of Stock</b>,
          since minimum order quantity is more than quantity available.
        </Alert>
      )}
    </>
  );
}

function SingleVariantForm(props) {
  const [variantData, setVariantData] = useState({});

  function setVariantFieldData(field, value) {
    let variantsDataCopy = { ...variantData };
    if (value) {
      variantsDataCopy[field] = value;
    } else delete variantsDataCopy[field]; // Otherwise backend is throwing error
    setVariantData(variantsDataCopy);
    props.onChange(variantsDataCopy);
  }

  useEffect(() => {
    if (props.initialVariantData) {
      // setVariantData({...variantData, ...props.initialVariantData})
      const initialVariantData = props.initialVariantData;
      let _variantData = {};
      Object.keys(initialVariantData).forEach((key) => {
        if (initialVariantData[key] !== undefined) {
          _variantData[key] = initialVariantData[key];
        }
      });
      setVariantData(_variantData);
      props.onChange(_variantData);
    }
    // eslint-disable-next-line
  }, [props.initialVariantData]);

  return (
    <VariantFields
      onChange={(field, value) => setVariantFieldData(field, value)}
      singleVariant
      variantData={variantData}
    />
  );
}

function VariantTabs(props) {
  const [activeTab, setActiveTab] = useState(0);

  const toggleTab = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  useEffect(() => {
    //On adding a new variant, switch tab to this new variant
    const addedTabIndex = props.variantsData.length - 1;
    toggleTab(addedTabIndex);
    // eslint-disable-next-line
  }, [props.variantsData.length]);

  useEffect(() => {
    if (props.variantsData.length === 0) {
      props.addVariant();
    }
    // eslint-disable-next-line
  }, []);

  // function setTabOptionFieldData()

  return (
    <>
      <Card>
        <CardBody>
          <div className="nav-vertical">
            <Nav tabs className="nav-left">
              {props.variantsData.map((tab, tabIndex) => {
                let tab_name = [
                  tab.option1_value,
                  tab.option2_value,
                  tab.option3_value,
                ]
                  .filter((o) => o !== undefined)
                  .join("/");

                let tabStatusIcon = undefined;
                let tabStatusIconTooltip = undefined;

                if (tab.errors?.duplicate_variant) {
                  tabStatusIcon = <Copy color="tomato" size="16" />;
                  tabStatusIconTooltip =
                    "Duplicate Variant. Please either change or remove one of the copies.";
                } else if (tab.errors?.unfilled_required_fields) {
                  tabStatusIcon = <Info color="darkkhaki" size="16" />;
                  tabStatusIconTooltip =
                    "Please fill all the required data (marked with *)";
                } else {
                  tabStatusIcon = <CheckCircle color="green" size="16" />;
                }

                let tabStatusIconWrap = (
                  <>
                    <div id={`error-tab-${tabIndex}`} className="mr-1 d-inline">
                      {tabStatusIcon}
                    </div>
                    {tabStatusIconTooltip && (
                      <UncontrolledTooltip
                        placement="left"
                        target={`error-tab-${tabIndex}`}
                      >
                        {tabStatusIconTooltip}
                      </UncontrolledTooltip>
                    )}
                  </>
                );

                return (
                  <NavItem key={tabIndex}>
                    <NavLink
                      className={classnames(
                        {
                          active: activeTab === tabIndex,
                        },
                        "d-flex align-items-center variantListItem"
                      )}
                      onClick={() => {
                        toggleTab(tabIndex);
                      }}
                    >
                      <div className="flex-grow-1">
                        {tabStatusIconWrap}
                        {tab_name || "New Variant"}
                      </div>
                      <div className="variantRemoveIcon">
                        <XCircle
                          size="15"
                          color="lightcoral"
                          className="invisible ml-1"
                          onClick={(e) => props.removeVariant(tabIndex)}
                        />
                      </div>
                    </NavLink>
                  </NavItem>
                );
              })}

              <NavItem>
                <NavLink className="pb-0">
                  <Button.Ripple
                    size="sm"
                    className="btn-icon"
                    color="flat-secondary"
                    onClick={(e) => {
                      props.addVariant();
                    }}
                  >
                    <Plus size={14} /> Add
                  </Button.Ripple>
                </NavLink>
              </NavItem>
            </Nav>
            <TabContent activeTab={activeTab}>
              {props.variantsData.map((variant, tabIndex) => {
                let featuredImage =
                  variant.featured_image &&
                  props.productImages.find(
                    (image) => image.db_id === variant.featured_image
                  )?.source;
                return (
                  <TabPane tabId={tabIndex} key={tabIndex}>
                    <Row className="">
                      {props.options.map((option, optionIndex) => {
                        return (
                          <Col key={optionIndex}>
                            <SimpleInputField
                              label={option.title}
                              requiredIndicator
                              field={
                                <CreatableOptionsSelect
                                  defaultOptions={option.values}
                                  defaultValue={
                                    variant[`option${optionIndex + 1}_value`]
                                  }
                                  onChange={(value) =>
                                    props.setVariantFieldData(
                                      tabIndex,
                                      `option${optionIndex + 1}_value`,
                                      value
                                    )
                                  }
                                  onNewValueCreation={(value) =>
                                    props.addToVariantOptionValues(
                                      optionIndex,
                                      value
                                    )
                                  }
                                />
                              }
                            />
                          </Col>
                        );
                      })}
                    </Row>
                    <hr />

                    <VariantFields
                      onChange={(field, value) =>
                        props.setVariantFieldData(tabIndex, field, value)
                      }
                      onChangeAll={props.setAllVariantsFieldData}
                      variantData={props.variantsData[tabIndex]}
                    />
                    {props.productImages &&
                      Boolean(props.productImages.length) && (
                        <div className="mb-1">
                          <h6>Select a featured image for variant</h6>
                          <ImagePicker
                            images={props.productImages.map((image) => ({
                              src: image.source,
                              index: image.db_id,
                            }))}
                            onPick={(images, last_image, is_removed) => {
                              let picked_image = images[0];
                              if (!picked_image && is_removed) {
                                props.setVariantFieldData(
                                  tabIndex,
                                  "featured_image",
                                  undefined
                                );
                              } else {
                                props.setVariantFieldData(
                                  tabIndex,
                                  "featured_image",
                                  picked_image.index
                                );
                              }
                            }}
                            multiple={false}
                            picked={featuredImage ? [featuredImage] : []}
                          />
                        </div>
                      )}
                    <div className="container">
                      <Row>
                        <Col sm="auto mr-auto">
                          <Button.Ripple
                            color="info"
                            onClick={props.addVariant}
                          >
                            <Plus size="18" /> Add Another Variant
                          </Button.Ripple>
                        </Col>
                        <Col sm="auto">
                          <Button.Ripple
                            color="danger"
                            onClick={(e) => props.removeVariant(tabIndex)}
                          >
                            <Trash2 size="18" /> Remove Variant
                          </Button.Ripple>
                        </Col>
                      </Row>
                    </div>
                  </TabPane>
                );
              })}
            </TabContent>
          </div>
        </CardBody>
      </Card>
    </>
  );
}

function MultipleVariantForm(props) {
  const [options, setOptions] = useState([{}]);
  const [variantOptionsEditable, setVariantOptionsEditable] = useState(true);

  useEffect(() => {
    // To populate the variants data in case user is editing an existing product
    if (props.initialVariantsData) {
      //Populate variant fields
      const initialVariantsData = props.initialVariantsData.map(
        (initialVariantData) => {
          let _variantData = {};
          Object.keys(initialVariantData).forEach((key) => {
            if (initialVariantData[key] !== undefined) {
              _variantData[key] = initialVariantData[key];
            }
          });
          return _variantData;
        }
      );
      setVariantsData(initialVariantsData);

      //Populate option fields
      let _options = [];
      const first_variant = props.initialVariantsData[0];
      for (let i = 1; i <= 3; i++) {
        const ith_option_name = first_variant["option" + i + "_name"];
        if (ith_option_name) {
          let _option = {
            title: ith_option_name,
          };
          _options.push(_option);
        }
      }

      _options = _options.map((_option, optionIndex) => {
        const _optionValues = new Set();
        initialVariantsData.forEach((variant) => {
          _optionValues.add(variant["option" + (optionIndex + 1) + "_value"]);
        });
        _option["values"] = [..._optionValues];
        return _option;
      });
      setTimeout(() => setOptions(_options), 0); // To defer the execution to next event loop, in order to avoid conflict setting state.
      //What happened was, Options was not getting set due to other call (props.onChange?) overwriting the change in the parent component

      if (initialVariantsData) {
        setVariantOptionsEditable(false);
      }
    }
  }, [props.initialVariantsData]);

  function setVariantOptionTitle(optionIndex, title) {
    let optionsCopy = [...options];
    optionsCopy[optionIndex]["title"] = title;
    if (optionsCopy[optionIndex].errors?.title) {
      optionsCopy[optionIndex]["errors"]["title"] = undefined;
    }
    setOptions(optionsCopy);
  }
  function setVariantOptionValues(optionIndex, values) {
    let optionsCopy = [...options];

    let updated_values = values.map((value) => value.trim());
    optionsCopy[optionIndex]["values"] = updated_values;
    if (optionsCopy[optionIndex].errors?.values) {
      optionsCopy[optionIndex]["errors"]["values"] = undefined;
    }
    setOptions(optionsCopy);
  }
  function addToVariantOptionValues(optionIndex, value) {
    //Called when new option is created inside the variant edit form
    let current_values = options[optionIndex]["values"];
    setVariantOptionValues(optionIndex, [...current_values, value]);
  }

  function addVariantOption() {
    if (options.length < 3) setOptions([...options, {}]);
  }

  function removeVariantOption(optionIndex) {
    let optionsCopy = [...options];
    optionsCopy.splice(optionIndex, 1);
    setOptions(optionsCopy);
  }

  useEffect(() => {
    props.setOptions(options.map((o) => o.title));
  }, [options.map((o) => o.title).join()]);

  function freezeVariantOptions() {
    const optionsCopy = [...options];
    let error_count = 0;
    options.forEach((option, optionIndex) => {
      let errors = {};
      if (option.title === undefined || option.title.trim().length === 0) {
        errors["title"] = "You must enter a title";
      } else if (
        options.filter(
          (opt, ind) =>
            opt.title?.trim() === option.title.trim() && ind !== optionIndex
        ).length > 0
      ) {
        errors["title"] =
          "This value is repeated. Please either change or remove one of the duplicates";
      }
      if (option.values === undefined || option.values.length === 0) {
        errors["values"] = "You must enter at least one possible value";
      }
      if (Object.keys(errors).length > 0) {
        //TODO: Remove this check?
        error_count++;
      }
      optionsCopy[optionIndex].errors = errors;
    });
    setOptions(optionsCopy);
    if (error_count === 0) {
      setVariantOptionsEditable(false);
    }
  }

  const options_filtered = options.filter((p) => {
    if (p === undefined || Object.keys(p).length === 0) return false;
    if (!p.title) return false;
    return true;
  });

  const [variantsData, setVariantsData] = useState([]);

  useEffect(() => {
    checkDuplicateVariants();
  }, [
    variantsData
      .map((v) => [v.option1_value, v.option2_value, v.option3_value].join("|"))
      .join(),
    options,
  ]); //Options is added here because options are getting set at a later stage (next event loop iteration), hence, the duplicate check initially was faulty
  /*
    The above effect will ensure that it only runs whenever any 'option' value changes
    */

  useEffect(() => {
    validateAllVariantsRequiredFields();

    let variantsDataFiltered = variantsData.filter(
      (d) => Object.keys(d).length !== 0
    ); //Filter out empty tabs
    props.onChange(variantsDataFiltered);
    // eslint-disable-next-line
  }, [variantsData]);

  function checkDuplicateVariants() {
    let variantsDataCopy = clone(variantsData);
    variantsData.forEach((variant_data, index) => {
      let option_values = getVariantOptionsData(variant_data);
      let is_duplicate = variantsData.some((_variant_data, _index) => {
        return (
          index !== _index &&
          areArraysEqual(option_values, getVariantOptionsData(_variant_data)) &&
          !option_values.every((value) => value === undefined)
        );
      });
      if (is_duplicate) {
        variantsDataCopy[index]["errors"] = {
          ...variantsDataCopy[index]["errors"],
          duplicate_variant: true,
        };
      } else {
        delete variantsDataCopy[index].errors?.duplicate_variant;
      }
    });

    if (JSON.stringify(variantsData) !== JSON.stringify(variantsDataCopy)) {
      setVariantsData(variantsDataCopy);
    }
  }

  function setVariantFieldData(tabIndex, field, value) {
    let variantsDataCopy = [...variantsData];
    if (value) {
      variantsDataCopy[tabIndex][field] = value;
    } else delete variantsDataCopy[tabIndex][field];

    setVariantsData(variantsDataCopy);
  }

  function setAllVariantsFieldData(field, value) {
    setVariantsData(variantsData.map((vd) => ({ ...vd, [field]: value })));
  }

  function getVariantOptionsData(variant_data) {
    // let variant_data = variantsData[tabIndex]

    let variant_options_data = [];
    options.forEach((option, index) => {
      //So that only countd number of options get pushed each variant
      variant_options_data.push(
        variant_data["option" + (index + 1) + "_value"]
      );
    });
    return variant_options_data; //TODO: filter undefined
  }

  function getNextPossibleVairantOptions() {
    const existing_variants_options_data = variantsData.map((variant) =>
      getVariantOptionsData(variant)
    );
    const options_count = options.length;

    if (options_count === 1) {
      let leaf_value = options[0].values.find((value) => {
        let is_unused = !existing_variants_options_data.some((values) =>
          areArraysEqual(values, [value])
        );
        return is_unused;
      });
      if (leaf_value) return [leaf_value];
    } else {
      for (const value1 of options[0].values) {
        if (options_count === 2) {
          let leaf_value = options[1].values.find((value2) => {
            let is_unused = !existing_variants_options_data.some((values) =>
              areArraysEqual(values, [value1, value2])
            );
            return is_unused;
          });
          if (leaf_value) return [value1, leaf_value];
        } else {
          //options_count = 3
          for (const value2 of options[1].values) {
            let leaf_value = options[2].values.find((value3) => {
              let is_unused = !existing_variants_options_data.some((values) =>
                areArraysEqual(values, [value1, value2, value3])
              );

              return is_unused;
            });
            if (leaf_value) return [value1, value2, leaf_value];
          }
        }
      }
    }
    return [];
  }

  function addVariant() {
    const nextSuggestedOptions = getNextPossibleVairantOptions();
    const optionsDict = {};
    nextSuggestedOptions.forEach((value, index) => {
      optionsDict["option" + (index + 1) + "_value"] = value;
    });
    setVariantsData([...variantsData, { ...optionsDict }]);
  }

  function removeVariant(index) {
    if (variantsData.length <= 1) {
      toast.error("You must have at least one variant.", {
        position: "bottom-center",
        toastId: "varaint_remove_error",
      });
      return;
    }

    let variantsDataCopy = [...variantsData];
    variantsDataCopy.splice(index, 1);
    setVariantsData(variantsDataCopy);
  }

  function validateVariantRequiredFields(variantData) {
    const required_fixed_fields = ["price", "quantity"];
    if (required_fixed_fields.some((field_name) => !variantData[field_name])) {
      return false;
    }

    if (
      options.some(
        (option, index) => !variantData["option" + (index + 1) + "_value"]
      )
    ) {
      return false;
    }

    return true;
  }

  function validateAllVariantsRequiredFields() {
    let variantsDataCopy = clone(variantsData);
    variantsData.forEach((variant, index) => {
      let validates = validateVariantRequiredFields(variant);
      if (!validates) {
        variantsDataCopy[index]["errors"] = {
          ...variantsDataCopy[index]["errors"],
          unfilled_required_fields: true,
        };
      } else {
        delete variantsDataCopy[index].errors?.unfilled_required_fields;
      }
    });

    if (JSON.stringify(variantsData) !== JSON.stringify(variantsDataCopy)) {
      setVariantsData(variantsDataCopy);
    }
  }

  return (
    <>
      <h2>Variants Information</h2>
      <hr />
      {variantOptionsEditable && (
        <>
          <h5>
            On what parameters you want to distinguish between your variants
            (eg., Size, Color, Weight)?
          </h5>
          <small>You can select upto 3 options</small>
          <div>
            {options.map((option, index) => {
              return (
                <div key={index}>
                  <hr />
                  <h4 className="mt-1 mb-2">
                    Option {index + 1}
                    {options.length > 1 && (
                      <Button
                        className="float-right btn-icon rounded-circle"
                        color="secondary"
                        title="Remove Option"
                        onClick={(e) => removeVariantOption(index)}
                      >
                        <X />
                      </Button>
                    )}
                  </h4>
                  <Row>
                    <Col md="3">
                      <SimpleInputField
                        type="text"
                        name="param1"
                        label="Option Title"
                        placeholder="Enter option title, like 'Color'"
                        value={option.title ?? ""}
                        error={option.errors?.title}
                        onChange={(e) =>
                          setVariantOptionTitle(index, e.target.value)
                        }
                        maxLength="50"
                      />
                    </Col>
                    <Col md="9">
                      <SimpleInputField
                        label="Possible Values"
                        field={
                          <MultipleOptionsInput
                            onChange={(values) => {
                              setVariantOptionValues(index, values);
                            }}
                            values={option.values}
                            placeholder="Enter possible values and press Enter, eg. 'Brown'"
                            className={classnames({
                              "is-invalid": option.errors?.values,
                            })}
                          />
                        }
                        error={option.errors?.values}
                        required
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}

            <Row>
              {options.length < 3 && (
                <Col sm="auto">
                  <Button className="mr-1" onClick={addVariantOption}>
                    Add Option
                  </Button>
                </Col>
              )}
              <Col sm="auto ml-auto">
                <Button color="primary" onClick={freezeVariantOptions}>
                  Next
                </Button>
              </Col>
            </Row>
          </div>
        </>
      )}
      {!variantOptionsEditable && (
        <>
          <h6>Custom Parameters Selected</h6>
          <div className="mb-1">
            {options_filtered.map((param, i) => (
              <Chip
                color="info"
                className="mr-1 mb-0"
                text={param.title}
                key={i}
              />
            ))}
            <Button
              color="primary"
              className="btn-icon btn-round"
              size="sm"
              onClick={(e) => setVariantOptionsEditable(true)}
            >
              <Edit />{" "}
            </Button>
          </div>

          <h6>Variants Information</h6>
          <VariantTabs
            options={options_filtered}
            setVariantFieldData={setVariantFieldData}
            setAllVariantsFieldData={setAllVariantsFieldData}
            addVariant={addVariant}
            removeVariant={removeVariant}
            variantsData={variantsData}
            addToVariantOptionValues={addToVariantOptionValues}
            productImages={props.productImages}
          />
        </>
      )}
    </>
  );
}

function AddProduct(props) {
  const [isMultiVariant, setIsMultiVariant] = useState("no");

  const [basicData, setBasicData] = useState({ title: "", tags: [] }); //This title has been given to eleminate 'Uncontrolled to controlled' error in console
  const [variantsDataContainer, setVariantsDataContainer] = useState({});
  const [productImages, setProductImages] = useState([]);
  const [initialData, setInitialData] = useState(null);

  const productSlug = props.match.params.slug;
  const isEditingExistingProduct = Boolean(props.match.params.slug);
  const [isProductDataLoaded, setIsProductDataLoaded] = useState(false); // For editing existing product

  const [tags, setTags] = useState([...props.profile.tags]);
  const [vendors, setVendors] = useState([...props.profile.vendors]);
  const [country] = useState([...CountryData]);
  const [allowInventoryTracking, setAllowInventoryTracking] = useState("no");
  const [allowOverselling, setAllowOverselling] = useState("no");

  const weightUnit = [
    { value: "mg", label: "Milligram" },
    { value: "kg", label: "kilogram" },
    { value: "gm", label: "Gram" },
  ];

  const isPageRenderReady = !isEditingExistingProduct || isProductDataLoaded;

  useEffect(() => {
    //In case of Edit an existing product, initialize the fields on the first time component render
    if (productSlug) {
      const url = "inventory/product/" + productSlug;
      apiClient.get(url).then((response) => {
        setInitialData(response.data);
        const initialBasicFieldsData = {
          title: response.data.title,
          description: response.data.description,
          id: response.data.id,
          tags: response.data.tags,
          vendors: response.data.vendors,
          country: response.data.country,
          weight_unit: response.data.weight_unit,
          weight_value:
            response.data.weight_unit === "kg"
              ? parseFloat(response.data.weight_value) / 1000
              : response.data.weight_unit === "mg"
              ? parseFloat(response.data.weight_value) * 1000
              : response.data.weight_value,
          sub_categories: response.data.sub_categories.map((sc) => sc.id),
        };
        setBasicData(initialBasicFieldsData);
        setAllowOverselling(response.data.allow_overselling ? "yes" : "no")
        setAllowInventoryTracking(response.data.allow_inventory_tracking ? "yes" : "no")
        setIsMultiVariant(response.data.variants_data.multiple ? "yes" : "no");
        setIsProductDataLoaded(true);
      });
    } else if (initialData) {
      // If someone has opened add product page just after edit page of some product, we need to clear the data, because edit & add, both are using same components and data is retained if moving from edit -> add product.
      window.location.reload();
    }
  }, [productSlug]);

  function setBasicFieldData(field, value) {
    let basicDataCopy = { ...basicData };
    basicDataCopy[field] = value;
    setBasicData(basicDataCopy);
  }

  let formData = {
    ...basicData,
    images: productImages.map((image) => image.db_id),
    variants_data: variantsDataContainer,
    allow_inventory_tracking:allowInventoryTracking === "yes" ? true : false,
    allow_overselling:allowOverselling === "yes" ? true : false,
  };

  function validateForm() {
    console.log("basic data >>>> ",basicData)
    let variantsData = variantsDataContainer;
    let errors = [];
    
    if (!basicData.sub_categories?.length) {
      errors.push("Please add at least one category");
    }

    if(basicData?.weight_value && basicData?.weight_value !== "0.00"){
      if(!basicData?.weight_unit){
        errors.push("Please select the weight unit field!");
      }
    }
    
    if (variantsData.multiple === undefined) {
      errors.push("Add variant information");
    }
    if (variantsData.multiple === true) {
      if (variantsData.options?.length === 0) {
        errors.push("Add options to customize your variants");
      } else if (!variantsData.data || variantsData.data.length === 0) {
        errors.push("Add information for at least one variant");
      }
      let duplicates = variantsData.data
        .filter((v) => v.errors?.duplicate_variant)
        .map((v) =>
          [v.option1_value, v.option2_value, v.option3_value]
            .filter(Boolean)
            .join("/")
        );
      if (duplicates.length) {
        errors.push(
          "Please Remove Duplicate Variants: " +
            listFormatter.format(new Set(duplicates))
        );
      }

      let unfilled_fields = variantsData.data
        .filter((v) => v.errors?.unfilled_required_fields)
        .map(
          (v) =>
            [v.option1_value, v.option2_value, v.option3_value]
              .filter(Boolean)
              .join("/") || "New Variants"
        );
      if (unfilled_fields.length) {
        errors.push(
          "Please Fill all required data in the variants: " +
            listFormatter.format(new Set(unfilled_fields))
        );
      }
    }

    if (errors.length > 0) {
      Swal.fire(
        <div>
          <h1>Error !</h1>
          <h4 className="mb-1">Please correct the following errors</h4>
          {errors.map((error) => {
            return <h6 className="text-danger">{error} </h6>;
          })}
        </div>
      );

      return false;
    } else return true;
  }

  function submitForm(e) {
    e.preventDefault();
    let is_valid = validateForm();
    if (is_valid) {
      Swal.fire({
        title: (
          <div className="mt-3 mb-1">
            <h2 className="text-success">All done !!</h2>
            <h3 className="text-secondary">
              <Spinner color="secondary" className="mr-1" />
              Saving your product
            </h3>
          </div>
        ),
        buttons: false,
        closeOnClickOutside: false,
        icon: "success",
      });
      console.log("form data >>>> ", formData);
      const url = "inventory/add-product/";
      apiClient
        .post(url, formData)
        .then((response) => {
          const productSlug = response.data.product.slug;
          // Swal.fire("Product Saved", "", "success");
          Swal.fire({
            title: (
              <div className="mt-3 mb-1">
                <h2 className="text-success">Product Saved!</h2>
                <h5 className="text-secondary">
                  {/* <Spinner color="secondary" className="mr-1" /> */}
                  {response.data.product.title}
                </h5>
              </div>
            ),
            icon: "success",
          })
          history.push("/product/" + productSlug);
        })
        .catch((error) => {
          Swal.fire("Error", JSON.stringify(error.response?.data), "error");
        });
    }
  }

  function getRenderedSubcategory(subCategory) {
    console.log("sub category >>>>> ",subCategory)
    const label = (
      <div>
        <div
          className={`${
            !subCategory.category ? "text-bold-600" : ""
          }`}
        >
          {subCategory.name}
        </div>
        <div className="text-lightgray">{subCategory.category??"(Category)"}</div>
      </div>
    );
    return {
      label: label,
      value: subCategory.id,
    };
  }

  const createOption = (label: string) => ({
    id: label.toLowerCase().replace(/\W/g, ""),
    label: label.toLowerCase(),
    new: true,
  });

  console.log("Basic Data------>>>>>>>",basicData.weight_value ? true : false);

return (
    <>
      <h4></h4>
      <BreadCrumb
        breadCrumbTitle={productSlug ? "EDIT PRODUCT" : "ADD NEW PRODUCT"}
        breadCrumbActive={initialData?.title ?? "New Product"}
        breadCrumbParent={
          <span
            onClick={(e) => {
              e.preventDefault();
              history.push(`/products/`);
            }}
          >
            All Products
          </span>
        }
      />
      <hr />
      <form onSubmit={submitForm}>
        <Row>
          <Col lg={11} xl={9}>
            <SimpleInputField
              label="Product Title"
              type="text"
              name="title"
              placeholder="Enter Product Title"
              onChange={(e) => setBasicFieldData("title", e.target.value)}
              requiredIndicator
              required
              value={basicData.title || ""}
            />
            <SimpleInputField
              label="Select Product Category(s)"
              requiredIndicator
              field={
                <Select
                  // closeMenuOnSelect={false}
                  value={
                    basicData.sub_categories
                      ?.map((sc_id) =>
                        props.profile.sub_categories.find(
                          (sc) => sc.id === sc_id
                        )
                      )
                      .filter(Boolean)
                      .map(getRenderedSubcategory) || ""
                  }
                  isMulti
                  options={props.profile.sub_categories.map(
                    getRenderedSubcategory
                  )}
                  filterOption={({ label, value, data }, searchString) => {
                    if (!searchString) return true;
                    const subcat = props.profile.sub_categories.filter(
                      (sc) => sc.id === value
                      );
                      
                    // return false
                    return (
                      subcat[0]?.name
                        .toLowerCase()
                        .includes(searchString.toLowerCase()) ||
                      (subcat[0]?.category??"(Category)")   // ?? part will be executed when it subcat is a category itself, having no parent category 
                        .toLowerCase()
                        .includes(searchString.toLowerCase())
                    );
                  }}
                  styles={{ menu: (styles) => ({ ...styles, zIndex: 2 }) }}
                  onChange={(data) => {
                    const sub_categories = data?.map((item) => item.value);
                    setBasicFieldData("sub_categories", sub_categories);
                  }}
                />
              }
            />
            <FormGroup>
              <Label for="pname">
                <h5>Product Description</h5>
              </Label>
              {isPageRenderReady && (
                <RichEditor
                  onChange={(data) => setBasicFieldData("description", data)}
                  defaultValue={basicData.description}
                />
              )}
            </FormGroup>

            <SimpleInputField
              label="Select/Create Product Tag(s)"
              field={
                <CreatableSelect
                  isMulti
                  onChange={(value) => setBasicFieldData("tags", value)}
                  onFilter={({ label, value, data }, searchString) => {
                    if (!searchString) return true;
                    return data.__isNew__;
                  }}
                  showNewOptionAtTop={false}
                  value={basicData?.tags || ""}
                  options={tags}
                  getOptionValue={(option) => option["id"]}
                  onCreateOption={(inputValue: any) => {
                    console.log("hello from tags create:-----> ", inputValue);
                    const newOption = createOption(inputValue);
                    console.groupEnd();

                    setTags((prevState) => {
                      return [...prevState, newOption];
                    });
                    setBasicFieldData("tags", [...basicData.tags, newOption]);
                  }}
                  isValidNewOption={(
                    inputValue,
                    selectValue,
                    selectOptions
                  ) => {
                    if (
                      inputValue.trim().length === 0 ||
                      selectOptions.find(
                        (option) =>
                          option.label ===
                          inputValue.toLowerCase().replace(/\W/g, "")
                      )
                    ) {
                      return false;
                    }
                    return true;
                  }}
                  formatOptionLabel={({ value, label, customAbbreviation }) => (
                    <div style={{ display: "flex" }}>
                      <div>
                        {label.charAt(0).toUpperCase() + label.slice(1)}
                      </div>
                    </div>
                  )}
                />
              }
            />

            <SimpleInputField
              label="Select/Create Product Vendor"
              field={
                <CreatableSelect
                  onChange={(value) => setBasicFieldData("vendors", value)}
                  onFilter={({ label, value, data }, searchString) => {
                    if (!searchString) return true;
                    if (data.__isNew__) {
                      return data.__isNew__;
                    }
                  }}
                  showNewOptionAtTop={false}
                  value={basicData?.vendors || ""}
                  options={vendors}
                  getOptionValue={(option) => option["id"]}
                  onCreateOption={(inputValue: any) => {
                    const newOption = createOption(inputValue);
                    console.groupEnd();

                    setVendors((prevState) => {
                      return [...prevState, newOption];
                    });
                    setBasicFieldData("vendors", newOption);
                  }}
                  formatOptionLabel={({ value, label, customAbbreviation }) => (
                    <div style={{ display: "flex" }}>
                      <div>
                        {label?.charAt(0).toUpperCase() + label?.slice(1)}
                      </div>
                    </div>
                  )}
                />
              }
            />

            <Row style={{ alignItems: "center" }}>
              <Col md="6 m-auto ">
                <SimpleInputField
                  label="Enter Product Weight"
                  type="number"
                  placeholder="Enter Product Weight"
                  onChange={(e) =>
                    setBasicFieldData("weight_value", e.target.value)
                  }
                  value={basicData.weight_value || ""}
                />
              </Col>
              <Col md="6 m-auto">
                <SimpleInputField
                  label="Select Product Weight Unit"
                  field={
                    <Select
                      options={weightUnit}
                      label="Select Product Weight Unit"
                      onChange={(weightUnit) =>
                        setBasicFieldData("weight_unit", weightUnit.value)
                      }
                      defaultOptions
                      value={
                        weightUnit.find(
                          (weight_unit) =>
                            weight_unit.value === basicData?.weight_unit
                        ) || ""
                      }
                    />
                  }
                />
              </Col>
            </Row>
            <SimpleInputField
              label="Select Country"
              requiredIndicator
              field={
                <Select
                  options={country}
                  placeholder="Select Country"
                  onChange={(country) =>
                    setBasicFieldData("country", country.value)
                  }
                  requiredIndicator
                  defaultOptions
                  value={
                    country.find(
                      (country) => country.value === basicData?.country
                    ) || ""
                  }
                />
              }
            />

            <Row>
              <Col md="12">
                <Label for="pname">
                  <h6>Do You want to allow inventory tracking?</h6>
                </Label>
              </Col>
              <Col md="12" className="pl-4 mb-2">
                <div>
                  <Radio
                    label="Yes"
                    value="yes"
                    checked={allowInventoryTracking === "yes"}
                    onChange={(e) => setAllowInventoryTracking(e.target.value)}
                    name="exampleRadio1"
                  />
                  <div className="ml-2">
                    <span>
                      Keep track and auto update your inventory when an order is placed
                    </span>
                  </div>
                </div>
                <div>
                  <Radio
                    label="No"
                    value="no"
                    checked={allowInventoryTracking === "no"}
                    onChange={(e) => setAllowInventoryTracking(e.target.value)}
                    name="exampleRadio1"
                  />
                  <div className="ml-2">
                    <span>Don't track your inventory</span>
                  </div>
                </div>

                {allowInventoryTracking === "yes" && (
                  <Row className="ml-0 mt-1">
                    <Col md="auto mr-asuto">
                      <Label for="pname">
                        <h6>Do You want to allow overselling?</h6>
                      </Label>
                    </Col>
                    <Col md="auto">
                      <div className="d-inline-block mr-1">
                        <Radio
                          label="Yes"
                          value="yes"
                          checked={allowOverselling === "yes"}
                          name="allow_overselling"
                          onChange={(e) => setAllowOverselling(e.target.value)}
                        />
                      </div>
                      <div className="d-inline-block mr-1">
                        <Radio
                          label="No"
                          value="no"
                          checked={allowOverselling === "no"}
                          name="allow_overselling"
                          onChange={(e) => setAllowOverselling(e.target.value)}
                        />
                      </div>
                    </Col>
                  </Row>
                )}
              </Col>
            </Row>

            <UploadGallery
              onChange={(images) => {
                setProductImages(images);
              }}
              initialImages={initialData?.images}
              isRenderable={isPageRenderReady}
            />
            <br />

            <FormGroup>
              <Row>
                <Col md="auto mr-auto">
                  <Label for="pname">
                    <h5>Does the product have multiple variants?</h5>
                  </Label>
                </Col>
                <Col md="auto">
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="No"
                      value="no"
                      checked={isMultiVariant === "no"}
                      onChange={(e) => setIsMultiVariant(e.currentTarget.value)}
                      name="variants"
                    />
                  </div>
                  <div className="d-inline-block mr-1">
                    <Radio
                      label="Yes"
                      value="yes"
                      checked={isMultiVariant === "yes"}
                      onChange={(e) => setIsMultiVariant(e.currentTarget.value)}
                      name="variants"
                    />
                  </div>
                </Col>
              </Row>
            </FormGroup>

            {isMultiVariant === "no" && (
              <SingleVariantForm
                onChange={(data) =>
                  setVariantsDataContainer({
                    multiple: false,
                    data: data,
                  })
                }
                initialVariantData={
                  !initialData?.variants_data?.multiple &&
                  initialData?.variants_data?.data
                }
              />
            )}
            {isMultiVariant === "yes" && (
              <MultipleVariantForm
                onChange={(data) =>
                  setVariantsDataContainer({
                    ...variantsDataContainer,
                    multiple: true,
                    data: data,
                  })
                }
                setOptions={(options) =>
                  setVariantsDataContainer({
                    ...variantsDataContainer,
                    options: options,
                  })
                }
                initialVariantsData={
                  initialData?.variants_data?.multiple &&
                  initialData?.variants_data?.data
                }
                productImages={productImages}
              />
            )}
            <hr />
            <FormGroup>
              <Button.Ripple type="submit" color="primary" size="lg">
                Save
              </Button.Ripple>
            </FormGroup>
          </Col>
        </Row>
      </form>
      <ToastContainer />
    </>
  );
}

const mapStateToProps = (state) => {
  return {
    profile: state.auth.userInfo.profile,
  };
};

export default connect(mapStateToProps)(AddProduct);
