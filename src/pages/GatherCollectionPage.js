import React from "react";
import { useRouteMatch } from "react-router-dom";
import { loadTerritory } from "../utils/database";
import { lookupAll } from "../utils/search";

function Residence({ residence: { houseNumber } }) {
  return <li>{houseNumber}</li>;
}

function Street({ street, residences }) {
  const sortedResidences = residences.sort(({ houseNumber: a }, { houseNumber: b }) => a - b);
  const hasData = sortedResidences[0].gatherData;

  function renderResidences() {
    if (hasData) {
      const content = residences
        .map((r) => `${r.gatherData.name}\t${r.gatherAddress}\t${r.gatherData.phones}`)
        .join("\n");
      return <textarea>{content}</textarea>;
    } else {
      return (
        <ul>
          {sortedResidences.map((residence) => (
            <Residence key={residence.gatherAddress} residence={residence} />
          ))}
        </ul>
      );
    }
  }
  return (
    <>
      <h2>{street}</h2>
      {renderResidences()}
    </>
  );
}

const FS_IDLE = 1;
const FS_LOAD = 2;
const FS_ERR = 3;
const FS_FIN = 4;

export default function GatherCollectionPage() {
  const {
    params: { territoryId },
  } = useRouteMatch();
  const [streets, setStreets] = React.useState([]);
  const [fetchState, setFetchState] = React.useState(FS_IDLE);
  const [territory, setTerritory] = React.useState(null);

  React.useEffect(() => {
    async function preparePage() {
      const territory = await loadTerritory(territoryId);
      setTerritory(territory);
      if (territory && territory.residences) {
        const _streets = {};
        for (const residence of territory.residences) {
          const { street } = residence;
          if (!_streets[street]) {
            _streets[street] = [];
          }
          _streets[street].push(residence);
        }
        //  sorting by street name (skipping direction)
        setStreets(Object.entries(_streets).sort(([a], [b]) => a.substring(2).localeCompare(b.substring(2))));
      }
    }
    if (territoryId) {
      preparePage();
    }
  }, [territoryId]);

  async function fetchingAllTheAddresses() {
    if ([FS_IDLE, FS_ERR].includes(fetchState)) {
      setFetchState(FS_LOAD);
      try {
        const data = await lookupAll(territory.residences.map(({ gatherAddress }) => gatherAddress));

        function findData(address) {
          const match = data.find(([addr]) => addr === address);
          if (match && match.length === 2) {
            const { phones, orCurrentResident, name } = match[1];
            const displayName = name + (orCurrentResident ? " or Current Resident" : "");
            const displayPhones =
              phones && phones.length ? phones.map(({ number }) => number).join(", ") : "No Number Found";
            return { name: displayName, phones: displayPhones };
          }
        }

        setStreets(
          streets.map(([street, residences]) => {
            return [street, residences.map((r) => ({ ...r, gatherData: findData(r.gatherAddress) }))];
          })
        );
        console.log("DATA", data);
        setFetchState(FS_FIN);
      } catch (err) {
        console.error("SEARCH ERR", err);
        setFetchState(FS_ERR);
      }
    }
  }

  if (streets.length) {
    const lookupDisabled = [FS_LOAD, FS_FIN].includes(fetchState);
    return (
      <div>
        <button disabled={lookupDisabled} onClick={fetchingAllTheAddresses}>
          {lookupDisabled ? " - - - - - - " : "Look up all Addresses"}
        </button>
        {streets.map(([street, residences]) => (
          <Street key={street} street={street} residences={residences} />
        ))}
      </div>
    );
  }

  return <h1>Loading {territoryId}</h1>;
}
