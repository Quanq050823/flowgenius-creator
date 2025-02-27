
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
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

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
import { toast } from '@/components/ui/use-toast';

// Define node types
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

// Define edge types
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
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

const FlowEditorContent = () => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [showPropertiesPanel, setShowPropertiesPanel] = useState<boolean>(false);

  const { project } = useReactFlow();

  // Handle node drag from sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const type = event.dataTransfer.getData('application/reactflow');

      // Check if the dropped element is valid
      if (typeof type === 'undefined' || !type || !reactFlowBounds || !reactFlowInstance) {
        return;
      }

      const position = reactFlowInstance.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      // Create a unique ID
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

  // Helper function to get node label based on type
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

  // Helper function to get node description based on type
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

  // Handle connection between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge = {
        ...params,
        id: `e_${params.source}_${params.target}_${Date.now()}`,
        data: { label: 'Connection' },
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNode(node);
      setShowPropertiesPanel(true);
    },
    []
  );

  // Handle background click (deselect nodes)
  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
    setShowPropertiesPanel(false);
  }, []);

  // Update node data when properties change
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

  // Handle drag start from sidebar
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  // Save the current flow
  const onSave = useCallback(() => {
    if (reactFlowInstance) {
      const flowData = reactFlowInstance.toObject();
      localStorage.setItem('flow-data', JSON.stringify(flowData));
      toast({
        title: 'Flow Saved',
        description: 'Your flow has been saved successfully.',
        variant: 'default',
      });
    }
  }, [reactFlowInstance]);

  // Load a saved flow
  const onLoad = useCallback(() => {
    const savedFlow = localStorage.getItem('flow-data');
    if (savedFlow) {
      const flowData = JSON.parse(savedFlow);
      setNodes(flowData.nodes || []);
      setEdges(flowData.edges || []);
      toast({
        title: 'Flow Loaded',
        description: 'Your saved flow has been loaded successfully.',
        variant: 'default',
      });
    } else {
      toast({
        title: 'No Saved Flow',
        description: 'There is no saved flow to load.',
        variant: 'destructive',
      });
    }
  }, [setNodes, setEdges]);

  // Export flow as JSON
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
      
      toast({
        title: 'Flow Exported',
        description: 'Your flow has been exported as JSON.',
        variant: 'default',
      });
    }
  }, [reactFlowInstance]);

  // Clear the current flow
  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setShowPropertiesPanel(false);
    toast({
      title: 'Flow Cleared',
      description: 'Your flow has been cleared.',
      variant: 'default',
    });
  }, [setNodes, setEdges]);

  // Simulate running the flow
  const onRun = useCallback(() => {
    if (nodes.length === 0) {
      toast({
        title: 'Empty Flow',
        description: 'Please add nodes to your flow before running.',
        variant: 'destructive',
      });
      return;
    }
    
    setIsRunning(true);
    setProgressPercent(0);
    
    // Simulate progress
    const totalSteps = 20;
    let currentStep = 0;
    
    const interval = setInterval(() => {
      currentStep += 1;
      setProgressPercent((currentStep / totalSteps) * 100);
      
      if (currentStep >= totalSteps) {
        clearInterval(interval);
        setIsRunning(false);
        toast({
          title: 'Flow Execution Complete',
          description: 'Your flow has been executed successfully.',
          variant: 'default',
        });
      }
    }, 150);
    
  }, [nodes]);

  return (
    <div className="w-full h-screen flex relative">
      {/* Sidebar with node types */}
      <Sidebar onDragStart={onDragStart} />
      
      {/* Flow editor */}
      <div className="flex-grow h-full" ref={reactFlowWrapper}>
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
          
          {/* Flow execution progress bar */}
          {isRunning && (
            <div className="flow-progress-bar">
              <div className="flow-progress-indicator" style={{ width: `${progressPercent}%` }}></div>
            </div>
          )}
          
          {/* Flow toolbar */}
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
      </div>
      
      {/* Properties panel */}
      {showPropertiesPanel && (
        <PropertiesPanel 
          selectedNode={selectedNode}
          onChange={onNodeDataChange}
          onClose={() => setShowPropertiesPanel(false)}
        />
      )}
    </div>
  );
};

// Wrap the component with ReactFlowProvider
const FlowEditor: React.FC = () => {
  return (
    <div className="h-screen w-full overflow-hidden bg-gray-50">
      <ReactFlowProvider>
        <FlowEditorContent />
      </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;
