
import React from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  EdgeProps,
} from '@xyflow/react';

interface CustomEdgeData {
  label?: string;
}

// Extend EdgeProps to ensure data is of CustomEdgeData type
interface CustomEdgeProps extends EdgeProps {
  data?: CustomEdgeData;
}

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
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
          {data?.label && (
            <div className="px-2 py-1 bg-white bg-opacity-80 backdrop-filter backdrop-blur-md rounded-md text-xs shadow-sm border border-gray-100">
              {data.label}
            </div>
          )}
          <button
            className="w-6 h-6 rounded-full bg-white shadow-md text-gray-500 flex items-center justify-center ml-auto mr-auto mt-1 hover:bg-gray-50 hover:text-gray-700 transition-colors border border-gray-200"
            onClick={onEdgeClick}
          >
            ×
          </button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default CustomEdge;
