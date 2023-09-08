import apiClient from 'api/base';
import React, { useEffect, useState } from 'react';
import Spinner from "components/@vuexy/spinner/Loading-spinner"
import { MdVerifiedUser, MdError } from 'react-icons/md'
import { history } from "../../../history"
import { useSelector } from 'react-redux';

export default function ConfirmEmail(props) {
    const key = props.match.params.key
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [responseOk, setResponseOk] = useState(false)
    const isAuthenticated = useSelector(state => state.auth.authenticated)

    const url = `register/verify-email/`

    useEffect(() => {
        console.log("auth ", isAuthenticated)
        apiClient.post(url, { key })
            .then(response => {
                console.log(response)
                if (response.data.detail === 'ok') {
                    setResponseOk(true)
                    if (isAuthenticated) {
                        setTimeout(() => {
                            history.push("/")
                            window.location.reload()
                        }, 3000)
                    }
                }
            })
            .catch(error => {
                const errorMessage = error.message
                setError(errorMessage)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }, [])
    return (
        <div style={{
            textAlign: 'center',
            display: 'flex',
            height: '100vh',
            justifyContent: 'center',
            flexDirection: 'column'
        }}>
            {isLoading &&
                <Spinner />
            }
            {!isLoading && error &&
                <div>
                    <MdError size={100} className='warning' />
                    <br />
                    <br />
                    <br />
                    <h4 style={{ color: '#E91E63' }}>
                        Verification failed !
                    </h4>
                    <p className='danger'>{error}</p>
                </div>
            }
            {!isLoading && responseOk && (
                <div>
                    <MdVerifiedUser size={100} className='success' />
                    <br />
                    <br />
                    <br />
                    <h4 style={{ color: '#2196F3' }}>
                        Email Verification Successful !
                    </h4>
                    <br />
                    {isAuthenticated &&
                        <p style={{ color: '#777', fontSize: 13 }}>Reddirecting to homepage ..</p>
                    }

                </div>
            )}
        </div>
    );
}
