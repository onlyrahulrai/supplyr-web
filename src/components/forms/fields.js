import { Check } from "react-feather";
import { FormGroup, Label, Input, FormFeedback } from "reactstrap";

export function SimpleInputField(props) {
  let fieldError = props.error;
  
  return (
    <FormGroup className={props.formGroupClasses}>
      {props.label && (
        <Label for={props.name}>
          <h6>
            {props.label}
            {props.requiredIndicator && <span className="text-danger"> *</span>}
          </h6>
        </Label>
      )}
      {props.field ?? (
        <>
          <Input
            type={props.type ?? "text"}
            id={props.id ?? props.name}
            name={props.name}
            placeholder={props.placeholder ?? props.label}
            onChange={props.onChange}
            value={props.value}
            invalid={Boolean(fieldError)}
            required={props.required}
            min={props.min}
            bsSize={props.size}
            maxLength={props.maxLength}
            onBlur={props.onBlur}
            onFocus={props.onFocus}
            innerRef={props.innerRef}
            onKeyPress={props.onKeyPress}
            accept={props.accept}
            step={props.step}
            disabled={props.disabled}
            style={props.styles}
          />
          {props.iconRight && (
            <div className={`form-control-position border shadow rounded-full ${props.icon ? "ml-1":""}`} style={{marginRight:"16px",cursor:"pointer"}}>
              <span onClick={props.onKeyPress ?? props.onClick} >
                {props.icon ?? <Check size={15}  /> }
              </span>
            </div>
          )}

         
        </>
      )}
      {fieldError && <FormFeedback>{fieldError}</FormFeedback>}
    </FormGroup>
  );
}

export function FloatingInputField(props) {
  return (
    <FormGroup className="form-label-group">
      <Input
        type={props.type ?? "text"}
        id={props.id ?? props.name}
        name={props.name}
        placeholder={props.placeholder ?? props.label}
        onChange={props.onChange}
        value={props.value}
        maxLength={props.maxLength}
      />
      <Label for={props.name}>{props.label}</Label>
    </FormGroup>
  );
}
