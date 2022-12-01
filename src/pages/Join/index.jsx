import {
  Box,
  Button,
  Card,
  Chip,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.scss";

const JoinPage = () => {
  const navigate = useNavigate();

  const [locations, setLocations] = useState([]);
  const [selectedLocations, setSelectedLocations] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/locations`, {
      method: "GET",
    })
      .then((data) => data.json())
      .then((response) => {
        setLocations(response.data);
      });
  }, []);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedLocations(typeof value === "string" ? value.split(",") : value);
  };

  const handleSubmit = () => {
    navigate(`/view?locations=${selectedLocations}`);
  };

  return (
    <Box display="flex" className="container" justifyContent="space-around">
      <Card variant="outlined" className="card">
        <Typography variant="h6" className="title">
          Controle de fluxo de àgua de bueiros e bocas de lobos
        </Typography>
        <Typography variant="subtitle1">
          Selecione as localidades que deseja acompanhar ou deixe em branco para
          acompanhar todos:
        </Typography>
        <Stack spacing={3}>
          <Select
            multiple
            value={selectedLocations}
            onChange={handleChange}
            input={<OutlinedInput label="chip" />}
            renderValue={(selected) => (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={value} />
                ))}
              </Box>
            )}
          >
            {locations.map((location) => (
              <MenuItem key={location} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
          <Button variant="contained" onClick={handleSubmit}>
            Confirmar
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default JoinPage;
