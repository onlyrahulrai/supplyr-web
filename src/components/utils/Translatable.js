import React from 'react'
import {connect} from "react-redux"

const Translatable = ({profile:{translation},text,prefix,styles,classes}) => {
    console.log("---- # seller profile # ----",translation[text])
    return (
        <span style={styles} className={`${classes}`}>
            {prefix ?? ""} {translation[text] ?? "Quantity"}
        </span>
    )
}

const mapStateToProps = (state) => {
    return {
        "profile":state.auth.userInfo.profile
    }
}

export default connect(mapStateToProps)(Translatable)
