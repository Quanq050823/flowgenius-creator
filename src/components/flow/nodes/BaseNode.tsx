
import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';

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

const BaseNode = ({ data, selected, id }: BaseNodeProps) => {
  const nodeColor = data.color || '#94a3b8';
  
  // Determine the number of input and output handles
  const inputCount = data.inputs !== undefined ? data.inputs : 1;
  const outputCount = data.outputs !== undefined ? data.outputs : 1;
  
  // Calculate positions for multiple handles
  const getHandlePositions = (count: number) => {
    if (count === 1) return [0.5]; // Center if only one
    
    const positions: number[] = [];
    for (let i = 0; i < count; i++) {
      positions.push((i / (count - 1)) * 0.8 + 0.1); // Distribute between 0.1 and 0.9
    }
    return positions;
  };
  
  const inputPositions = getHandlePositions(inputCount);
  const outputPositions = getHandlePositions(outputCount);

  return (
    <div className={`react-flow__node-custom ${selected ? 'selected fade-in' : ''}`}>
      <div className="node-header">
        <div className="node-header-icon" style={{ backgroundColor: nodeColor }}>
          {data.icon || '●'}
        </div>
        <div className="node-title">{data.label}</div>
      </div>
      
      <div className="node-content">
        {data.description && <p className="mb-2">{data.description}</p>}
        <div className="flex items-center space-x-1">
          <span className="node-badge bg-gray-100 text-gray-600">{data.type}</span>
          {data.subType && (
            <span className="node-badge bg-gray-100 text-gray-600">{data.subType}</span>
          )}
        </div>
      </div>
      
      <div className="node-footer">
        <span className="text-xs text-gray-400">ID: {id.slice(0, 8)}</span>
      </div>
      
      {/* Input Handles */}
      {inputPositions.map((pos, index) => (
        <Handle
          key={`input-${index}`}
          type="target"
          position={Position.Left}
          id={`input-${index}`}
          style={{ left: 0, top: `${pos * 100}%` }}
          className="react-flow__handle"
        />
      ))}
      
      {/* Output Handles */}
      {outputPositions.map((pos, index) => (
        <Handle
          key={`output-${index}`}
          type="source"
          position={Position.Right}
          id={`output-${index}`}
          style={{ right: 0, top: `${pos * 100}%` }}
          className="react-flow__handle"
        />
      ))}
    </div>
  );
};

export default memo(BaseNode);
