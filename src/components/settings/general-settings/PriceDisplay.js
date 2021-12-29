import { connect } from "react-redux";
import { numberFormatter } from "utility/general";

const PriceDisplay = ({ profile, amount, styles = null,classes=null }) => {
  let currency_representation = profile.currency_representation;

  const priceFormatter = (amount) => {
    return currency_representation.search("{{amount}}") !== -1 ? currency_representation.replace("{{amount}}",numberFormatter(amount)) : currency_representation.search("{{amount_no_decimals}}") !== -1 ? currency_representation.replace("{{amount_no_decimals}}",numberFormatter(parseInt(amount))) : `${currency_representation}${amount}`
  };

  return <span style={styles} className={classes}>{priceFormatter(amount)}</span>;
};

const mapStateToProps = (state) => {
  return {
    profile: state.auth.userInfo.profile,
  };
};

export default connect(mapStateToProps)(PriceDisplay)
