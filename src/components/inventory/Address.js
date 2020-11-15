import React from 'react';

export default function Address(props) {
    const { name, line1, line2, pin, city, state, phone } = props;

    return (
        <div>
            <div>
                <h5>
                    {name}
                </h5>
            </div>
            {
                [line1, line2, `${city} (PIN ${pin})`, state, `Phone: ${phone}`].map((line, i) => (
                    <><span key={i}>{line}</span> <br/> </>
                ))
            }
        </div>
    );
}


