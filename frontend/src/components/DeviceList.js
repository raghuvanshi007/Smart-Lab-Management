import React from 'react';

function DeviceList({ devices }) {
  return (
    <div>
      <h2>Devices</h2>
      {Object.entries(devices).map(([partner, partnerDevices]) => (
        <div key={partner}>
          <h3>{partner}</h3>
          <ul>
            {partnerDevices.map(device => (
              <li key={device.id}>{device.name} - {device.status}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default DeviceList;
