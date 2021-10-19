import { Component } from "react";
import { Card, CardHeader, CardBody, Button } from "reactstrap";
import { Clock } from "react-feather";
import { RiContactsBookLine } from "react-icons/ri";
import apiClient from "api/base";
import {connect} from "react-redux"

class Approval extends Component {

  onSubmit = () => {
    apiClient.post("/profile/apply-for-approval/")
    .then((response) => {
      this.props.forceStepRefresh();
    })
    .catch((error) => console.log(error))
  }

  render() {
    
    if (this.props.user.user_status == "categories_selected") {
      return (
        <div className="mt-3 col-xl-6 col-lg-8 col-md-10 col-12 mx-auto">
          <Card>
            <CardBody className="text-center ">
              <h4 className="">Apply for approval</h4>
              <hr />
              <h6 className="text-bold-400 mb-2 text-gray">
                <small>
                  you've completed all the neccessary steps for the profile.
                </small>
              </h6>
              <Button.Ripple 
                color="primary"
                type="button"
                onClick={() => this.onSubmit()}
              >
                Apply for Approval
              </Button.Ripple>
            </CardBody>
          </Card>
        </div>
      );
    } 
    else if (this.props.user.user_status == "pending_approval") 
    {
      return (
        <div className="mt-3 col-lg-6 mx-auto">
          <Card>
            <CardHeader className="mx-auto flex-column mt-5">
              <Clock size="50" className="mb-3" />
              <h4>Your account is pending approval</h4>
              <br />
              <h5 className="light">It usually takes 24-48 hours.</h5>
            </CardHeader>

            <CardBody className="text-center pt-0"></CardBody>
          </Card>
        </div>
      );
    }
    else if (this.props.user.user_status == "rejected") 
    {
      return (
        <div className="mt-3 col-lg-6 mx-auto">
          <Card>
            <CardHeader className="mx-auto flex-column mt-5">
              <Clock size="50" className="mb-3" />
              <h6>{this.props.user.user_profile_review}</h6>
            </CardHeader>

            <CardBody className="text-center pt-0">
            <Button.Ripple 
                color="primary"
                type="button"
                onClick={() => this.onSubmit()}
              >
                Apply for Approval
              </Button.Ripple>
            </CardBody>
          </Card>
        </div>
      )
    }
    else if (this.props.user.user_status == "need_more_information") 
    {
      return (
        <div className="mt-3 col-lg-6 mx-auto">
          <Card>
            <CardHeader className="mx-auto flex-column mt-5">
              <Clock size="50" className="mb-3" />
              <h6>{this.props.user.user_profile_review}</h6>
            </CardHeader>

            <CardBody className="text-center pt-0 mt-1">
            <Button.Ripple 
                color="primary"
                type="button"
                onClick={() => this.onSubmit()}
              >
                Apply for Approval
              </Button.Ripple>
            </CardBody>
          </Card>
        </div>
      )
    }
    else if (this.props.user.user_status == "permanently_rejected") 
    {
      return (
        <div className="mt-3 col-lg-6 mx-auto">
          <Card>
            <CardHeader className="mx-auto flex-column mt-5">
              <Clock size="50" className="mb-3" />
              <h6>{this.props.user.user_profile_review}</h6>
            </CardHeader>

            <CardBody className="text-center pt-0"></CardBody>
          </Card>
        </div>
      )
    }
    else{
      return ""
    }
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.auth.userInfo
  };
};

export default connect(mapStateToProps)(Approval)
