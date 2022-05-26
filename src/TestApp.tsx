import React from "react";

export default function TestApp() {
  const style = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: "100px",
  };
  return (
    <div>
      <div style={style}>
        <h2>Hello! Welcome to test frontend!</h2>
      </div>
    </div>
  );
}
