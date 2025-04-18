import React, { useState, useCallback, useRef } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  Connection,
  Edge,
  Node,
  useReactFlow,
  MarkerType,
  ReactFlowInstance,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, CssBaseline, LinearProgress, ThemeProvider, createTheme } from '@mui/material';

import Sidebar from './Sidebar';
import PropertiesPanel from './PropertiesPanel';
import CustomEdge from './edges/CustomEdge';
import FlowToolbar from './FlowToolbar';
import {
  GoogleSheetsNode,
  FacebookAdsNode,
  AICallNode,
  CalendarNode,
  WebhookNode,
  ConditionNode,
  EmailNode,
  SMSNode,
  ConfigNode,
  ErrorNode,
} from './nodes/NodeTypes';
import { CustomEdgeData } from './edges/CustomEdge';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3b82f6',
    },
    secondary: {
      main: '#10b981',
    },
    error: {
      main: '#ef4444',
    },
    warning: {
      main: '#f59e0b',
    },
    info: {
      main: '#6366f1',
    },
    success: {
      main: '#22c55e',
    },
  },
});

const nodeTypes = {
  googleSheets: GoogleSheetsNode,
  facebookAds: FacebookAdsNode,
  aiCall: AICallNode,
  calendar: CalendarNode,
  webhook: WebhookNode,
  condition: ConditionNode,
  email: EmailNode,
  sms: SMSNode,
  config: ConfigNode,
  error: ErrorNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const defaultEdgeOptions = {
  type: 'custom',
  markerEnd: {
    type: MarkerType.ArrowClosed,
    width: 20,
    height: 20,
  },
  animated: true,
  style: {
    strokeWidth: 2,
    stroke: '#b1b1b7',
  },
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

interface FlowData {
  nodes: Node[];
  edges: Edge[];
}

const FlowEditorContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(false);

  const reactFlowUtil = useReactFlow();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const id = `${type}_${Date.now()}`;

      const newNode: Node = {
        id,
        type,
        position,
        data: {
          label: getNodeLabel(type),
          description: getNodeDescription(type),
          settings: {},
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const getNodeLabel = (type: string): string => {
    switch (type) {
      case 'googleSheets':
        return 'Google Sheets';
      case 'facebookAds':
        return 'Facebook Ads';
      case 'aiCall':
        return 'AI Call';
      case 'calendar':
        return 'Google Calendar';
      case 'webhook':
        return 'Webhook';
      case 'condition':
        return 'Condition';
      case 'email':
        return 'Send Email';
      case 'sms':
        return 'Send SMS';
      case 'config':
        return 'Configuration';
      case 'error':
        return 'Error Handler';
      default:
        return 'Unknown Node';
    }
  };

  const getNodeDescription = (type: string): string => {
    switch (type) {
      case 'googleSheets':
        return 'Import leads from Google Sheets';
      case 'facebookAds':
        return 'Import leads from Facebook Ads';
      case 'aiCall':
        return 'Process data with AI';
      case 'calendar':
        return 'Schedule appointments';
      case 'webhook':
        return 'Send data to external system';
      case 'condition':
        return 'Branch based on conditions';
      case 'email':
        return 'Send email notification';
      case 'sms':
        return 'Send SMS notification';
      case 'config':
        return 'Configure flow settings';
      case 'error':
        return 'Handle errors in the flow';
      default:
        return '';
    }
  };

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge<CustomEdgeData> = {
        ...params,
        id: `e_${params.source}_${params.target}_${Date.now()}`,
        data: { label: 'Connection' } as CustomEdgeData,
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setShowPropertiesPanel(true);
    },
    []
  );

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, []);

  const onNodeDataChange = useCallback(
    (id: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return { ...node, data: { ...data } };
          }
          return node;
        })
      );
    },
    [setNodes]
  );

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flowData = reactFlowInstance.toObject();
      localStorage.setItem('flow-data', JSON.stringify(flowData));
    }
  }, [reactFlowInstance]);

  const onLoad = useCallback(() => {
    const savedFlow = localStorage.getItem('flow-data');
    if (savedFlow) {
      try {
        const flowData = JSON.parse(savedFlow) as FlowData;
        const typedEdges = flowData.edges.map(edge => ({
          ...edge,
          data: edge.data || { label: 'Connection' }
        })) as Edge<CustomEdgeData>[];
        
        setNodes(flowData.nodes);
        setEdges(typedEdges);
      } catch (error) {
        console.error('Error loading flow:', error);
      }
    }
  }, [setNodes, setEdges]);

  const onExport = useCallback(() => {
    if (reactFlowInstance) {
      const flowData = reactFlowInstance.toObject();
      const jsonString = JSON.stringify(flowData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'flow-export.json';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }, [reactFlowInstance]);

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, [setNodes, setEdges]);

  const onRun = useCallback(() => {
    if (nodes.length === 0) {
      return;
    }
    
    setIsRunning(true);
    setProgressPercent(0);
    
    const totalSteps = 20;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep += 1;
      setProgressPercent((currentStep / totalSteps) * 100);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 150);
  }, [nodes]);

  return (
    <Box sx={{ width: '100%', height: '100vh', display: 'flex', position: 'relative' }}>
      <Sidebar onDragStart={onDragStart} />
      
      <Box
        ref={reactFlowWrapper}
        sx={{ flexGrow: 1, height: '100%' }}
      >
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onInit={setReactFlowInstance}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={defaultEdgeOptions}
          fitView
          snapToGrid
          snapGrid={[10, 10]}
          attributionPosition="bottom-left"
        >
          <Background gap={12} size={1} color="#f1f1f1" />
          <Controls />
          <MiniMap 
            nodeStrokeWidth={3}
            nodeColor={(node) => {
              switch (node.type) {
                case 'googleSheets':
                case 'facebookAds':
                  return '#3B82F6';
                case 'aiCall':
                case 'webhook':
                case 'calendar':
                  return '#10B981';
                case 'condition':
                  return '#F59E0B';
                case 'email':
                case 'sms':
                  return '#EC4899';
                default:
                  return '#94A3B8';
              }
            }}
            maskColor="rgba(240, 240, 240, 0.6)"
          />
          
          {isRunning && (
            <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
              <LinearProgress variant="determinate" value={progressPercent} />
            </Box>
          )}
          
          <Panel position="top-right">
            <FlowToolbar 
              onSave={onSave}
              onLoad={onLoad}
              onExport={onExport}
              onClear={onClear}
              onRun={onRun}
            />
          </Panel>
        </ReactFlow>
      </Box>
      
      {showPropertiesPanel && (
        <PropertiesPanel 
          selectedNode={selectedNode}
          onChange={onNodeDataChange}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </Box>
  );
};

const FlowEditor: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: '100vh', width: '100%', overflow: 'hidden', bgcolor: 'grey.50' }}>
        <ReactFlowProvider>
          <FlowEditorContent />
        </ReactFlowProvider>
      </Box>
    </ThemeProvider>
  );
};

export default FlowEditor;
