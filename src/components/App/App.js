import Form from "../Form/Form";
import { indexCollection, user } from "../datas";
import { useEffect, useState } from "react";
import { findPartsOfForm, getlabelList } from "../../utils/functions";
import { initialStateConfigObject } from "../../config/configInitialState";
import logo from "./logo.PNG";
import logo2 from "./logo2.png";
let edit = false;

var userFromServer = window.user ?? user;
var indexCollectionFromServer = window.indexCollection ?? indexCollection;

var dest = window.collId ?? "coll_19";

function App() {
  const [state, setState] = useState({});

  // on recupere tous les labels pour generer les champs
  const labels = Array.from(getlabelList(indexCollectionFromServer));

  let formDatas = labels.map((labelName) =>
    findPartsOfForm(labelName, indexCollectionFromServer)
  );

  const getValueFromId = (id, formdatas, shortlabel) => {
    const label = formdatas
      .map((element) => {
        return element
          .map((el) => {
            if (el.SHORT_LABEL && el.SHORT_LABEL === shortlabel) {
              return el["VALEURS"][id];
            }
          })
          .filter((el) => el !== undefined);
      })
      .filter((el) => el.length && el)
      .join("")
      .toString();
    return label;
  };

  useEffect(() => {
    if (!edit) {
      let initialState = { ...initialStateConfigObject };
      const userId = userFromServer.User_Id;
      const userFullName = `${userFromServer.FirstName} ${userFromServer.LastName}`;
      initialState["Demande d'engagement"]["Demandée par"].value = {
        id: userId,
        label: userFullName.trim(),
      };
      setState({ ...initialState });
    }
  }, []);

  return (
    <div className="App">
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "12px",
        }}
      >
        <img width="30%" src={dest !== "coll_19" ? logo : logo2} alt="logo" />
      </div>
      <header className="App-header">
        <h1 className="App-title">Demande d'engagement de dépenses</h1>
      </header>
      {Object.keys(state).length && (
        <Form
          labels={labels}
          datas={formDatas}
          state={state}
          setState={setState}
          dest={dest}
        />
      )}
    </div>
  );
}

export default App;
