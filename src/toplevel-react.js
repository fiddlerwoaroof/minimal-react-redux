import React from "react";
import PropTypes from "prop-types";
import { NameControl } from "./NameControl";
import { IpControl } from "./IpControl";

export const Root = ({ name, updateName, ip, getIp, fail, error, restart }) => (
  <div>
    {error ? (
      <div>
        Received an error with message: {error} Get Ip won&apos;t work until
        error resolved. <button onClick={restart}>Restart</button>
      </div>
    ) : null}
    <NameControl name={name} updateName={updateName} />
    <IpControl ip={ip} getIp={getIp} />
    <p />
    <button onClick={fail}>Fail</button>
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
