// src/components/GraphNode.js
import React from 'react';
import ReactFlow from 'reactflow';
import 'reactflow/dist/style.css';
import CustomNode from './CustomNode';

// const nodes = [
//   { id: '1', position: { x: 100, y: 100 }, data: { label: 'Start' } },
//   { id: '2', position: { x: 300, y: 100 }, data: { label: 'End' } },
//   { id: '3', position: { x: 500, y: 200 }, data: { label: 'PingPong' } },
//   { id: '4', position: { x: 200, y: 300 }, data: { label: 'py' } }
// ];
const nodeTypes = {
  custom: CustomNode,
};

const nodes = [
  {
    id: '1',
    type: 'custom', // important
    position: { x: 100, y: 100 },
    data: {
      title: 'Apply for PAN Card',
      description: 'Follow the steps below to apply',
      status: 'Pending',
      onClick: () => alert('Button inside node clicked!'),
    },
  },
  {
    id: '2',
    type: 'custom', // important
    position: { x: 300, y: 300 },
    data: {
      title: 'Apply for PAN Card',
      description: 'Follow the steps below to apply',
      status: 'Pending',
      onClick: () => alert('Button inside node clicked!'),
    },
  },
];

const edges = [
  { id: 'e1-2', source: '1', target: '2' ,type: 'default',}
];

// ✅ Accept width and height as props
const GraphNode = ({ edges,nodes ,width = '100%', height = '100%' }) => {
  console.log("Rendering Graph with Nodes:", nodes);
console.log("Rendering Graph with Edges:", edges);

if (!nodes || !edges) return <div>Waiting for graph data...</div>;
  return (
    <div style={{ width, height }}>
      <ReactFlow nodes={nodes} edges={edges} nodeTypes={nodeTypes}fitView />
    </div>
  );
};

export default GraphNode;
