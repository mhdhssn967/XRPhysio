import React from "react";
import { Grid, Paper, Typography, Box, Stack } from "@mui/material";
import './SessionStats.css'

// 📦 MetricCard: Compact stat box with icon
const MetricCard = ({ label, value, icon }) => (
  <Grid item xs={6} sm={4} md={3} >
    <Paper
      elevation={0}
      sx={{
        p: 1,
        borderRadius: 1,
        minHeight: 30,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems:'center',
        background:'none'
      }}
    >
      <Stack direction="row" spacing={1} alignItems="center">
        <i
          className={`ri-${icon}`}
          style={{ fontSize: "1.2rem", color: "#1976d2" }}
        />
        <Typography
          variant="subtitle2"
          color="text.secondary"
          sx={{ fontSize: "0.75rem" }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        fontWeight={600}
        sx={{ fontSize: "0.85rem", mt: 0.5 }}
      >
        {value}
      </Typography>
    </Paper>
  </Grid>
);

// 🚀 rafce-style exported component
const SessionStats = ({ processedPhysioData }) => {
  if (!processedPhysioData) return null;


  return (
    <Box sx={{ mt: 2 }}>
  <div className="stat-container">
  {/* 🟢 Reaction Metrics */}
  <div className="stat-card">
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        Reaction Metrics
      </Typography>
      <Grid container sx={{display:'flex',justifyContent:'center'}} spacing={0.5} wrap="wrap">
        <MetricCard
          label="Avg. Reaction Time"
          value={
            processedPhysioData?.averageReactionTime != null
              ? `${processedPhysioData.averageReactionTime}s`
              : 'N/A'
          }
          icon="timer-line"
        />
        <MetricCard
          label="Reaction Consistency"
          value={
            processedPhysioData?.reactionConsistency != null
              ? `${processedPhysioData.reactionConsistency}s`
              : 'N/A'
          }
          icon="pulse-line"
        />
      </Grid>
    
  </div>
  {/* 🟡 Efficiency Metrics */}
  <div className="stat-card">
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        Efficiency Metrics
      </Typography>
      <Grid container sx={{display:'flex',justifyContent:'center'}} spacing={0.5} wrap="wrap">
        <MetricCard
          label="Avg. Efficiency"
          value={
            processedPhysioData?.averageEfficiency != null
              ? `${processedPhysioData.averageEfficiency}%`
              : 'N/A'
          }
          icon="bar-chart-line"
        />
        <MetricCard
          label="Efficiency Consistency"
          value={
            processedPhysioData?.efficiencyConsistency != null
              ? `${processedPhysioData.efficiencyConsistency.toFixed(2)}%`
              : 'N/A'
          }
          icon="stack-line"
        />
      </Grid>
  </div>

  {/* 🔵 Performance Metrics */}
  <div className="stat-card">
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        Performance Metrics
      </Typography>
      <Grid container sx={{display:'flex',justifyContent:'center'}} spacing={0.5} wrap="wrap">
        <MetricCard
          label="Target Accuracy"
          value={
            processedPhysioData?.totalTargetAccuracy != null
              ? `${(processedPhysioData.totalTargetAccuracy * 100).toFixed(1)}%`
              : 'N/A'
          }
          icon="checkbox-circle-line"
        />
        <MetricCard
          label="Reach Range"
          value={
            processedPhysioData?.averageReachRange != null
              ? `${processedPhysioData.averageReachRange} units`
              : 'N/A'
          }
          icon="expand-left-right-line"
        />
      </Grid>
  </div>

  {/* 🔴 Fatigue Indicators */}
  <div className="stat-card">
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, fontWeight: 'bold' }}>
        Fatigue Indicators
      </Typography>
      <Grid container sx={{display:'flex',justifyContent:'center'}} spacing={0.5} wrap="wrap">
        <MetricCard
          label="Reaction Drop"
          value={
            processedPhysioData?.fatigueTrend?.reactionDrop != null
              ? `${processedPhysioData.fatigueTrend.reactionDrop}s`
              : 'N/A'
          }
          icon="arrow-down-line"
        />
        <MetricCard
          label="Efficiency Drop"
          value={
            processedPhysioData?.fatigueTrend?.efficiencyDrop != null
              ? `${processedPhysioData.fatigueTrend.efficiencyDrop}%`
              : 'N/A'
          }
          icon="arrow-down-s-line"
        />
      </Grid>
  </div>
</div>
</Box>

  );
};

export default SessionStats;
