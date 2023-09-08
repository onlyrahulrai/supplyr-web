export default function Address({bold,...rest}) {
    const { name, line1, line2, pin, city, state, phone } = rest;

    return (
        <div>
            {
                name ? (
                    <div>
                        <h5>
                            {name}
                        </h5>
                    </div>
                ):null
            }
            {
                [line1, line2, `${city} ${!!pin ? `(PIN ${pin})`:''}`, state, `Phone: ${phone || "+91 99999 99999"}`].map((line, index) => (
                    <div key={index}>
                        {
                            bold ? (
                                <strong>{line}</strong>
                            ):(
                                <span>{line}</span> 
                            )
                        }
                    </div>
                ))
            }
        </div>
    );
}


