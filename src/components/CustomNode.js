// src/components/CustomNode.js
import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const [checked, setChecked] = useState(
    data.status.toLowerCase() === 'completed'
  );

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  return (
    <center>
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

          {/* Status with Checkbox */}
          <div className='node-status'>
            <label>
              <input
                type='checkbox'
                checked={checked}
                onChange={handleCheckboxChange}
                style={{
                  marginRight: '5px',
                  transform: 'scale(1.3)',
                }}
              />
              <strong>Status:</strong> {checked ? 'Completed' : 'Pending'}
            </label>
          </div>

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
    </center>
  );
};

export default CustomNode;
