/** @jsx jsx */
import { jsx, css } from "@emotion/core";

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
    css={css`
      ${styles.drawTool}
      ${active ? styles.drawToolActive : null}
    `}
    onClick={onClick}
  >
    {children}
  </p>
);

export default ({
  isDrawing = false,
  onLoadClick,
  onSave,
  onToggleIsDrawing,
  onUndo
}) => (
  <div css={styles.container}>
    <DrawTool active={isDrawing} onClick={onToggleIsDrawing}>
      Draw
    </DrawTool>
    <DrawTool onClick={onUndo}>Undo</DrawTool>
    <DrawTool onClick={onSave}>Save</DrawTool>
    <DrawTool onClick={onLoadClick}>Load</DrawTool>
  </div>
);
