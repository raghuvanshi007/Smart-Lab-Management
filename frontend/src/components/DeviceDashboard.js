import React from 'react';
import { FaServer, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';
import './DeviceDashboard.css';

const partnerLogos = [
  { name: 'AMD', src: '/amd-logo.png', className: 'partner-logo amd-logo' },
  { name: 'Intel', src: '/intel-logo.png', className: 'partner-logo intel-logo' },
  { name: 'Nvidia', src: '/nvidia-logo.png', className: 'partner-logo nvidia-logo' },
  { name: 'Qualcomm', src: '/qualcomm-logo.png', className: 'partner-logo qualcomm-logo' }
];

// Example device data mapped to partners
const devicesByPartner = {
  AMD: [
    { id: 'A1', name: 'AMD Ryzen 9', status: 'Online' },
    { id: 'A2', name: 'AMD Radeon Pro', status: 'Warning', msg: 'Temperature above threshold' },
    { id: 'A3', name: 'AMD EPYC', status: 'Critical', msg: 'Device not responding' }
  ],
  Intel: [
    { id: 'I1', name: 'Intel Core i9', status: 'Online' },
    { id: 'I2', name: 'Intel Xeon', status: 'Online' }
  ],
  Nvidia: [
    { id: 'N1', name: 'Nvidia RTX 4090', status: 'Online' },
    { id: 'N2', name: 'Nvidia Jetson', status: 'Warning', msg: 'Low memory detected' }
  ],
  Qualcomm: [
    { id: 'Q1', name: 'Qualcomm Snapdragon', status: 'Online' }
  ]
};

export default function DeviceDashboard({ stats, onRefresh }) {
  const [selectedPartner, setSelectedPartner] = React.useState(null);
  const [deviceFilter, setDeviceFilter] = React.useState(''); // '', 'total', 'online', 'warning', 'critical'
  // Calculate device counts from all partners
  const allDevices = Object.values(devicesByPartner).flat();
  const totalDevices = allDevices.length;
  const onlineDevices = allDevices.filter(d => d.status === 'Online').length;
  const warningDevices = allDevices.filter(d => d.status === 'Warning').length;
  const criticalDevices = allDevices.filter(d => d.status === 'Critical').length;

  // Animation keyframes and classes
  const fadeInStyle = {
    animation: 'fadeIn 0.8s cubic-bezier(.68,-0.55,.27,1.55)',
    opacity: 1
  };
  const scaleInStyle = {
    animation: 'scaleIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
    opacity: 1
  };

  // Add keyframes to document head if not present
  React.useEffect(() => {
    if (!document.getElementById('dashboard-animations')) {
      const style = document.createElement('style');
      style.id = 'dashboard-animations';
      style.innerHTML = `
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to { opacity: 1; transform: scale(1); }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="device-dashboard-bg" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #23272f 0%, #23272f 60%, #23272f 100%)', fontFamily: 'Montserrat, Segoe UI, Arial, sans-serif', color: '#f7fafc' }}>
      <div className="device-dashboard-header">
        <div>
          <h1>Device Management</h1>
          <p className="device-dashboard-subtitle">Monitor and manage all connected devices with AI-powered anomaly detection</p>
        </div>
        <button className="device-dashboard-refresh" onClick={onRefresh}>
          <FaSyncAlt className="refresh-icon" /> Refresh
        </button>
      </div>
      {/* ...existing code... */}
      <div className="device-dashboard-cards">
        {[{
          title: 'Total Devices',
          icon: <FaServer className="device-card-icon total" />,
          value: totalDevices,
          filter: 'total'
        }, {
          title: 'Online',
          icon: <FaCheckCircle className="device-card-icon online" />,
          value: onlineDevices,
          filter: 'online'
        }, {
          title: 'Warning',
          icon: <FaExclamationTriangle className="device-card-icon warning" />,
          value: warningDevices,
          filter: 'warning'
        }, {
          title: 'Critical',
          icon: <FaTimesCircle className="device-card-icon critical" />,
          value: criticalDevices,
          filter: 'critical'
        }].map((card, idx) => (
          <div
            key={card.title}
            className="device-card"
            style={{
              cursor: 'pointer',
              ...scaleInStyle,
              animationDelay: `${0.12 * idx}s`
            }}
            onClick={() => { setDeviceFilter(card.filter); setSelectedPartner(null); }}
          >
            <div className="device-card-title">{card.title}</div>
            <div className="device-card-content">
              {card.icon}
              <span className={`device-card-value ${card.filter}`}>{card.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* New section for AMD, Intel, Nvidia, Qualcomm */}
      <div className="dashboard-partner-sections" style={{display:'flex', justifyContent:'center', alignItems:'stretch', gap:'32px', margin:'40px auto', maxWidth:'900px'}}>
        {['AMD','Intel','Nvidia','Qualcomm'].map((partner, idx) => (
          <div key={partner} style={{
            background: 'linear-gradient(135deg, #23272f 60%, #23272f 100%)',
            borderRadius: '18px',
            boxShadow: '0 4px 32px rgba(44,62,80,0.18)',
            padding: '32px 24px',
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            border: '2.5px solid #4F8DFD',
            minHeight: '160px',
            ...scaleInStyle,
            animationDelay: `${0.15 * idx}s`
          }} onClick={() => setSelectedPartner(partner)}>
            <img src={partnerLogos.find(l=>l.name===partner).src} alt={partner} style={{height:'48px', marginBottom:'18px'}} />
            {/* Removed partner name under logo */}
            <div style={{color:'#bcee09', fontWeight:700, fontSize:'1.1em', marginBottom:'8px'}}>{devicesByPartner[partner]?.length || 0} Devices</div>
          </div>
        ))}
      </div>

      {/* Device list for selected partner or filter (simple list, with status symbol and hover message for warning/critical) */}
      {(selectedPartner || deviceFilter) && (
  <div style={{margin:'0 auto 32px auto', maxWidth:'520px', background:'rgba(44,62,80,0.08)', borderRadius:'16px', boxShadow:'0 2px 12px rgba(44,62,80,0.10)', padding:'24px 32px', textAlign:'left', ...fadeInStyle}}>
          <h3 style={{color:'#4F8DFD', fontWeight:800, fontSize:'1.3em', marginBottom:'18px', textShadow:'0 2px 8px #23272f'}}>
            {selectedPartner ? `${selectedPartner} Devices` : deviceFilter === 'total' ? 'All Devices' : deviceFilter.charAt(0).toUpperCase() + deviceFilter.slice(1) + ' Devices'}
          </h3>
          <ul style={{listStyle:'none', padding:0, margin:0}}>
            {(selectedPartner
              ? devicesByPartner[selectedPartner]
              : deviceFilter === 'total'
                ? allDevices
                : allDevices.filter(d => d.status.toLowerCase() === deviceFilter)
            ).map((device, idx) => {
              let statusIcon = null;
              if (device.status === 'Online') statusIcon = <FaCheckCircle style={{color:'#bcee09', marginRight:'8px', verticalAlign:'middle'}} />;
              else if (device.status === 'Warning') statusIcon = <FaExclamationTriangle style={{color:'#FFD600', marginRight:'8px', verticalAlign:'middle'}} />;
              else if (device.status === 'Critical') statusIcon = <FaTimesCircle style={{color:'#FF4F4F', marginRight:'8px', verticalAlign:'middle'}} />;
              return (
                <li key={device.id} style={{marginBottom:'12px', padding:'10px 18px', background:'#fff', borderRadius:'10px', boxShadow:'0 2px 8px rgba(44,62,80,0.08)', display:'flex', alignItems:'center', justifyContent:'space-between', ...fadeInStyle, animationDelay: `${0.1 * idx}s`}}>
                  <span style={{fontWeight:600, color:'#23272f'}}>{device.name}</span>
                  <span
                    style={{fontWeight:600, color: device.status === 'Online' ? '#bcee09' : device.status === 'Warning' ? '#FFD600' : '#FF4F4F', cursor: device.status !== 'Online' ? 'pointer' : 'default', position:'relative', display:'flex', alignItems:'center'}}
                    title={device.status !== 'Online' && device.msg ? device.msg : ''}
                  >
                    {statusIcon}
                    {device.status}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
