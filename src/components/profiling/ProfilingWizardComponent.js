import { Component, Fragment } from "react";
import PropTypes from "prop-types"
import classnames from "classnames"
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Form,
  Button,
  Card,
  CardBody,
} from "reactstrap"
import { AvForm } from "availity-reactstrap-validation"

/****************************************************************
 * VueXY default wizard component had a bug, where if value of activeStep passed through 
 * prop in something other than 0, then it would lock the tabs. 
 * Fixed it here.
 * - Talha
 * 
 */

class VuexyWizard extends Component {
  // static getDerivedStateFromProps(props, state) {
  //   if (props.activeStep) {
  //     if (props.activeStep !== state.activeStep) {
  //       if (props.validate) {
  //         if (state.errors.length === 0 && state.submitted)
  //           return { activeStep: props.activeStep }
  //       } else return { activeStep: props.activeStep }
  //     }
  //   }
  //   return null
  // }

  state = {
    activeStep: this.props.activeStep ? this.props.activeStep : 0,
    errors: [],
    values: []
  }

  componentDidUpdate() {
    if(this.props.activeStep !== this.state.activeStep){
      this.setState({ activeStep: this.props.activeStep})
    }
  }

  handleNextStep = (index, total, errors = []) => {
    let activeStep = this.state.activeStep
    let validation = this.props.validate

    if (!validation) {
      if (activeStep <= index && activeStep !== total) {
        this.setState({
          activeStep: activeStep + 1
        })
      }
    } else {
      if (errors.length === 0 && activeStep <= index && activeStep !== total) {
        this.setState({
          activeStep: activeStep + 1
        })
      } else if (errors.length && this.props.onValidationError) {
        this.props.onValidationError(this.state.errors)
      } else {
        return
      }
    }
  }

  handlePreviousStep = index => {
    let activeStep = this.state.activeStep
    if (activeStep >= index)
      this.setState({
        activeStep: activeStep - 1
      })
  }

  handleEnableAllSteps = index => {
    if (this.props.enableAllSteps && !this.isStepLocked(index)) {
      this.props.setActiveStep(index)
    }
  }

  isStepLocked = index => this.props?.lockStepsAfter < index

  handleSubmit = e => {
    if (
      this.props.steps.length - 1 === this.state.activeStep &&
      this.props.onFinish
    ) {
      this.props.onFinish(e)
    }
  }

  render() {
    let FormTag = this.props.formless 
      ? "div"
      : this.props.validate 
      ? AvForm 
      : Form

    return (
      <Fragment>
      
        <Card>
          <CardBody>
            <h3>Welcome to Amojo</h3>
            <p>
              Please fill some quick details. It only takes around 2 minutes
            </p>
            <hr />
            <Nav
              className={`vx-wizard ${
                this.props.className ? this.props.className : ""
              }`}
              tabs>
              {this.props.steps.map((item, i) => {
                return (
                  <NavItem
                    className="step-wrapper"
                    key={i}
                    onClick={() => this.handleEnableAllSteps(i)}>
                    <NavLink
                      className={classnames(`step step-${i}`, {
                        active: this.state.activeStep === i ? true : false,
                        done: i < this.state.activeStep
                      })}>
                      <span className="step-text">{item.title}</span>
                    </NavLink>
                  </NavItem>
                )
              })}
            </Nav>
          </CardBody>
        </Card>
        <TabContent
          className={`vx-wizard-content ${
            this.props.tabPaneClass ? this.props.tabPaneClass : ""
          }`}
          activeTab={this.state.activeStep}>
          {this.props.steps.map((item, i) => {
            return (
              <TabPane
                className={`step-content step-${i}-content`}
                key={i}
                tabId={i}>
                <FormTag
                  className="form-horizontal"
                  onSubmit={(e, errors, values) => {
                    this.setState({ errors, values })
                    if (!this.props.validate) e.preventDefault()
                    this.handleNextStep(i, this.props.steps.length - 1, errors)
                    this.handleSubmit(e)
                  }}>
                  {item.content}
                  {this.props.pagination ? (
                    <div className="wizard-actions d-flex justify-content-between">
                      <Button
                        color="primary"
                        disabled={this.state.activeStep === 0}
                        onClick={() => this.handlePreviousStep(i)}>
                        Prev
                      </Button>
                      <Button type="submit" color="primary">
                        {this.props.steps.length - 1 === i &&
                        !this.props.finishBtnText
                          ? "Submit"
                          : this.props.steps.length - 1 === i &&
                            this.props.finishBtnText
                          ? this.props.finishBtnText
                          : "Next"}
                      </Button>
                    </div>
                  ) : null}
                </FormTag>
              </TabPane>
            )
          })}
        </TabContent>
      </Fragment>
    );
  }
}

VuexyWizard.propTypes = {
  className: PropTypes.string,
  steps: PropTypes.array.isRequired,
  validate: PropTypes.bool,
  enableAllSteps: PropTypes.bool,
  finishBtnText: PropTypes.string,
  onFinish: PropTypes.func,
  pagination: PropTypes.bool,
  onValidationError: PropTypes.func,
  activeStep: PropTypes.number
}

VuexyWizard.defaultProps = {
  pagination: true
}

export default VuexyWizard
