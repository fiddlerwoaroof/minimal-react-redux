import React from "react";
import PropTypes from "prop-types";

export class NameControl extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cur_input: ""
    };
  }

  render() {
    if (this.props.name === "") {
      return (
        <div>
          <input
            type="text"
            value={this.state.cur_input}
            onChange={e => this.setState({ cur_input: e.target.value })}
          />
          <button onClick={() => this.props.updateName(this.state.cur_input)}>
            Set Name
          </button>
        </div>
      );
    } else {
      return <div>Hello, {this.props.name}</div>;
    }
  }
}
NameControl.propTypes = {
  name: PropTypes.string,
  updateName: PropTypes.func
};
