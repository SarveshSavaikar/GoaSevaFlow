// src/components/CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div className="node">
        <Handle type="target" position={Position.Top} />
      <div className="">{data.title}</div>
      <div className="">{data.description}</div>
      
      <div className="">
        <label className="">Status:</label>
        <div className="">{data.status}</div>
      </div>

      <button
        className="view-full-graph-btn"
        onClick={() => window.open(data.link[0], '_blank')}
      >
        Action
      </button>

      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
