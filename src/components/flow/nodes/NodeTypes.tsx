
import { memo } from 'react';
import BaseNode from './BaseNode';
import { 
  TableChart,
  Facebook,
  SmartToy,
  CalendarMonth,
  Webhook,
  CallSplit,
  Email,
  Phone,
  Settings,
  ErrorOutline
} from '@mui/icons-material';

// Lead Input Nodes
export const GoogleSheetsNode = memo(({ data, selected, id }: any) => {
  return (
    <BaseNode
      data={{
        ...data,
        label: 'Google Sheets',
        icon: <TableChart fontSize="small" />,
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
        icon: <Facebook fontSize="small" />,
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
        icon: <SmartToy fontSize="small" />,
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
        icon: <CalendarMonth fontSize="small" />,
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
        icon: <Webhook fontSize="small" />,
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
        icon: <CallSplit fontSize="small" />,
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
        icon: <Email fontSize="small" />,
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
        icon: <Phone fontSize="small" />,
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
        icon: <Settings fontSize="small" />,
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
        icon: <ErrorOutline fontSize="small" />,
        type: 'Error',
        color: '#EF4444',
      }}
      selected={selected}
      id={id}
    />
  );
});
