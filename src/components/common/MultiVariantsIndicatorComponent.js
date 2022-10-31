import React from "react";
import { RiCheckboxMultipleBlankLine } from "react-icons/ri";

const MultiVariantsIndicatorComponent = () => {
  return (
    <>
      <RiCheckboxMultipleBlankLine
        className="ml-1 cursor-pointer"
        size={24}
        title="This product has multiple variants"
      />
    </>
  );
};

export default MultiVariantsIndicatorComponent;
