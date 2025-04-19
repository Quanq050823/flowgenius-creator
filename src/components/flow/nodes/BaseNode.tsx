import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Paper, Typography, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';
import { lighten } from '@mui/material/styles';

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
  cursor: 'grab',
  boxShadow: selected 
    ? `0 0 0 2px ${theme.palette.primary.main}, ${theme.shadows[4]}`
    : theme.shadows[2],
  
  '&:hover': {
    boxShadow: `0 0 0 3px ${lighten(nodeColor || theme.palette.grey[300], 0.3)}`,
  },

  '& .MuiSvgIcon-root': {
    fontSize: '32px',
    color: 'white',
  },
}));

const NodeLabel = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  left: '50%',
  transform: 'translateX(-50%)',
  textAlign: 'center',
  marginTop: '8px',
  width: '120px',
}));

const ActionLabel = styled(Typography)(({ theme }) => ({
  fontSize: '11px',
  color: theme.palette.text.secondary,
  marginTop: '2px',
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

const getActionName = (type: string): string => {
  switch (type.toLowerCase()) {
    case 'facebookads':
      return 'Get Hook Ads';
    case 'googlesheets':
      return 'Get Lead';
    case 'aicall':
      return 'Process AI';
    case 'calendar':
      return 'Schedule Event';
    case 'webhook':
      return 'HTTP Request';
    case 'condition':
      return 'Branch Logic';
    case 'email':
      return 'Send Email';
    case 'sms':
      return 'Send Message';
    case 'config':
      return 'Configure';
    case 'error':
      return 'Handle Error';
    default:
      return 'Action';
  }
};

const BaseNode = ({ data, selected, id }: BaseNodeProps) => {
  const nodeColor = data.color || '#94a3b8';
  const actionName = getActionName(id.split('_')[0]);
  
  const inputCount = data.inputs !== undefined ? data.inputs : 1;
  const outputCount = data.outputs !== undefined ? data.outputs : 1;
  
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
      </NodeContainer>
      
      <NodeLabel>
        <Typography variant="body2" sx={{ fontWeight: 500, color: 'text.primary' }}>
          {data.label}
        </Typography>
        <ActionLabel>
          {actionName}
        </ActionLabel>
      </NodeLabel>
      
      {inputPositions.map((pos, index) => (
        <StyledHandle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{ left: -4, top: `${pos * 100}%` }}
        />
      ))}
      
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
