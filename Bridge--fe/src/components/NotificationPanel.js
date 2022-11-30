import { useState } from "react";

export default function NotificationPanel(props) {
  return (
    <div
      className="alert alert-warning notification"
      role="alert"
      hidden={props.hiddenNotification}
    >
      <button
        className="btn btn-light"
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "1.6em",
          height: "1.6em",
        }}
        onClick={() => props.setHiddenNotification(true)}
      >
        X
      </button>
      <p>{props.message}</p>
    </div>
  );
}
