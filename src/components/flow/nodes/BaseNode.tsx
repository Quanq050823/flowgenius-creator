
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Paper, Typography, Chip, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

type BaseNodeProps = {
  data: {
    label: string;
    icon?: React.ReactNode;
    description?: string;
    type: string;
    subType?: string;
    inputs?: number;
    outputs?: number;
    color?: string;
  };
  selected: boolean;
  id: string;
};

const NodeContainer = styled(Paper, {
  shouldForwardProp: (prop) => prop !== 'selected' && prop !== 'nodeColor',
})<{ selected?: boolean; nodeColor?: string }>(({ theme, selected, nodeColor }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  backgroundColor: nodeColor || theme.palette.grey[300],
  position: 'relative',
  transition: 'all 0.2s ease-in-out',
  cursor: 'grab',
  boxShadow: selected 
    ? `0 0 0 2px ${theme.palette.primary.main}, ${theme.shadows[4]}`
    : theme.shadows[2],
  
  '&:hover': {
    boxShadow: `0 0 0 2px ${nodeColor || theme.palette.grey[300]}, ${theme.shadows[6]}`,
    transform: 'scale(1.02)',
    
    '& .node-label': {
      opacity: 1,
      transform: 'translateY(0)',
    }
  },

  '& .MuiSvgIcon-root': {
    fontSize: '24px',
    color: 'white',
  },
}));

const NodeLabel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%) translateY(5px)',
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '4px 8px',
  borderRadius: '4px',
  fontSize: '12px',
  whiteSpace: 'nowrap',
  opacity: 0,
  transition: 'all 0.2s ease-in-out',
  marginTop: '4px',
  pointerEvents: 'none',
}));

const StyledHandle = styled(Handle)(({ theme }) => ({
  width: '8px',
  height: '8px',
  backgroundColor: '#fff',
  border: '2px solid #778899',
  transition: 'all 0.2s ease',
  
  '&:hover': {
    backgroundColor: theme.palette.primary.main,
    borderColor: theme.palette.primary.dark,
    transform: 'scale(1.2)',
  },
}));

const BaseNode = ({ data, selected, id }: BaseNodeProps) => {
  const nodeColor = data.color || '#94a3b8';
  
  // Determine the number of input and output handles
  const inputCount = data.inputs !== undefined ? data.inputs : 1;
  const outputCount = data.outputs !== undefined ? data.outputs : 1;
  
  // Calculate positions for multiple handles
  const getHandlePositions = (count: number) => {
    if (count === 1) return [0.5];
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      positions.push((i / (count - 1)) * 0.8 + 0.1);
    }
    return positions;
  };
  
  const inputPositions = getHandlePositions(inputCount);
  const outputPositions = getHandlePositions(outputCount);

  return (
    <Box sx={{ position: 'relative' }}>
      <NodeContainer selected={selected} nodeColor={nodeColor}>
        {data.icon}
        <NodeLabel className="node-label">
          {data.label}
        </NodeLabel>
      </NodeContainer>
      
      {/* Input Handles */}
      {inputPositions.map((pos, index) => (
        <StyledHandle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{ left: -4, top: `${pos * 100}%` }}
        />
      ))}
      
      {/* Output Handles */}
      {outputPositions.map((pos, index) => (
        <StyledHandle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          style={{ right: -4, top: `${pos * 100}%` }}
        />
      ))}
    </Box>
  );
};

export default memo(BaseNode);
