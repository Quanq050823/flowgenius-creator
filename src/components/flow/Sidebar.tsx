
import React from 'react';
import {
  FileSpreadsheet,
  Facebook,
  Bot,
  Calendar,
  Webhook,
  SplitSquareVertical,
  Mail,
  Phone,
  Settings,
  AlertCircle,
} from 'lucide-react';

type NodeCategory = {
  title: string;
  items: NodeItem[];
};

type NodeItem = {
  type: string;
  label: string;
  icon: React.ReactNode;
  color: string;
};

const nodeCategories: NodeCategory[] = [
  {
    title: 'Data Sources',
    items: [
      {
        type: 'googleSheets',
        label: 'Google Sheets',
        icon: <FileSpreadsheet size={14} />,
        color: '#34A853',
      },
      {
        type: 'facebookAds',
        label: 'Facebook Ads',
        icon: <Facebook size={14} />,
        color: '#1877F2',
      },
    ],
  },
  {
    title: 'Processing',
    items: [
      {
        type: 'aiCall',
        label: 'AI Call',
        icon: <Bot size={14} />,
        color: '#10B981',
      },
      {
        type: 'calendar',
        label: 'Google Calendar',
        icon: <Calendar size={14} />,
        color: '#4285F4',
      },
      {
        type: 'webhook',
        label: 'Webhook',
        icon: <Webhook size={14} />,
        color: '#8B5CF6',
      },
      {
        type: 'condition',
        label: 'Condition',
        icon: <SplitSquareVertical size={14} />,
        color: '#F59E0B',
      },
    ],
  },
  {
    title: 'Actions',
    items: [
      {
        type: 'email',
        label: 'Send Email',
        icon: <Mail size={14} />,
        color: '#EC4899',
      },
      {
        type: 'sms',
        label: 'Send SMS',
        icon: <Phone size={14} />,
        color: '#6366F1',
      },
    ],
  },
  {
    title: 'Utilities',
    items: [
      {
        type: 'config',
        label: 'Configuration',
        icon: <Settings size={14} />,
        color: '#6B7280',
      },
      {
        type: 'error',
        label: 'Error Handler',
        icon: <AlertCircle size={14} />,
        color: '#EF4444',
      },
    ],
  },
];

type SidebarProps = {
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
};

const Sidebar: React.FC<SidebarProps> = ({ onDragStart }) => {
  return (
    <div className="sidebar-container">
      <h3 className="text-lg font-semibold mb-4">Flow Components</h3>
      
      {nodeCategories.map((category) => (
        <div key={category.title} className="sidebar-section">
          <h4 className="sidebar-section-title">{category.title}</h4>
          
          {category.items.map((item) => (
            <div
              key={item.type}
              className="sidebar-item"
              onDragStart={(event) => onDragStart(event, item.type)}
              draggable
            >
              <div className="sidebar-item-icon" style={{ backgroundColor: item.color }}>
                {item.icon}
              </div>
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </div>
      ))}
      
      <div className="mt-auto pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-500">
          <p>Drag components to the canvas</p>
          <p className="mt-1">Connect nodes by dragging between handles</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
