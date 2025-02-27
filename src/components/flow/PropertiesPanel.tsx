
import React, { useState, useEffect } from 'react';
import { Node } from '@xyflow/react';
import { X } from 'lucide-react';

type PropertiesPanelProps = {
  selectedNode: Node | null;
  onChange: (id: string, data: any) => void;
  onClose: () => void;
};

interface NodeSettings {
  spreadsheetId?: string;
  sheetName?: string;
  adAccountId?: string;
  campaignId?: string;
  apiProvider?: string;
  apiKey?: string;
  promptTemplate?: string;
  calendarId?: string;
  duration?: number;
  webhookUrl?: string;
  method?: string;
  field?: string;
  operator?: string;
  value?: string;
  provider?: string;
  subject?: string;
  template?: string;
  [key: string]: string | number | undefined;
}

const PropertiesPanel: React.FC<PropertiesPanelProps> = ({ 
  selectedNode, 
  onChange,
  onClose
}) => {
  const [localSettings, setLocalSettings] = useState<NodeSettings>({});
  
  if (!selectedNode) {
    return null;
  }
  
  // Initialize local settings if node changes
  useEffect(() => {
    if (selectedNode) {
      const nodeSettings = selectedNode.data?.settings || {};
      setLocalSettings(nodeSettings as NodeSettings);
    }
  }, [selectedNode]);
  
  const updateSettings = (key: string, value: string | number) => {
    const updatedSettings = { ...localSettings, [key]: value };
    setLocalSettings(updatedSettings);
    
    // Update the node data
    onChange(selectedNode.id, {
      ...selectedNode.data,
      settings: updatedSettings
    });
  };
  
  const renderSettings = () => {
    // Different node types have different settings
    const nodeType = selectedNode.type || 'default';
    
    switch (nodeType) {
      case 'googleSheets':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Spreadsheet ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.spreadsheetId || ''}
                onChange={(e) => updateSettings('spreadsheetId', e.target.value)}
                placeholder="Enter spreadsheet ID"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Sheet Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.sheetName || ''}
                onChange={(e) => updateSettings('sheetName', e.target.value)}
                placeholder="Enter sheet name"
              />
            </div>
          </>
        );
        
      case 'facebookAds':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Ad Account ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.adAccountId || ''}
                onChange={(e) => updateSettings('adAccountId', e.target.value)}
                placeholder="Enter ad account ID"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Campaign ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.campaignId || ''}
                onChange={(e) => updateSettings('campaignId', e.target.value)}
                placeholder="Enter campaign ID"
              />
            </div>
          </>
        );
        
      case 'aiCall':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                API Provider
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.apiProvider || 'openai'}
                onChange={(e) => updateSettings('apiProvider', e.target.value)}
              >
                <option value="openai">OpenAI</option>
                <option value="twilio">Twilio</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                API Key
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.apiKey || ''}
                onChange={(e) => updateSettings('apiKey', e.target.value)}
                placeholder="Enter API key"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Prompt Template
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                value={localSettings.promptTemplate || ''}
                onChange={(e) => updateSettings('promptTemplate', e.target.value)}
                placeholder="Enter prompt template"
              />
            </div>
          </>
        );
        
      case 'calendar':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Calendar ID
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.calendarId || ''}
                onChange={(e) => updateSettings('calendarId', e.target.value)}
                placeholder="Enter calendar ID"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Event Duration (minutes)
              </label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.duration || 30}
                onChange={(e) => updateSettings('duration', parseInt(e.target.value))}
                min="5"
                max="240"
              />
            </div>
          </>
        );
        
      case 'webhook':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Webhook URL
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.webhookUrl || ''}
                onChange={(e) => updateSettings('webhookUrl', e.target.value)}
                placeholder="Enter webhook URL"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Method
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.method || 'POST'}
                onChange={(e) => updateSettings('method', e.target.value)}
              >
                <option value="GET">GET</option>
                <option value="POST">POST</option>
                <option value="PUT">PUT</option>
                <option value="DELETE">DELETE</option>
              </select>
            </div>
          </>
        );
        
      case 'condition':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Condition Field
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.field || ''}
                onChange={(e) => updateSettings('field', e.target.value)}
                placeholder="Enter field name"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Operator
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.operator || 'equals'}
                onChange={(e) => updateSettings('operator', e.target.value)}
              >
                <option value="equals">Equals</option>
                <option value="notEquals">Not Equals</option>
                <option value="contains">Contains</option>
                <option value="greaterThan">Greater Than</option>
                <option value="lessThan">Less Than</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Value
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.value || ''}
                onChange={(e) => updateSettings('value', e.target.value)}
                placeholder="Enter value to compare"
              />
            </div>
          </>
        );
        
      case 'email':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Provider
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.provider || 'smtp'}
                onChange={(e) => updateSettings('provider', e.target.value)}
              >
                <option value="smtp">SMTP</option>
                <option value="sendgrid">SendGrid</option>
                <option value="mailchimp">Mailchimp</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Subject Template
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.subject || ''}
                onChange={(e) => updateSettings('subject', e.target.value)}
                placeholder="Enter email subject"
              />
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Email Template
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                value={localSettings.template || ''}
                onChange={(e) => updateSettings('template', e.target.value)}
                placeholder="Enter email template"
              />
            </div>
          </>
        );
        
      case 'sms':
        return (
          <>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                SMS Provider
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                value={localSettings.provider || 'twilio'}
                onChange={(e) => updateSettings('provider', e.target.value)}
              >
                <option value="twilio">Twilio</option>
                <option value="messagebird">MessageBird</option>
              </select>
            </div>
            <div className="mb-3">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Message Template
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={3}
                value={localSettings.template || ''}
                onChange={(e) => updateSettings('template', e.target.value)}
                placeholder="Enter SMS template"
              />
            </div>
          </>
        );
        
      default:
        return (
          <div className="text-sm text-gray-500">
            No specific settings available for this node type.
          </div>
        );
    }
  };
  
  return (
    <div className="properties-panel animate-slide-in-right">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Node Properties</h3>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <X size={18} className="text-gray-500" />
        </button>
      </div>
      
      <div className="mb-4 p-3 bg-gray-50 rounded-md">
        <div className="flex items-center mb-2">
          <div 
            className="w-4 h-4 rounded-full mr-2" 
            style={{ backgroundColor: (selectedNode.data?.color as string) || '#94a3b8' }}
          ></div>
          <h4 className="font-medium">{(selectedNode.data?.label as string) || 'Unknown Node'}</h4>
        </div>
        <div className="text-xs text-gray-500">
          {(selectedNode.data?.description as string) || 'No description available'}
        </div>
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Node Name
        </label>
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          value={(selectedNode.data?.label as string) || ''}
          onChange={(e) => onChange(selectedNode.id, { ...selectedNode.data, label: e.target.value })}
          placeholder="Enter node name"
        />
      </div>
      
      <div className="mb-4">
        <label className="block text-xs font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          rows={2}
          value={(selectedNode.data?.description as string) || ''}
          onChange={(e) => onChange(selectedNode.id, { ...selectedNode.data, description: e.target.value })}
          placeholder="Enter description"
        />
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Node Settings</h4>
        {renderSettings()}
      </div>
      
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Node ID: {selectedNode.id}</span>
          <span>Type: {selectedNode.type}</span>
        </div>
      </div>
    </div>
  );
};

export default PropertiesPanel;
