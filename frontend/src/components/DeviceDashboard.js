
import React from 'react';
import { FaServer, FaCheckCircle, FaExclamationTriangle, FaTimesCircle, FaSyncAlt } from 'react-icons/fa';
import './DeviceDashboard.css';

const partnerLogos = [
  { name: 'AMD', src: '/amd-logo.png', className: 'partner-logo amd-logo' },
  { name: 'Intel', src: '/intel-logo.png', className: 'partner-logo intel-logo' },
  { name: 'Nvidia', src: '/nvidia-logo.png', className: 'partner-logo nvidia-logo' },
  { name: 'Qualcomm', src: '/qualcomm-logo.png', className: 'partner-logo qualcomm-logo' }
];

function getPartnerFromName(name) {
  if (!name) return 'Other';
  const lower = name.toLowerCase();
  if (lower.includes('amd')) return 'AMD';
  if (lower.includes('intel')) return 'Intel';
  if (lower.includes('nvidia')) return 'Nvidia';
  // Match 'qualcomm' or 'qc' (case-insensitive, anywhere in name)
  if (lower.includes('qualcomm') || lower.includes('qc')) return 'Qualcomm';
  return 'Other';
}

export default function DeviceDashboard() {
  const [devices, setDevices] = React.useState([]);
  const [summary, setSummary] = React.useState({ total: 0, online: 0, warning: 0, critical: 0 });
  const [selectedPartner, setSelectedPartner] = React.useState(null);
  const [deviceFilter, setDeviceFilter] = React.useState('');
  const [error, setError] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  // Fetch devices from backend
  const fetchDevices = React.useCallback(() => {
    setLoading(true);
    setError(null);
    fetch('/api/devices')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        setDevices(data.devices.map(d => ({
          ...d,
          msg: d.message || ''
        })));
        setSummary(data.summary);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load device data');
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  // Group devices by partner
  const devicesByPartner = React.useMemo(() => {
    const groups = { AMD: [], Intel: [], Nvidia: [], Qualcomm: [] };
    devices.forEach(d => {
      const partner = getPartnerFromName(d.name);
      if (groups[partner]) groups[partner].push(d);
    });
    return groups;
  }, [devices]);

  const allDevices = devices;
  const totalDevices = summary.total;
  const onlineDevices = summary.online;
  const warningDevices = summary.warning;
  const criticalDevices = summary.critical;

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
        <button className="device-dashboard-refresh" onClick={fetchDevices} disabled={loading}>
          <FaSyncAlt className="refresh-icon" /> {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      {error && <div style={{color:'#FF4F4F', fontWeight:700, margin:'18px 0'}}>{error}</div>}

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
            <div style={{color:'#bcee09', fontWeight:700, fontSize:'1.1em', marginBottom:'8px'}}>{devicesByPartner[partner]?.length || 0} Devices</div>
          </div>
        ))}
      </div>

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