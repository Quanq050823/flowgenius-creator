
import FlowEditor from '@/components/flow/FlowEditor';
import { useEffect } from 'react';

const Index = () => {
  // Add page title
  useEffect(() => {
    document.title = 'Flow Management - Create Automated Workflows';
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <FlowEditor />
    </div>
  );
};

export default Index;
