// src/components/AddSchedule.js
import React, { useEffect, useState } from "react";
import {
  Modal,
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { addTherapySchedule } from "../../firebase/schedules";
import { getPatientData } from "../../firebase/services";
import { fetchGameDetails } from "../../firebase/helpers";
import Swal from "sweetalert2";




const AddSchedule = ({ userId, triggerRefresh, setTriggerRefresh }) => {
  const [open, setOpen] = useState(false);
  const [patientId, setPatientId] = useState("");
  const [patientName,setPatientName]=useState('')
  const [gameName, setGameName] = useState("");
  const [note, setNote] = useState("");
  const [dateTime, setDateTime] = useState(new Date());
  const [patients,setPatients]=useState([])
  const [focusPoints,setFocusPoints]=useState([]);


    useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const data = await getPatientData(userId);
        setPatients(data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setPatients(null);
      }
    };
    fetchPatientData(); // Call the function inside useEffect
  }, [userId]);

  useEffect(() => {
    const getGameDetails = async () => {
      try {
        const data = await fetchGameDetails();
        const uniqueFocusPoints = [
      ...new Set(data.map(item => item.focus))
    ];
    setFocusPoints(uniqueFocusPoints)
        
      } catch (error) {
        console.error('Error fetching games:', error);
        setPatients(null);
      }
    };
    getGameDetails(); // Call the function inside useEffect
  }, [userId])
  

  const handleSubmit = async () => {
  if (!patientId || !gameName || !dateTime) {
    Swal.fire({
      icon: "warning",
      title: "Missing Fields",
      text: "Please fill all fields!",
      timer: 2500,                // auto close after 1.5 sec
      showConfirmButton: false,
      position: "top-end",        // optional (like a toast)
      toast: true,                // makes it small and sleek
    });
    return;
  }

  const newSchedule = {
    patientId,
    patientName,
    gameName,
    note,
    scheduledDateTime: dateTime,
    status: "scheduled",
    createdAt: new Date(),
  };

  const res = await addTherapySchedule(userId, newSchedule);
  if (res.success) {
    Swal.fire({
      icon: "success",
      title: "Schedule Added!",
      timer: 1500,                // auto close
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
    handleClose(); // close modal right away
    setTriggerRefresh(!triggerRefresh)
  } else {
    Swal.fire({
      icon: "error",
      title: "Failed to Add",
      timer: 1500,
      showConfirmButton: false,
      position: "top-end",
      toast: true,
    });
  }
};


  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handlePatientChange = (e) => {
  const selectedId = e.target.value;
  setPatientId(selectedId);

  // find the selected patient object
  const selectedPatient = patients.find((p) => p.id === selectedId);
  if (selectedPatient) {
    setPatientName(selectedPatient.name);
  }
};

  return (
    <div style={{margin:'10px'}}>
      <Button variant="contained" style={{backgroundColor:'var(--primary-color'}} onClick={handleOpen}>
        + Add Therapy Schedule
      </Button>

      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            minWidth: 400,
          }}
        >
          <h2>Add New Therapy Schedule</h2>

          {/* Select Patient */}
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Patient</InputLabel>
            <Select
  value={patientId}
  onChange={handlePatientChange}
>
  {patients.map((p) => (
    <MenuItem key={p.id} value={p.id}>
      {p.name}
    </MenuItem>
  ))}
</Select>
          </FormControl>

          {/* Select Game */}
          <FormControl fullWidth sx={{ mt: 2,mb:3 }}>
            <InputLabel>Focus</InputLabel>
            <Select
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
            >
              {focusPoints.map((g) => (
                <MenuItem key={g} value={g}>
                  {g}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date Time Picker */}
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateTimePicker
              label="Select Date & Time"
              value={dateTime}
              onChange={(newValue) => setDateTime(newValue)}
              renderInput={(params) => (
                <TextField {...params} fullWidth sx={{ mt: 2 }} />
              )}
            />
          </LocalizationProvider>

          {/* Notes */}
          <TextField
            fullWidth
            label="Notes"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            sx={{ mt: 2 }}
          />

          {/* Actions */}
          <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
            <Button onClick={handleClose} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default AddSchedule;
