import React from 'react';
import { Typography, Box, Divider, Stack } from '@mui/material';

const InfoBlock = ({ title, icon, children }) => (
  <Box sx={{ mb: 0.75 }}>
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <i className={`ri-${icon}`} style={{ fontSize: '0.85rem', color: '#1976d2' }} />
      <Typography sx={{ fontWeight: 500, fontSize: '0.85rem',fontWeight:'700' }}>{title}</Typography>
    </Stack>
    <Typography sx={{ fontSize: '0.75rem',fontWeight:'600', color: 'text.secondary', pl: 2, mt: 0.25 }}>
      {children}
    </Typography>
  </Box>
);

const MetricInfoPanel = () => {
  return (
    <Box sx={{ mt: 2, p: 1, borderRadius: 2, bgcolor: '#f5f5f5' }}>
      <Typography sx={{ mb: 1, fontWeight: 600, fontSize: '0.8rem' }}>
        Physiotherapy Metric Guide
      </Typography>
      <Divider sx={{ mb: 1 }} />

      {/* 🟢 Reaction Metrics */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 0.5 }}>
        Reaction Metrics
      </Typography>
      <InfoBlock title="Average Reaction Time" icon="timer-line">
        Time in seconds (s) it takes to respond. Lower values (1–2s) show better cognitive-motor coordination.
      </InfoBlock>
      <InfoBlock title="Reaction Consistency" icon="pulse-line">
        Standard deviation of reaction times. Lower values indicate stable response speed; higher shows inconsistency.

      </InfoBlock>

      <Divider sx={{ my: 1 }} />

      {/* 🟡 Efficiency */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 0.5 }}>
        Efficiency Metrics
      </Typography>
      <InfoBlock title="Average Efficiency" icon="bar-chart-line">
        {`Percentage (%) of successful target touches. Higher values (>75%) reflect better performance.`}
      </InfoBlock>
      <InfoBlock title="Efficiency Consistency" icon="stack-line">
        Stability of efficiency across targets. Lower variation means consistent effort and focus.
      </InfoBlock>

      <Divider sx={{ my: 1 }} />

      {/* 🔵 Performance */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 0.5 }}>
        Performance Metrics
      </Typography>
      <InfoBlock title="Target Accuracy" icon="checkbox-circle-line">
        Ratio of hits to total targets shown as a percentage. Over 80% is generally considered good accuracy.
      </InfoBlock>
      <InfoBlock title="Reach Range" icon="expand-left-right-line">
        Measured in units (3D space). A larger range implies better limb mobility and joint flexibility.
      </InfoBlock>

      <Divider sx={{ my: 1 }} />

      {/* 🔴 Fatigue */}
      <Typography sx={{ fontWeight: 600, fontSize: '0.7rem', mb: 0.5 }}>
        Fatigue Indicators
      </Typography>
      <InfoBlock title="Reaction Drop" icon="arrow-down-line">
        Increase in reaction time over session (in seconds). Higher drop = more fatigue or mental slowing.
      </InfoBlock>
      <InfoBlock title="Efficiency Drop" icon="arrow-down-s-line">
        {`% decrease in efficiency from first to last rep. Significant drop (>20%) may indicate early fatigue.`}
      </InfoBlock>
    </Box>
  );
};

export default MetricInfoPanel;
