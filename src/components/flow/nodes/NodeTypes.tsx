
import { memo } from 'react';
import BaseNode from './BaseNode';
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
  AlertCircle 
} from 'lucide-react';

// Lead Input Nodes
export const GoogleSheetsNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Google Sheets',
        icon: <FileSpreadsheet size={16} />,
        type: 'Input',
        subType: 'Sheets',
        color: '#34A853',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const FacebookAdsNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Facebook Ads',
        icon: <Facebook size={16} />,
        type: 'Input',
        subType: 'Ads',
        color: '#1877F2',
      }}
      selected={selected}
      id={id}
    />
  );
});

// Processing Nodes
export const AICallNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'AI Call',
        icon: <Bot size={16} />,
        type: 'Process',
        subType: 'AI',
        color: '#10B981',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const CalendarNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Google Calendar',
        icon: <Calendar size={16} />,
        type: 'Process',
        subType: 'Calendar',
        color: '#4285F4',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const WebhookNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Webhook',
        icon: <Webhook size={16} />,
        type: 'Process',
        subType: 'API',
        color: '#8B5CF6',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const ConditionNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Condition',
        icon: <SplitSquareVertical size={16} />,
        type: 'Logic',
        subType: 'Condition',
        color: '#F59E0B',
        outputs: 2,
      }}
      selected={selected}
      id={id}
    />
  );
});

// Action Nodes
export const EmailNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Send Email',
        icon: <Mail size={16} />,
        type: 'Action',
        subType: 'Email',
        color: '#EC4899',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const SMSNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Send SMS',
        icon: <Phone size={16} />,
        type: 'Action',
        subType: 'SMS',
        color: '#6366F1',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const ConfigNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Configuration',
        icon: <Settings size={16} />,
        type: 'Settings',
        color: '#6B7280',
      }}
      selected={selected}
      id={id}
    />
  );
});

export const ErrorNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Error Handler',
        icon: <AlertCircle size={16} />,
        type: 'Error',
        color: '#EF4444',
      }}
      selected={selected}
      id={id}
    />
  );
});
