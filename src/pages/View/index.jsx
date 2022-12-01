import {
  Autocomplete,
  Button,
  Card,
  Divider,
  Grid,
  Input,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CustomModal from "../../components/Modal";

const ViewPage = ({ hasAdmin }) => {
  const [searchParams] = useSearchParams();
  const [socket, setSocket] = useState();
  const locations = searchParams.get("locations");
  const [data, setData] = useState([]);
  const [newLocationModal, setNewLocationModal] = useState(false);

  useEffect(() => {
    const webSocket = new WebSocket(
      process.env.REACT_APP_WSS_URL +
        (hasAdmin
          ? "/create"
          : locations.length > 0
          ? `/?locations=${encodeURI(locations)}`
          : "/")
    );

    webSocket.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };

    setSocket(webSocket);
  }, [hasAdmin, locations]);

  const newLocationFormik = useFormik({
    initialValues: {
      name: "",
      address: "",
      type: "newLocation",
    },
    validationSchema: yup.object({
      name: yup.string().required("Campo de localização é obrigatório"),
      address: yup.string().required("Campo de endereço é obrigatório"),
    }),
    onSubmit: async (values) => {
      await socket.send(`-${values.name};${values.address}-`);
      values.name = "";
      values.address = "";
      setNewLocationModal(false);
    },
  });

  const getStatusComponent = (addresses) => {
    const status = getLocationStatus(addresses);
    return (
      <Typography color={status.color} variant="subtitle1">
        {status.message}
      </Typography>
    );
  };

  const getLocationStatus = (addresses) => {
    const values = addresses.map((address) => address.value);
    const average = values.reduce((a, b) => a + b, 0) / values.length;
    let message;
    let color;

    switch (true) {
      case average >= 0 && average <= 3:
        message = "Muito bom";
        color = "green";
        break;
      case average >= 4 && average <= 6:
        message = "Regular";
        color = "yellow";
        break;
      case average >= 7 && average <= 10:
        message = "Alerta";
        color = "red";
        break;
      default:
        message = "Regular";
        color = "yellow";
        break;
    }

    return { message, color };
  };

  const locationsName = data.map((location) => location.name);

  return (
    <Grid
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      style={{
        width: "100%",
      }}
    >
      {hasAdmin && (
        <Button variant="contained" onClick={() => setNewLocationModal(true)}>
          Nova Localização ou Endereço
        </Button>
      )}
      <Grid container spacing={2} paddingTop={2}>
        {data?.map((location) => (
          <Grid
            style={{
              height: "auto",
            }}
            key={location.name}
            item
            xs={4}
            md={4}
          >
            <Card
              style={{
                height: "100%",
              }}
            >
              <Divider>
                <Typography variant="h5">{location.name}</Typography>
              </Divider>

              <Grid
                display="flex"
                flexWrap="wrap"
                alignItems="baseline"
                justifyContent="space-between"
                paddingX={2}
                paddingY={1}
              >
                <Typography variant="subtitle1">
                  Situação do fluxo de àgua:
                </Typography>
                {getStatusComponent(location.addresses)}
              </Grid>

              <Divider />

              <Grid
                display="flex"
                flexWrap="wrap"
                alignItems="baseline"
                justifyContent="space-between"
                flexDirection="column"
                paddingY={3}
                paddingX={2}
              >
                {location.addresses.map((address) => (
                  <Grid
                    display="flex"
                    flexWrap="wrap"
                    alignItems="baseline"
                    justifyContent="space-between"
                    style={{
                      width: "100%",
                    }}
                    key={address.name}
                  >
                    <Typography variant="subtitle1">{address.name}</Typography>
                    <Typography variant="subtitle1">{address.value}</Typography>
                  </Grid>
                ))}
              </Grid>
            </Card>
          </Grid>
        ))}
      </Grid>

      {hasAdmin && (
        <CustomModal
          open={newLocationModal}
          onClose={() => setNewLocationModal(false)}
          title="Cadastrar nova localização ou novo endereço:"
          content={
            <form onSubmit={newLocationFormik.handleSubmit}>
              <Grid container display="flex" flexDirection="column">
                <Grid item paddingY={2}>
                  {/* <Input
                    id="name"
                    type="text"
                    onChange={newLocationFormik.handleChange}
                    onBlur={newLocationFormik.handleBlur}
                    value={newLocationFormik.values.name}
                    fullWidth
                  /> */}
                  <Autocomplete
                    freeSolo
                    id="name"
                    disableClearable
                    options={locationsName}
                    onChange={newLocationFormik.handleChange}
                    renderInput={(params) => (
                      <TextField
                        {...params }
                        id="name"
                        type="text"
                        onChange={newLocationFormik.handleChange}
                        onBlur={newLocationFormik.handleBlur}
                        value={newLocationFormik.values.name}
                        fullWidth
                      />
                    )}
                  />
                  {newLocationFormik.touched.name &&
                  newLocationFormik.errors.name ? (
                    <Typography color="red">
                      {newLocationFormik.errors.name}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid item paddingY={2}>
                  <InputLabel htmlFor="address">Nome do Endereço:</InputLabel>
                  <Input
                    id="address"
                    type="text"
                    onChange={newLocationFormik.handleChange}
                    onBlur={newLocationFormik.handleBlur}
                    value={newLocationFormik.values.address}
                    fullWidth
                  />
                  {newLocationFormik.touched.address &&
                  newLocationFormik.errors.address ? (
                    <Typography color="red">
                      {newLocationFormik.errors.address}
                    </Typography>
                  ) : null}
                </Grid>
                <Grid
                  item
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-around"
                >
                  <Button onClick={() => setNewLocationModal(false)}>
                    Cancelar
                  </Button>
                  <Button variant="contained" type="submit">
                    Enviar
                  </Button>
                </Grid>
              </Grid>
            </form>
          }
        />
      )}
    </Grid>
  );
};

export default ViewPage;
