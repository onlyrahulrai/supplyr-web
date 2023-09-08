import React from 'react';

export default function NetworkError({title, error}) {
  return (
    <>
        <div style={{textAlign: 'center', margin: '50px 0px'}}>
            <div style={{fontWeight: 'bold', color: '#555'}}>{title??"UNABLE TO FETCH"} </div>
            <br/>
            <div style={{color: 'red'}}>{error??"An unknown error occurred"}</div>
        </div>
    </>
  );
}
