
import React from 'react';
import { useReactFlow } from '@xyflow/react';
import { 
  Save, 
  Upload, 
  Download, 
  Play, 
  Trash, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Layout
} from 'lucide-react';

type FlowToolbarProps = {
  onSave: () => void;
  onLoad: () => void;
  onExport: () => void;
  onClear: () => void;
  onRun: () => void;
};

const FlowToolbar: React.FC<FlowToolbarProps> = ({
  onSave,
  onLoad,
  onExport,
  onClear,
  onRun,
}) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  
  return (
    <div className="fixed top-4 right-4 z-10 flex items-center bg-white shadow-md rounded-lg overflow-hidden border border-gray-200">
      <button
        onClick={onSave}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Save Flow"
      >
        <Save size={18} />
      </button>
      
      <button
        onClick={onLoad}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Load Flow"
      >
        <Upload size={18} />
      </button>
      
      <button
        onClick={onExport}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Export Flow"
      >
        <Download size={18} />
      </button>
      
      <button
        onClick={() => zoomIn()}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Zoom In"
      >
        <ZoomIn size={18} />
      </button>
      
      <button
        onClick={() => zoomOut()}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Zoom Out"
      >
        <ZoomOut size={18} />
      </button>
      
      <button
        onClick={() => fitView()}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Fit View"
      >
        <Layout size={18} />
      </button>
      
      <button
        onClick={onClear}
        className="p-2 text-gray-700 hover:bg-gray-100 border-r border-gray-200 flex items-center justify-center"
        title="Clear Flow"
      >
        <Trash size={18} />
      </button>
      
      <button
        onClick={onRun}
        className="p-2 bg-primary text-white hover:bg-opacity-90 flex items-center justify-center"
        title="Run Flow"
      >
        <Play size={18} />
      </button>
    </div>
  );
};

export default FlowToolbar;
