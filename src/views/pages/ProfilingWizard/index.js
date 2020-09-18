import React, { lazy } from "react"
import { connect } from "react-redux"
import Wizard from "components/profiling/ProfilingWizardComponent"
import { UserCheck, FileText, CheckCircle, Package } from "react-feather"


const Verification = lazy(() =>
  import("./_Verification")
)
const Profiling = lazy(() =>
  import("./_Profiling")
)
const Categories = lazy(() =>
  import("./_Categories")
)
const Approval = lazy(() =>
  import("./_Approval")
)


class ProfilingWizard extends React.Component{
  getActiveStepFromProps = () => {
    let current_user_state = this.props.user.seller_status
      switch (current_user_state) {
        case 'registered': return 0;
        case 'verified': return 1;
        case 'form_filled': return 2;
        case 'categories_selected': return 3;
        default: return -1;
      }
  }

  forceStepRefresh = () => {
    let currentStep = this.getActiveStepFromProps()
    this.setState({ activeStep: currentStep,
                  lockStepsAfter: currentStep })
  }
  
  state = {
    steps: [
      {
        title: <UserCheck />,
        content: <Verification />,
      },
      {
        title: <FileText />,
        content: <Profiling 
          entityDetails={this.props.profilingData?.entity_details}
          forceStepRefresh={this.forceStepRefresh}
        />,
      },
      {
        title: <Package />,
        content: <Categories 
          categoriesData={this.props.profilingData?.categories_data}
          forceStepRefresh={this.forceStepRefresh}
        />,
      },
      {
        title: <CheckCircle />,
        content: <Approval />,
      },      
    ],

    activeStep: this.getActiveStepFromProps(),
  };

  componentDidMount() {
    this.setState({lockStepsAfter: this.state.activeStep})
  }


  setActiveStep = index => {
    this.setState({ activeStep: index })
    console.log('aaya', this.state, index)
  }


  render(){
    const { steps } = this.state

    return (
      <div>
            <Wizard
              enableAllSteps
              pagination={false}
              steps={steps}
              activeStep={this.state.activeStep}
              lockStepsAfter={this.state.lockStepsAfter}
              formless={true}
              setActiveStep={this.setActiveStep}
            />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.userInfo,
    profilingData: state.auth.userInfo.profiling_data
  }
}
export default connect(mapStateToProps)(ProfilingWizard)

// export default ProfilingWizard