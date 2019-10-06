import React from "react";
import PropTypes from "prop-types";

export class FocusManager extends React.Component {
  constructor() {
    super();
    this.ref = React.createRef();
    this.doFocus = () => this.ref.current && this.ref.current.focus();
  }
  componentDidMount() {
    if (this.ref.current) this.ref.current.focus();
    //eslint-disable-next-line no-console
    else console.error("ref unbound");
  }
  render() {
    return this.props.children(this.ref, this.doFocus);
  }
}

FocusManager.propTypes = {
  children: PropTypes.func.isRequired
};
