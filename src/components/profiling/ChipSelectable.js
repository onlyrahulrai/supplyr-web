import { Component } from "react";
import { X, Plus } from "react-feather"
class Chip extends Component {
  closeChip = e => {
    e.target.closest(".chip").remove()
  }

  render() {
    return (
      <div
        className={`chip ${this.props.className} ${
          this.props.color ? `chip-${this.props.color}` : null
        }`}
      >
        <div className="chip-body">
          {(!this.props.avatarImg && this.props.avatarText) ||
          (!this.props.avatarImg && this.props.avatarIcon) ? (
            <div
              className={`avatar ${
                this.props.avatarColor ? `bg-${this.props.avatarColor}` : null
              }`}
            >
              <div className="avatar-content">
                {this.props.avatarText ? this.props.avatarText : null}
                {this.props.avatarIcon ? this.props.avatarIcon : null}
              </div>
            </div>
          ) : this.props.avatarImg ? (
            <div className="avatar">
              <img
                src={this.props.avatarImg}
                alt="chipImg"
                height="20"
                width="20"
              />
            </div>
          ) : null}
          <div className="chip-text">{this.props.text}</div>
          {this.props.selectable ? (
            <div className="chip-closable" onClick={e => this.props.onSelectToggle(e)}>
              {this.props.isSelected ? <X /> : <Plus />}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}

export default Chip
