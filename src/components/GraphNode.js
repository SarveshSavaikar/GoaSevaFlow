// src/components/GraphNode.js
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

const nodeTypes = {
  custom: CustomNode,
};

const nodes = [
  {
    id: '1',
    type: 'custom',
    position: { x: 350, y: 100 },
    data: {
      title: 'Start Application',
      description: 'Begin PAN Card process',
      status: 'Pending',
      link: ['https://example.com/start'],
    },
  },
  {
    id: '2',
    type: 'custom',
    position: { x: 350, y: 400 },
    data: {
      title: 'Document Verification',
      description: 'Upload your required documents',
      status: 'Pending',
      link: ['https://example.com/docs'],
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 350, y: 700 },
    data: {
      title: 'Submit Application',
      description: 'Final submission of the form',
      status: 'Pending',
      link: ['https://example.com/submit'],
    },
  },
];

// Add color flags
const updatedNodes = nodes.map((node, index) => ({
  ...node,
  data: {
    ...node.data,
    isFirst: index === 0,
    isLast: index === nodes.length - 1,
  },
}));

const edges = [
  { id: 'e1-2', source: '1', target: '2', type: 'default' },
  { id: 'e2-3', source: '2', target: '3', type: 'default' },
];

const GraphNode = ({ width = '100%', height = '100%' }) => {
  return (
    <div style={{ width, height }}>
      <ReactFlow
        nodes={updatedNodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
      />
    </div>
  );
};

export default GraphNode;
