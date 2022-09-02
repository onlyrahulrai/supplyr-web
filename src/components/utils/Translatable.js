import React from 'react'
import {connect} from "react-redux"

const Translatable = ({profile:{user_settings},text,prefix,styles,classes}) => {
    console.log(text, "---- # seller profile # ----",user_settings.translations[text])
    return (
        <span style={styles} className={`${classes}`}>
            {prefix ?? ""} {user_settings.translations[text] ?? text}
        </span>
    )
}

const mapStateToProps = (state) => {
    return {
        "profile":state.auth.userInfo.profile
    }
}

export default connect(mapStateToProps)(Translatable)
