import React from "react";
import PropTypes from "prop-types";
import { NameControl } from "./NameControl";
import { IpControl } from "./IpControl";

export const Root = ({ name, updateName, ip, getIp, fail, error, restart }) => (
  <div>
    {error ? (
      <div>
        {error}
        <button onClick={restart}>Restart</button>
      </div>
    ) : null}
    <NameControl name={name} updateName={updateName} />
    <IpControl ip={ip} getIp={getIp} />
    <button onClick={fail}>Fail</button>
    <button onClick={restart}>Restart</button>
  </div>
);
Root.propTypes = {
  error: PropTypes.any,
  fail: PropTypes.func,
  getIp: PropTypes.func,
  ip: PropTypes.string,
  name: PropTypes.string,
  restart: PropTypes.func,
  updateName: PropTypes.func
};
