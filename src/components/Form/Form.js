import {
  Box,
  FormControl,
  TextField,
  Stack,
  Button,
  Container,
  Autocomplete,
  Snackbar,
  Divider,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import axios from "axios";
import React, { useCallback, useState } from "react";
import { convertObjectToArrayOfObject } from "../../utils/functions";
import { initialStateConfigObject } from "../../config/configInitialState";

import MuiAlert from "@mui/material/Alert";

const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const Form = ({ labels, datas, state, setState, dest }) => {
  const [message, setMessage] = useState({});
  const [selectedFiles, setSelectedFiles] = useState([]);

  const handleChargeFiles = (e) => {
    const arrayOfFiles = Array.from(e.target.files);
    setSelectedFiles([...selectedFiles, ...arrayOfFiles]);
  };

  const axiosCall = async () => {
    const formData = new FormData();

    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append(`file${i}`, selectedFiles[i]);
    }
    formData.append("data", JSON.stringify(state));
    const response = await axios({
      method: "POST",
      url: `traitement.php?coll_Id=${dest}`,
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.status === "OK") {
      setMessage({
        message: "Votre demande à été soumise avec succés",
        status: "success",
      });
      setTimeout(() => {
        setMessage({});
      }, 7000);
      setState({ ...initialStateConfigObject });
      setSelectedFiles([]);
    } else {
      setMessage({
        message:
          "il y à eu une erreur lors de la soumission de votre formulaire",
        status: "error",
      });
      setTimeout(() => {
        setMessage("");
      }, 7000);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axiosCall();
  };
  // const handleChangeTextInput = useCallback(
  //   (e, label) => {
  //     const { value, name } = e.target;
  //     if (
  //       (name === "Montant HT" || name === "TVA") &&
  //       state[label]?.TVA?.value !== "" &&
  //       state[label]?.["Montant HT"]?.value !== ""
  //     ) {
  //       const value =
  //         Number(state[label]?.TVA?.value) +
  //         Number(state[label]?.["Montant HT"]?.value);

  //       setState((prevState) => {
  //         console.log(prevState[label]["Montant TTC"]);
  //         return {
  //           ...prevState,
  //           [label]: {
  //             ...prevState[label]["Montant TTC"],
  //             value: value,
  //           },
  //         };
  //       });
  //     }
  //     setState({
  //       ...state,
  //       [label]: {
  //         ...state[label],
  //         [name]: {
  //           ...state[label][name],
  //           value,
  //         },
  //       },
  //     });
  //   },
  //   [setState, state]
  // );
  // const handleChangeTextInput = useCallback(
  //   (e, label) => {
  //     const { value, name } = e.target;
  //     if (
  //       (name === "Montant HT" || name === "TVA") &&
  //       state[label]?.TVA?.value !== "" &&
  //       state[label]?.["Montant HT"]?.value !== ""
  //     ) {
  //       const montantHT = Number(state[label]?.["Montant HT"]?.value);
  //       const tva = Number(state[label]?.TVA?.value);
  //       const montantTTC = montantHT + tva;

  //       setState((prevState) => ({
  //         ...prevState,
  //         [label]: {
  //           ...prevState[label],
  //           "Montant TTC": {
  //             ...prevState[label]["Montant TTC"],
  //             value: montantTTC,
  //           },
  //           [name]: {
  //             ...prevState[label][name],
  //             value,
  //           },
  //         },
  //       }));
  //     } else {
  //       setState((prevState) => ({
  //         ...prevState,
  //         [label]: {
  //           ...prevState[label],
  //           [name]: {
  //             ...prevState[label][name],
  //             value,
  //           },
  //         },
  //       }));
  //     }
  //   },
  //   [setState, state]
  // );

  const handleChangeTextInput = useCallback(
    (e, label) => {
      const { value, name } = e.target;
      const montantHTValue = state[label]?.["Montant HT"]?.value;
      const tvaValue = state[label]?.TVA?.value;
      let updatedState = { ...state };

      updatedState = {
        ...state,
        [label]: {
          ...state[label],
          [name]: {
            ...state[label][name],
            value,
          },
        },
      };

      // if (name === "Montant HT" || name === "TVA") {
      //   if (tvaValue !== "" && montantHTValue !== "") {
      //     const montantHT = Number(montantHTValue);
      //     const tva = Number(tvaValue);
      //     const montantTTC = montantHT + tva;

      //     updatedState = {
      //       ...updatedState,
      //       [label]: {
      //         ...updatedState[label],
      //         "Montant TTC": {
      //           ...updatedState[label]["Montant TTC"],
      //           value: montantTTC.toFixed(2),
      //         },
      //       },
      //     };
      //   }
      // }
      setState({ ...updatedState });
    },
    [setState, state]
  );

  console.log(state);

  const handleChangeSelectInput = useCallback(
    (e, label, newValue, ligne) => {
      const { id } = e.target;
      const shortLabel = id.split("__")[1];

      if (shortLabel !== "axeAnalytique") {
        setState({
          ...state,
          [label]: {
            ...state[label],
            [shortLabel]: { ...state[label][shortLabel], value: newValue },
          },
        });
      }
    },
    [setState, state]
  );

  const handleCloseAlertMessage = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setMessage({});
  };

  return (
    <Box
      component="form"
      onKeyDown={(event) => event.key === "Enter" && false}
      sx={{
        border: "1px solid black",
        padding: "1em",
        margin: "2% 15%",
      }}
      onSubmit={handleSubmit}
    >
      {Object.keys(message).length > 0 && (
        <Snackbar
          open={Object.keys(message).length > 0 ? true : false}
          autoHideDuration={6000}
          onClose={handleCloseAlertMessage}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleCloseAlertMessage}
            severity={message.status}
            sx={{ width: "100%" }}
          >
            {message.message}
          </Alert>
        </Snackbar>
      )}
      {labels.map((label, index) => {
        const currentData = datas[index];
        return (
          <Stack key={label + "-" + index} spacing={4}>
            <h2
              style={{
                display: state?.[label]?.hidden ? "none" : "",
                backgroundColor: "#1D9E90",
                padding: "12px",
                color: "white",
                borderRadius: "30px",
                margin: "12px 0 12px",
                fontSize: "1.2em",
                textTransform: "uppercase",
                fontWeight: "700",
              }}
            >
              {label}
            </h2>
            {currentData.map((data) => {
              let {
                SHORT_LABEL: shortLabel,
                VALEURS: valeurs,
                COLUMN: column,
                TYPE: type,
                MANDATORY: required,
              } = data;

              if (required) {
                required = true;
              } else {
                required = false;
              }

              const newValeurs = convertObjectToArrayOfObject(valeurs);

              const defaultProps = {
                options: newValeurs,
                getOptionLabel: (option) => {
                  return option?.label ?? "";
                },
              };

              return (
                <FormControl
                  size="small"
                  key={label + "-" + shortLabel}
                  required={required}
                  sx={{
                    display: state?.[label]?.[shortLabel]?.hidden ? "none" : "",
                    marginTop: "12px !important",
                  }}
                >
                  {valeurs &&
                  type !== "VENTILATION_HT" &&
                  Object.keys(valeurs).length > 0 ? (
                    <>
                      <Autocomplete
                        {...defaultProps}
                        id={`${column}__${shortLabel}__`}
                        value={state?.[label]?.[shortLabel]?.value ?? ""}
                        onChange={(e, newValue) =>
                          handleChangeSelectInput(e, label, newValue)
                        }
                        disablePortal
                        disableClearable
                        autoComplete
                        disabled={
                          state?.[label]?.[shortLabel]?.disabled ?? false
                        }
                        renderInput={(params) => {
                          return (
                            <TextField
                              error={
                                state?.[label]?.[shortLabel]?.error ?? false
                              }
                              {...params}
                              label={
                                state?.[label]?.[shortLabel]?.label ??
                                shortLabel
                              }
                              variant="filled"
                              required={required}
                              size="small"
                            />
                          );
                        }}
                      />
                    </>
                  ) : type !== "VENTILATION_HT" ? (
                    <TextField
                      size="small"
                      disabled={state?.[label]?.[shortLabel]?.disabled ?? false}
                      type={state?.[label]?.[shortLabel]?.type}
                      id={column}
                      name={shortLabel}
                      label={state?.[label]?.[shortLabel]?.label ?? shortLabel}
                      required={required}
                      multiline={
                        type === "TEXT" && shortLabel !== "Objet" ? true : false
                      }
                      maxRows={4}
                      inputProps={
                        state?.[label]?.[shortLabel]?.type === "date" ||
                        state?.[label]?.[shortLabel]?.type === "number"
                          ? {
                              min: state?.[label]?.[shortLabel]?.min,
                              step: state?.[label]?.[shortLabel]?.step,
                            }
                          : {}
                      }
                      value={
                        shortLabel !== "Montant TTC"
                          ? state?.[label]?.[shortLabel]?.value
                          : state?.[label]?.["Montant HT"]?.value !== "" &&
                            state?.[label]?.["TVA"]?.value !== ""
                          ? Number(
                              Number(state?.[label]?.["Montant HT"]?.value) +
                                Number(state?.[label]?.["TVA"]?.value)
                            ).toFixed(2)
                          : ""
                      }
                      onChange={
                        shortLabel !== "Montant TTC"
                          ? (e) => handleChangeTextInput(e, label)
                          : () => {
                              console.log(shortLabel);
                            }
                      }
                    />
                  ) : (
                    <Container
                      sx={{
                        width: "80%",
                        justifyContent: "stretch",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    ></Container>
                  )}
                </FormControl>
              );
            })}
          </Stack>
        );
      })}
      {selectedFiles.length > 0 && (
        <>
          <Divider sx={{ margin: "15px" }} />
          <Stack
            spacing={4}
            sx={{
              display: "flex",
              marginTop: "15px",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {selectedFiles.map((file, index) => {
              return (
                <Stack key={index} spacing={4}>
                  <Button
                    variant="contained"
                    component="label"
                    color="warning"
                    startIcon={<AttachFileIcon />}
                    onClick={() => {
                      setSelectedFiles(
                        selectedFiles.filter((file, i) => i !== index)
                      );
                    }}
                  >
                    Supprimer {file.name}
                  </Button>
                </Stack>
              );
            })}
          </Stack>
          <Divider sx={{ margin: "15px" }} />
        </>
      )}

      <Container
        sx={{
          marginTop: "2em",
          display: "flex",
          justifyContent: "space-around",
        }}
      >
        <Button
          variant="contained"
          component="label"
          startIcon={<AttachFileIcon />}
        >
          Joindre des documents
          <input
            hidden
            accept="*/*"
            multiple
            name="file"
            type="file"
            onChange={handleChargeFiles}
          />
        </Button>

        <Button size="large" variant="contained" color="success" type="submit">
          <CheckIcon />
          Soumettre
        </Button>
      </Container>
    </Box>
  );
};

export default Form;
