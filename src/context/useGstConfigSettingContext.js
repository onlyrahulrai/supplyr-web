import apiClient from "api/base";
import React, {
  useContext,
  createContext,
  useState,
  useReducer,
  useEffect,
} from "react";
import { useSelector } from "react-redux";
import Swal from "../components/utils/Swal";

export const GstConfigSettingContext = createContext();

const gstOptions = [
  { value: "0.00", label: "0%" },
  { value: "3.00", label: "3%" },
  { value: "5.00", label: "5%" },
  { value: "12.00", label: "12%" },
  { value: "18.00", label: "18%" },
  { value: "28.00", label: "28%" },
];

const initialState = {
  category: null,
  selectedCategory: -1,
  default_gst_rate: 0,
  override_categories: [],
};

const reducer = (state, action) => {
  switch (action.type) {
    case "onChange":
      const { field, data } = action.payload;
      return { ...state, [field.name]: data };
    case "REMOVE_STATE":
      return { ...state, default_gst_rate: 0, category: null };
    case "ADD_OVERRIDE_CATEGORY":
      return {
        ...state,
        override_categories: [...state.override_categories, action.payload],
        category: null,
        default_gst_rate: 0,
      };
    case "UPDATE_OVERRIDE_CATEGORY":
      return {
        ...state,
        override_categories: action.payload,
        category: null,
        default_gst_rate: 0,
        selectedCategory: -1,
      };
    case "onSelectCategoryToEdit":
      const { category, default_gst_rate } = state.override_categories.find(
        (cate, index) => index === action.payload
      );

      return {
        ...state,
        selectedCategory: action.payload,
        category,
        default_gst_rate,
      };
    default:
      return state;
  }
};

export const GstConfigSettingProvider = ({ children }) => {
  const profile = useSelector((state) => state.auth.userInfo.profile);
  const { override_categories } = useSelector(
    (state) => state.auth.userInfo.profiling_data.categories_data
  );

  const [enabled, setEnabled] = useState(profile.is_gst_enabled);
  const [loading, setLoading] = useState(false);

  const [state, dispatch] = useReducer(reducer, initialState);

  const initialData = {
    gst_number: profile.gst_number ?? "",
    default_gst_rate: parseInt(profile.default_gst_rate),
  };
  const [data, setData] = useState(initialData);
  const [isOverideGSTEnabled, setIsOverideGSTEnabled] = useState(
    state.override_categories.length > 0 || false
  );
  const [isProductPriceIncludesTaxes, setIsProductPriceIncludesTaxes] =
    useState(profile.product_price_includes_taxes);

  useEffect(() => {
    if (override_categories.length > 0) {

      console.log(" ----- Override categories ----- ",override_categories)

      dispatch({
        type: "UPDATE_OVERRIDE_CATEGORY",
        payload: override_categories,
      });
      setIsOverideGSTEnabled(true);
    }
  }, []);

  const onEnabledGST = async () => {
    setLoading((prevState) => !prevState);

    const requestedData = {
      is_gst_enabled: !enabled,
    };
    await apiClient
      .put("/profile/seller-profile-settings/", requestedData)
      .then((response) => {
        setEnabled(response.data.user_info.profile.is_gst_enabled);
        setLoading((prevState) => !prevState);
      })
      .catch((error) => console.log(" ----- Error ----- ", error));
  };

  const onChange = (e) => {
    setData((prevState) => ({ ...prevState, [e.target.name]: e.target.value }));
  };

  const onSave = async () => {
    if (!data.gst_number || !data.default_gst_rate) return;

    const requestedData = {
      ...data,
      override_categories: state.override_categories.map(
        (override_category) => ({
          ...override_category,
          category: override_category.category.id,
        })
      ),
      product_price_includes_taxes: isProductPriceIncludesTaxes,
    };

    await apiClient
      .post("/profile/gst-config-setting/", requestedData)
      .then((response) => {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "GST Updated Successfully",
        });
      })
      .catch((error) => {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Something went wrong!",
        });
      });
  };

  const value = {
    data,
    onEnabledGST,
    loading,
    onChange,
    enabled,
    isOverideGSTEnabled,
    setIsOverideGSTEnabled,
    gstOptions,
    onSave,
    state,
    dispatch,
    isProductPriceIncludesTaxes,
    setIsProductPriceIncludesTaxes,
  };
  return (
    <GstConfigSettingContext.Provider value={value}>
      {children}
    </GstConfigSettingContext.Provider>
  );
};

const useGstConfigSettingContext = () => useContext(GstConfigSettingContext);

export default useGstConfigSettingContext;
