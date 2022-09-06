import React from 'react'
import {connect} from "react-redux"

const Translatable = ({profile:{translations},text,prefix,styles,classes}) => {
    return (
        <span style={styles} className={`${classes}`}>
            {prefix ?? ""} {translations[text] ?? text}
        </span>
    )
}

const mapStateToProps = (state) => {
    return {
        "profile":state.auth.userInfo.profile
    }
}

export default connect(mapStateToProps)(Translatable)
