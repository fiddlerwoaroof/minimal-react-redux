import React from "react";
import PropTypes from "prop-types";
import { NameControl } from "./NameControl";
import { IpControl } from "./IpControl";

export const Root = ({ name, updateName, ip, getIp }) => (
  <div>
    <NameControl name={name} updateName={updateName} />
    <IpControl ip={ip} getIp={getIp} />
  </div>
);
Root.propTypes = {
  ip: PropTypes.string,
  name: PropTypes.string,
  getIp: PropTypes.func,
  updateName: PropTypes.func
};
