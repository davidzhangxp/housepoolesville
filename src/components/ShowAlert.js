import React from "react";

export const ShowAlert = ({ message, action }) => {
  return (
    <div>
      <div className="message_bar">
        <div>
          <div>{message}</div>
          <div>
            <button className="fw" onClick={action}>
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
