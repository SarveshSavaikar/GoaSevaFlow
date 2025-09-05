import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';

const CustomNode = ({ data }) => {
  const [checked, setChecked] = useState(
    data.status.toLowerCase() === 'completed'
  );

  const handleCheckboxChange = () => {
    setChecked(!checked);
  };

  const containerStyle = {
    
    border: '2px dashed #333',
    borderRadius: '10px',
    padding: '15px',
    width: '25vw',
    height: 'auto',
    backgroundColor: data.isFirst
      ? '#ffaeaeff' // light cyan for first node
      : data.isLast
      ? '#b2ffc7ff' // light orange for last node
      : '#ffffff', // default white
  };

  return (
    <center>
      <div className='custom-node-container'>
        <div style={containerStyle}>
          {/* Top Handle */}
          <Handle
            type='target'
            position={Position.Top}
          />

          {/* Title */}
          <h3 className='node-title' style={{fontSize: '34px'}}>{data.title}</h3>

          {/* Description */}
          <p className='node-description'style={{fontSize: '24px'}}>{data.description}</p>

          {/* Status with Checkbox */}
          {/* <div className='node-status'>
            <label>
              <input
                type='checkbox'
                checked={checked}
                onChange={handleCheckboxChange}
                style={{ marginRight: '5px', transform: 'scale(1.3)' }}
              />
              <strong>Status:</strong> {checked ? 'Completed' : 'Pending'}
            </label>
          </div> */}

          {/* Action Button */}
          {!data.isFirst && (
  <button
    className="node-action-btn"
    onClick={() => window.open(data.link[0], '_blank')}
  >
    Action
  </button>
)}

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