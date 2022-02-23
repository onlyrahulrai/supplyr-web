import { Component, lazy } from "react";
import { connect } from "react-redux";
import Wizard from "components/profiling/ProfilingWizardComponent";
import { UserCheck, FileText, CheckCircle, Package} from "react-feather";

const Verification = lazy(() => import("./_Verification"));
const Profiling = lazy(() => import("./_Profiling"));
const Categories = lazy(() => import("./_Categories"));
const Approval = lazy(() => import("./_Approval"));

class ProfilingWizard extends Component {
  getActiveStepFromProps = () => {
    let current_user_state = this.props.user.user_status;
    switch (current_user_state) {
      case "unverified":
        return 0;
      case "verified":
        return 1;
      // case "new":
      //   return 2;
      // case "categories_selected":
      case "profile_created":
      case "permanently_rejected":
      case "pending_approval":
      case "rejected":
      case "need_more_information":
        return 2;

      default:
        return -1;
    }
  };

  forceStepRefresh = () => {
    let currentStep = this.getActiveStepFromProps();
    this.setState({ activeStep: currentStep, lockStepsAfter: currentStep });
  };

  state = {
    steps: [
      {
        title: <UserCheck />,
        content: <Verification  forceStepRefresh={this.forceStepRefresh} />,
      },
      {
        title: <FileText />,
        content: (
          <Profiling
            entityDetails={this.props.profilingData?.entity_details}
            forceStepRefresh={this.forceStepRefresh}
          />
        ),
      },
      // {
      //   title: <Package />,
      //   content: (
      //     <Categories
      //       categoriesData={this.props.profilingData?.categories_data}
      //       forceStepRefresh={this.forceStepRefresh}
      //     />
      //   ),
      // },
      {
        title: <CheckCircle />,
        content: (
          <Approval
            user={this.props.user.user_status}
            forceStepRefresh={this.forceStepRefresh}
          />
        ),
      },
    ],

    activeStep: this.getActiveStepFromProps(),
  };

  componentDidMount() {
    this.setState({ lockStepsAfter: this.state.activeStep });
  }

  setActiveStep = (index) => {
    this.setState({ activeStep: index });
    console.log("aaya", this.state, index);
  };

  render() {
    const { steps } = this.state;

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

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo,
    profilingData: state.auth.userInfo.profiling_data,
  };
};
export default connect(mapStateToProps)(ProfilingWizard);

// export default ProfilingWizard
