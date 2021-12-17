import "assets/scss/components/timeline.scss"

const orderStatusDisplayMapping = {
    'created': {text: <b>Order Placed</b>, color: 'blue'},
    'approved': {text: <>Order status changed to <b>APPROVED</b></>,},
    'processed': {text: <>Order status changed to <b>PROCESSED</b></>,},
    'dispatched': {text: <>Order status changed to <b>DISPATCHED</b></>},
    'delivered': {text: <>Order marked as <b>DELIVERED</b></>, color: 'green'},
    'awaiting_approval': {text: <>Order marked as <b>AWAITING APPROVED</b></>, color: 'gray'},
    'cancelled': {text: <>Order <b>CANCELLED</b></>, color: 'pink'},
}

export default function Timeline({data}) {
    return (
        <div className="timeline">
            <ul>
            {data.map(({time, date, status, created_by_user, created_by_entity},index) => {
                return (
                    <li key={index}>
                        <div className="bullet grey"></div>
                        <div className="time">
                            <b>{time}</b>
                            <br/>
                            {date}
                        </div>
                        <div className="desc">
                        <h3>{orderStatusDisplayMapping[status].text}</h3>
                        <h4>by <i>{created_by_user}</i> {created_by_user && 'from'} <i>{created_by_entity}</i></h4>
                        </div>
                    </li>

                )
            })}
            </ul>
        </div>
    )
}
