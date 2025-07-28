// src/components/CustomNode.js
import React from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  return (
    <div className='custom-node-container'>
      <div className='custom-node-widget'>
        {/* Top Handle */}
        <Handle
          type='target'
          position={Position.Top}
        />

        {/* Title */}
        <h3 className='node-title'>{data.title}</h3>

        {/* Description */}
        <p className='node-description'>{data.description}</p>

        {/* Status */}
        <p className='node-status'>
          <strong>Status:</strong> {data.status}
        </p>

        {/* Action Button */}
        <button
          className='node-action-btn'
          onClick={() => window.open(data.link[0], '_blank')}>
          Action
        </button>

        {/* Bottom Handle */}
        <Handle
          type='source'
          position={Position.Bottom}
        />
      </div>
    </div>
  );
};

export default CustomNode;
