import "assets/scss/components/timeline.scss"

const orderStatusDisplayMapping = {
    'created': {text: <b>Order Placed</b>, color: 'blue'},
    'approved': {text: <>Order status changed to <b>APPROVED</b></>,},
    'dispatched': {text: <>Order status changed to <b>DISPATCHED</b></>},
    'delivered': {text: <>Order marked as <b>DELIVERED</b></>, color: 'green'},
    'cancelled': {text: <>Order <b>CANCELLED</b></>, color: 'pink'},
}

export default function Timeline({data}) {
    return (
        <div class="timeline">
            <ul>
            {data.map(({time, date, status, created_by_user, created_by_entity}) => {
                return (
                    <li>
                        <div class={"bullet "+(orderStatusDisplayMapping[status].color||'grey')}></div>
                        <div class="time">
                            <b>{time}</b>
                            <br/>
                            {date}
                        </div>
                        <div class="desc">
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
