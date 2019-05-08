import React from "react";
import PropTypes from "prop-types";

export const IpControl = ({ ip, getIp }) =>
  ip === "" ? (
    <button onClick={getIp}>Get Ip</button>
  ) : (
    <div>Your IP is: {ip}</div>
  );
IpControl.propTypes = {
  ip: PropTypes.string,
  getIp: PropTypes.func
};
