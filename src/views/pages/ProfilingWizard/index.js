import React, { lazy } from "react"
import { connect } from "react-redux"
import Wizard from "components/@vuexy/wizard/FixedWizardComponent"
import { UserCheck, FileText, CheckCircle, Package } from "react-feather"
import {
  Card,
  CardHeader,
  CardBody,
  Row,
  Col,
  Button,
  Progress
} from "reactstrap"


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
  state = {
    steps: [
      {
        title: <UserCheck />,
        content: <Verification />,
      },
      {
        title: <FileText />,
        content: <Profiling />,
      },
      {
        title: <Package />,
        content: <Categories />,
      },
      {
        title: <CheckCircle />,
        content: <Approval />,
      },      
    ],

    activeStep: (() => {
      let current_user_state = this.props.user.status
      switch (current_user_state) {
        case 'registered': return 0;
        case 'verified': return 1;
        case 'profiled': return 2;
        case 'categories_selected': return 3;
      }
    })(),
  };

  render(){
    const { steps } = this.state

    return (
      <div>
            <Wizard
              enableAllSteps
              pagination={false}
              steps={steps}
              activeStep={this.state.activeStep}
              lockStepsAfter={this.state.activeStep}
              formless={true}
            />
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user
  }
}
export default connect(mapStateToProps)(ProfilingWizard)

// export default ProfilingWizard