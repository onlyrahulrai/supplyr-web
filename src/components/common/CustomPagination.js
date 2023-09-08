import "../../assets/scss/plugins/extensions/react-paginate.scss"
import { ChevronLeft, ChevronRight } from "react-feather"
import { Component } from "react";
import ReactPaginate from "react-paginate"

export default class CustomPagination extends Component {
    render() {
        return <ReactPaginate
            previousLabel={<ChevronLeft size={15} />}
            nextLabel={<ChevronRight size={15} />}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={this.props.pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            containerClassName={
            "vx-pagination icon-pagination pagination-center mt-3"
            }
            activeClassName={"active"}
            onPageChange={this.props.onPageChange}
            forcePage={
                this.props.initialPage
                ? parseInt(this.props.initialPage - 1)
                : 0
            }
        />

    }
}