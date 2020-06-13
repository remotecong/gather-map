/** @jsx jsx */
import { jsx, css } from "@emotion/core";

const styles = {
  container: css({
    boxShadow: "0 2px 5px #11115f88",
    left: "1em",
    position: "fixed",
    top: "6em",
    zIndex: 2
  }),
  drawTool: css({
    backgroundColor: "#eeeeff",
    borderBottom: "solid 1px #11115fee",
    cursor: "pointer",
    fontWeight: "bold",
    margin: 0,
    padding: "1em",
    "&:active": {
      backgroundColor: "#bbeeff"
    },
    "&:last-child": {
      borderBottom: "none"
    }
  }),
  drawToolActive: css({
    backgroundColor: "#bbeeff"
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
