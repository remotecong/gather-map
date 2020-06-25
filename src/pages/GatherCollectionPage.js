import React from "react";
import { useRouteMatch } from "react-router-dom";
import { loadTerritory } from "../utils/database";

function Residence({ residence: { houseNumber } }) {
  return <li>{houseNumber}</li>;
}

function Street({ street, residences }) {
  return (
    <>
      <h2>{street}</h2>
      <ul>
        {residences.map(residence => (
          <Residence key={residence.gatherAddress} residence={residence} />
        ))}
      </ul>
    </>
  );
}

export default function GatherCollectionPage() {
  const {
    params: { territoryId }
  } = useRouteMatch();
  const [streets, setStreets] = React.useState([]);

  React.useEffect(() => {
    async function preparePage() {
      console.log("PREPPIN");
      const territory = await loadTerritory(territoryId);
      if (territory && territory.residences) {
        const _streets = {};
        for (const residence of territory.residences) {
          const { street } = residence;
          if (!_streets[street]) {
            _streets[street] = [];
          }
          _streets[street].push(residence);
        }
        setStreets(
          Object.entries(_streets).sort(([a], [b]) => a.localeCompare(b))
        );
      }
    }
    if (territoryId) {
      preparePage();
    }
  }, [territoryId]);

  if (streets.length) {
    return streets.map(([street, residences]) => (
      <Street key={street} street={street} residences={residences} />
    ));
  }

  return <h1>Loading {territoryId}</h1>;
}
