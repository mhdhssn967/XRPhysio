// src/components/schedule_components/ScheduleList.jsx
import React, { useEffect, useState } from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, IconButton, Typography
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Swal from "sweetalert2";
import { deleteTherapySchedule, getTherapySchedules } from "../../firebase/schedules";

const ScheduleList = ({ userId,triggerRefresh, setTriggerRefresh }) => {
  const [schedules, setSchedules] = useState([]);

  const fetchSchedules = async () => {
    const data = await getTherapySchedules(userId);
    setSchedules(data);
  };

  const handleDelete = async (scheduleId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the schedule!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await deleteTherapySchedule(userId, scheduleId);
        if (res.success) {
          Swal.fire({
            icon: "success",
            title: "Deleted!",
            text: "The schedule has been deleted.",
            timer: 1500,
            showConfirmButton: false,
            toast: true,
            position: "top-end",
          });
          fetchSchedules();
        } else {
          Swal.fire("Error", "Failed to delete schedule", "error");
        }
      }
    });
  };

  useEffect(() => {
    fetchSchedules();
  }, [triggerRefresh]);

  return (
    <TableContainer component={Paper} sx={{ mt: 3, borderRadius: 1, boxShadow: 0,maxWidth:1400,margin: "20px 10px" }}>
      
      <Table>
        <TableHead sx={{ backgroundColor: "var(--primary-color)" }}>
          <TableRow >
            <TableCell ><b style={{color:'white'}}>Patient Name</b></TableCell>
            <TableCell><b style={{color:'white'}}>Game</b></TableCell>
            <TableCell><b style={{color:'white'}}>Scheduled Date & Time</b></TableCell>
            <TableCell><b style={{color:'white'}}>Note</b></TableCell>
            {/* <TableCell><b style={{color:'white'}}>Status</b></TableCell> */}
            <TableCell align="center"><b style={{color:'white'}}>Action</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {schedules.length > 0 ? (
            schedules.map((s) => (
              <TableRow key={s.id}>
                <TableCell>{s.patientName}</TableCell>
                <TableCell>{s.gameName}</TableCell>
                <TableCell>
                  {new Date(s.scheduledDateTime.seconds * 1000).toLocaleString()}
                </TableCell>
                <TableCell>{s.note || "-"}</TableCell>
                {/* <TableCell>{s.status}</TableCell> */}
                <TableCell align="center">
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(s.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} align="center">
                No schedules found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default ScheduleList;
