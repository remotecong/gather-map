/** @jsx jsx */
import { useEffect, useState } from "react";
import { jsx, css } from "@emotion/core";
import { Link } from "react-router-dom";
import { getTerritoryList } from "../../utils/database";

const styles = {
  container: css({})
};

function TerritoryListPage() {
  const [territories, setTerritories] = useState([]);
  useEffect(() => {
    getTerritoryList().then(setTerritories);
  }, [setTerritories]);

  return (
    <div css={styles.container}>
      <h1>All Territories</h1>
      <ul>
        {territories.map(t => (
          <li key={t}>
            {t}
            {` | `}
            <Link to={`/territory/edit/${t}`}>Edit</Link>
            {` | `}
            <Link to={`/territory/lookup/${t}`}>Lookup Numbers</Link>
            {` | `}
            <Link to={`/territory/work/${t}`}>Work</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TerritoryListPage;
