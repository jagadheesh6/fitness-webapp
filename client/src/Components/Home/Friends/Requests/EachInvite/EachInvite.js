import React, { useState } from "react";
import { axiosInstance } from "../../../../Utility/axiosInstance";
import { getImage } from "../../../Profile/getImage";
import "./EachInvite.css";

const EachInvite = (props) => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [data, setData] = useState({ ...props.data });

  const accept = () => {
    setAcceptLoading(true);
    axiosInstance
      .post("/acceptrequest", { friendId: props.data._id })
      .then((res) => {
        setAcceptLoading(false);
        props.afterSuccess(props.index);
      })
      .catch((err) => {
        setAcceptLoading(false);
      });
  };
  const reject = () => {
    setRejectLoading(true);
    axiosInstance
      .post("/rejectrequest", { friendId: props.data._id })
      .then((res) => {
        setRejectLoading(false);
        props.afterSuccess(props.index);
      })
      .catch((err) => {
        setRejectLoading(false);
      });
  };
  return (
    <div className="each-invite">
      <img
        src={getImage(props.data.avatar === null ? 0 : props.data.avatar)}
        className="each-invite-image"
      />
      <div className="text-center white">{props.data.name}</div>
      {props.received ? (
        <div className="buttons flex-row">
          <div
            title="Accept"
            onClick={acceptLoading ? () => {} : () => accept()}
            className={
              "button-action " + (acceptLoading ? "skeleton-loading" : "")
            }
          >
            {" "}
            ✔{" "}
          </div>
          <div
            title="Rejct"
            onClick={rejectLoading ? () => {} : () => reject()}
            className={
              "button-action " + (rejectLoading ? "skeleton-loading" : "")
            }
          >
            {" "}
            ❌{" "}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EachInvite;
