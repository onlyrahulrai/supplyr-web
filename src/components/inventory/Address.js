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
                [line1, line2, `${city} (PIN ${pin})`, state, `Phone: ${phone || "+91 99999 99999"}`].map((line, index) => (
                    <div key={index}><span>{line}</span> <br/> </div>
                ))
            }
        </div>
    );
}


