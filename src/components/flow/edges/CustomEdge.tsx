
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';
import { Button, Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';

export interface CustomEdgeData extends Record<string, unknown> {
  label?: string;
  sourceColor?: string;
  targetColor?: string;
}

export interface CustomEdgeProps extends Omit<EdgeProps, 'data'> {
  data?: CustomEdgeData;
}

const EdgeButton = styled(Button)(({ theme }) => ({
  minWidth: '24px',
  width: '24px',
  height: '24px',
  padding: 0,
  borderRadius: '50%',
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.grey[500],
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.grey[200]}`,
  transition: theme.transitions.create(['background-color', 'color', 'box-shadow']),
  '&:hover': {
    backgroundColor: theme.palette.grey[50],
    color: theme.palette.error.main,
    boxShadow: theme.shadows[4],
  },
}));

const EdgeDot = styled('div')<{ $color?: string; $isEndpoint?: boolean }>(({ $color, $isEndpoint }) => ({
  width: $isEndpoint ? '12px' : '6px',
  height: $isEndpoint ? '12px' : '6px',
  backgroundColor: $color || '#94a3b8',
  borderRadius: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
}));

const CustomEdge = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  data,
}: CustomEdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetPosition,
    targetX,
    targetY,
  });

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  // Calculate points along the path for dots
  const points = [];
  const numPoints = 8;
  const sourceColor = data?.sourceColor || '#94a3b8';
  const targetColor = data?.targetColor || '#94a3b8';

  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const x = sourceX + (targetX - sourceX) * t;
    const y = sourceY + (targetY - sourceY) * t;
    points.push({ x, y, t });
  }

  return (
    <>
      {points.map((point, index) => {
        const isEndpoint = index === 0 || index === points.length - 1;
        const color = `rgba(
          ${parseInt(sourceColor.slice(1, 3), 16) * (1 - point.t) + parseInt(targetColor.slice(1, 3), 16) * point.t},
          ${parseInt(sourceColor.slice(3, 5), 16) * (1 - point.t) + parseInt(targetColor.slice(3, 5), 16) * point.t},
          ${parseInt(sourceColor.slice(5, 7), 16) * (1 - point.t) + parseInt(targetColor.slice(5, 7), 16) * point.t}
        )`;

        return (
          <EdgeDot
            key={index}
            $color={color}
            $isEndpoint={isEndpoint}
            style={{
              left: point.x,
              top: point.y,
            }}
          />
        );
      })}

      <EdgeLabelRenderer>
        <Box
          sx={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <Paper sx={{ p: 0.5, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
              <Typography variant="caption">{data.label}</Typography>
            </Paper>
          )}
          <EdgeButton size="small" onClick={onEdgeClick}>×</EdgeButton>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
