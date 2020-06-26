/** @jsx jsx */
import { jsx, css } from "@emotion/core";
import { useState } from "react";
import { saveTerritory } from "../../utils/database";

const styles = {
  wrapper: css({
    width: 900,
    margin: "auto",
  }),
  field: css({
    background: "none",
    border: "none",
    borderBottom: "solid 2px transparent",
    display: "block",
    fontSize: "2rem",
    outline: "none",
    paddingBottom: "0.2rem",
    textAlign: "center",
    width: "100%",
    "&:active, &:focus": {
      borderBottomColor: "currentColor",
    },
  }),
  button: css({
    background: "none",
    border: "solid 2px currentColor",
    borderRadius: 10,
    fontSize: "2rem",
    float: "right",
    outline: "none",
    marginTop: "2rem",
    padding: "1rem",
    "&:disabled": {
      background: "#eee",
      opacity: "0.3",
    },
  }),
};

function NewTerritoryPage() {
  const [name, setName] = useState("");

  async function onSave(e) {
    e.preventDefault();
    try {
      await saveTerritory({ id: name, points: [] });
      setName("");
    } catch (err) {
      alert("Error occurred!");
      console.error(err);
    }
  }

  function onInput(e) {
    setName(e.target.value);
  }

  return (
    <div css={styles.wrapper}>
      <h1>New Territory</h1>
      <form onSubmit={onSave}>
        <input placeholder="Name (e.g. 32BA)" css={styles.field} onChange={onInput} value={name} />
        <button css={styles.button} disabled={!name}>
          Save
        </button>
      </form>
    </div>
  );
}

export default NewTerritoryPage;
