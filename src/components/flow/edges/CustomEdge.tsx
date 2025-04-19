
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';
import { Button, Box, Typography, Paper, IconButton } from '@mui/material';
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

const EdgePath = styled('path')(({ theme }) => ({
  stroke: theme.palette.grey[400],
  strokeWidth: 2,
  fill: 'none',
  strokeDasharray: '0',
}));

const EdgeDot = styled('div')<{ $color?: string; $isEndpoint?: boolean }>(({ $color, $isEndpoint }) => ({
  width: $isEndpoint ? '12px' : '6px',
  height: $isEndpoint ? '12px' : '6px',
  backgroundColor: $color || '#94a3b8',
  borderRadius: '50%',
  position: 'absolute',
  transform: 'translate(-50%, -50%)',
  boxShadow: '0 0 4px rgba(0,0,0,0.2)',
  zIndex: 5,
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
    curvature: 0.2,
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

  // First, draw an underlying path to make the connection more visible
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    
    // Calculate points along Bezier curve
    const xDiff = targetX - sourceX;
    const yDiff = targetY - sourceY;
    const cp1x = sourceX + 0.4 * xDiff;
    const cp1y = sourceY;
    const cp2x = sourceX + 0.6 * xDiff;
    const cp2y = targetY;
    
    // Bezier formula
    const x = (1-t)*(1-t)*(1-t)*sourceX + 3*(1-t)*(1-t)*t*cp1x + 3*(1-t)*t*t*cp2x + t*t*t*targetX;
    const y = (1-t)*(1-t)*(1-t)*sourceY + 3*(1-t)*(1-t)*t*cp1y + 3*(1-t)*t*t*cp2y + t*t*t*targetY;
    
    const color = `rgba(
      ${parseInt(sourceColor.slice(1, 3), 16) * (1 - t) + parseInt(targetColor.slice(1, 3), 16) * t},
      ${parseInt(sourceColor.slice(3, 5), 16) * (1 - t) + parseInt(targetColor.slice(3, 5), 16) * t},
      ${parseInt(sourceColor.slice(5, 7), 16) * (1 - t) + parseInt(targetColor.slice(5, 7), 16) * t},
      0.8
    )`;
    
    points.push({ x, y, t, color });
  }

  return (
    <>
      <EdgePath d={edgePath} style={{...style, strokeOpacity: 0.2}} />
      
      {points.map((point, index) => {
        const isEndpoint = index === 0 || index === points.length - 1;
        
        return (
          <EdgeDot
            key={index}
            $color={point.color}
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
            <Paper sx={{ p: 0.5, backgroundColor: 'rgba(255, 255, 255, 0.9)', mb: 0.5 }}>
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
