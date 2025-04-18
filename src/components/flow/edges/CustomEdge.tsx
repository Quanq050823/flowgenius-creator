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

// Define the interface for edge data that extends Record<string, unknown>
export interface CustomEdgeData extends Record<string, unknown> {
  label?: string;
}

// Define the edge props that extend the base EdgeProps
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

const EdgeLabel = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(0.5, 1),
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(8px)',
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  border: `1px solid ${theme.palette.primary.light}`,
  fontSize: '0.75rem',
  transition: theme.transitions.create(['transform', 'box-shadow']),
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[4],
  },
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
  markerEnd,
  data,
}: CustomEdgeProps) => {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const onEdgeClick = (evt: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    evt.stopPropagation();
    setEdges((edges) => edges.filter((edge) => edge.id !== id));
  };

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Box
          sx={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <EdgeLabel>
              <Typography variant="caption">{data.label}</Typography>
            </EdgeLabel>
          )}
          <EdgeButton
            size="small"
            onClick={onEdgeClick}
          >
            ×
          </EdgeButton>
        </Box>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
