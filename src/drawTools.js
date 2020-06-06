import React from "react";
import { css, cx } from "emotion";

const styles = {
  container: css({
    position: "fixed",
    top: "6em",
    left: "1em",
    zIndex: 2
  }),
  drawTool: css({
    backgroundColor: "#ccc",
    cursor: "pointer",
    margin: 0,
    padding: "1em",
    "&:active": {
      backgroundColor: "#666"
    }
  }),
  drawToolActive: css({
    backgroundColor: "#666",
    color: "#fff"
  })
};

export const DrawTool = ({ active = false, children, onClick }) => (
  <p
    className={cx(styles.drawTool, active ? styles.drawToolActive : null)}
    onClick={onClick}
  >
    {children}
  </p>
);

export default ({ isDrawing = false, toggleIsDrawing, onUndo }) => (
  <div className={styles.container}>
    <DrawTool active={isDrawing} onClick={toggleIsDrawing}>
      Draw
    </DrawTool>
    <DrawTool onClick={onUndo}>Undo</DrawTool>
  </div>
);
