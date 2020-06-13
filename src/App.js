import React from "react";
import { Global, css } from "@emotion/core";
import Routes from "./Routes";

const globalStyles = css`
  body {
    background-color: #eeeeff;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
      "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans",
      "Helvetica Neue", sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  * {
    color: #11115f;
  }
`;

export default () => (
  <>
    <Global styles={globalStyles} />
    <Routes />
  </>
);
