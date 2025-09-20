import React, { useState, useEffect, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import './LandingDashboard.css';

const timeSeriesData = [
  { time: '10:00', value: 95 },
  { time: '10:10', value: 92 },
  { time: '10:20', value: 97 },
  { time: '10:30', value: 93 },
  { time: '10:40', value: 96 },
  { time: '10:50', value: 94 }
];

const barData = [
  { name: 'Healthy', value: 60 },
  { name: 'Warning', value: 25 },
  { name: 'Critical', value: 15 }
];


const partnerLogos = [
  { name: 'AMD', src: '/amd-logo.png', className: 'partner-logo amd-logo' },
  { name: 'Intel', src: '/intel-logo.png', className: 'partner-logo intel-logo' },
  { name: 'Nvidia', src: '/nvidia-logo.png', className: 'partner-logo nvidia-logo' },
  { name: 'Qualcomm', src: '/qualcomm-logo.png', className: 'partner-logo qualcomm-logo' }
];


function getPartnerFromDevice(device) {
  if (device.partner) {
    const p = device.partner.toLowerCase();
    if (p === 'amd') return 'AMD';
    if (p === 'intel') return 'Intel';
    if (p === 'nvidia') return 'Nvidia';
    if (p === 'qualcomm') return 'Qualcomm';
  }
  if (!device.name) return 'Other';
  const lower = device.name.toLowerCase();
  if (lower.includes('amd')) return 'AMD';
  if (lower.includes('intel')) return 'Intel';
  if (lower.includes('nvidia')) return 'Nvidia';
  if (lower.includes('qualcomm') || lower.includes('qc')) return 'Qualcomm';
  return 'Other';
}



export default function HealthMonitor() {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [devices, setDevices] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch('/api/devices')
      .then(res => {
        if (!res.ok) throw new Error('API error');
        return res.json();
      })
      .then(data => {
        setDevices(data.devices || []);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to load device data');
        setLoading(false);
      });
  }, []);

  const devicesByPartner = useMemo(() => {
    const groups = { AMD: [], Intel: [], Nvidia: [], Qualcomm: [] };
    devices.forEach(d => {
      const partner = getPartnerFromDevice(d);
      if (groups[partner]) groups[partner].push(d);
    });
    return groups;
  }, [devices]);


  // State for selected device and its metrics
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [deviceMetrics, setDeviceMetrics] = useState([]);
  const [barMetrics, setBarMetrics] = useState([]);
  const [deviceTimestamps, setDeviceTimestamps] = useState([]);
  const [deviceTrendError, setDeviceTrendError] = useState(null);


  // Handler for partner logo click (restore)
  const handleLogoClick = (partner) => {
    setOpenDropdown(openDropdown === partner ? null : partner);
  };

  // Handler for device click



  // Polling interval in ms
  const POLL_INTERVAL = 3000;

  // Store polling timer
  const [pollTimer, setPollTimer] = useState(null);

  // Fetch and update device metrics
  const fetchDeviceTrend = async (deviceName) => {
    setDeviceTrendError(null);
    try {
      // Ensure .json extension for fetch and lowercase for filename
      const fileBase = deviceName.endsWith('.json') ? deviceName.slice(0, -5) : deviceName;
      const fileName = `${fileBase.toLowerCase()}.json`;
      const res = await fetch(`/received_json/trend/${fileName}`);
      if (!res.ok) throw new Error('Device trend data not found');
      const trendData = await res.json();
      // Flatten all anomalies
      let anomalies = [];
      trendData.forEach(batch => {
        if (Array.isArray(batch.anomalies)) {
          batch.anomalies.forEach(a => anomalies.push(a));
        }
      });
      // Sort by timestamp descending, take last 5
      anomalies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      const last5 = anomalies.slice(0, 5).reverse();
      // Build metrics for line chart: each entry is { timestamp, ...metrics }
      const exclude = ['process_count', 'cpu_freq_mhz', 'disk_free_gb'];
      const chartData = last5.map(a => {
        const metrics = {};
        Object.entries(a.system_metrics || {}).forEach(([key, value]) => {
          if (!exclude.includes(key)) metrics[key] = value;
        });
        return { timestamp: a.timestamp, ...metrics };
      });
      setDeviceMetrics(chartData);
      setDeviceTimestamps(chartData.map(d => d.timestamp));
      // Build metrics for bar chart: process_count, cpu_freq_mhz, disk_free_gb normalized to 5000
      const barData = last5.map(a => {
        const m = a.system_metrics || {};
        return {
          timestamp: a.timestamp,
          process_count: Math.round((m.process_count || 0) / 5000 * 5000),
          cpu_freq_mhz: Math.round((m.cpu_freq_mhz || 0) / 5000 * 5000),
          disk_free_gb: Math.round((m.disk_free_gb || 0) / 5000 * 5000)
        };
      });
      setBarMetrics(barData);
      if (chartData.length === 0) setDeviceTrendError('No trend data found for this device.');
    } catch (err) {
      setDeviceMetrics([]);
      setDeviceTimestamps([]);
      setBarMetrics([]);
      setDeviceTrendError(err.message || 'Error loading device trend data');
    }
  };

  // Handler for device click
  const handleDeviceClick = (deviceName) => {
    setSelectedDevice(deviceName);
    // Clear previous polling
    if (pollTimer) clearInterval(pollTimer);
    fetchDeviceTrend(deviceName);
    // Start polling for real-time updates
    const timer = setInterval(() => {
      fetchDeviceTrend(deviceName);
    }, POLL_INTERVAL);
    setPollTimer(timer);
  };

  // Cleanup polling on unmount or device change
  useEffect(() => {
    return () => {
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [pollTimer]);

  return (
    <div className="landing-dashboard">
      <div className="dashboard-header animated-fadein">
        <h1 className="landing-main-title">System Health Monitor</h1>
        <p className="landing-subtitle">Live health metrics and trends</p>
      </div>
      {error && <div style={{color:'#FF4F4F', fontWeight:700, margin:'18px 0'}}>{error}</div>}
      {/* Partner sections visually matching DeviceDashboard - now at top */}
      <div className="dashboard-partner-sections" style={{display:'flex', justifyContent:'center', alignItems:'stretch', gap:'32px', margin:'40px auto 32px auto', maxWidth:'900px'}}>
        {partnerLogos.map((logo, idx) => (
          <div key={logo.name} style={{
            background: 'linear-gradient(135deg, #23272f 60%, #23272f 100%)',
            borderRadius: '10px',
            boxShadow: '0 4px 32px rgba(44,62,80,0.18)',
            padding: '20px 40px',
            flex: '1 1 0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2.5px solid #4F8DFD',
            minHeight: '80px',
            position: 'relative',
            animation: 'scaleIn 0.7s cubic-bezier(.68,-0.55,.27,1.55)',
            animationDelay: `${0.15 * idx}s`
          }}>
            <img
              src={logo.src}
              alt={logo.name}
              style={{height:'48px', marginBottom:'18px', cursor:'pointer'}}
              onClick={() => handleLogoClick(logo.name)}
            />
            <div style={{color:'#bcee09', fontWeight:700, fontSize:'1.1em', marginBottom:'8px'}}>{logo.name}</div>
            {openDropdown === logo.name && (
              <div style={{
                position: 'absolute',
                top: '80px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#101a2b',
                border: '2px solid #4F8DFD',
                borderRadius: '10px',
                boxShadow: '0 4px 24px rgba(44,62,80,0.18)',
                padding: '16px 24px',
                zIndex: 100,
                minWidth: '180px',
                color: '#fff',
                fontWeight: 500,
                fontSize: '1em',
                marginTop: '8px',
              }}>
                <div style={{marginBottom:'8px', color:'#bcee09', fontWeight:700, fontSize:'1.05em'}}>Devices</div>
                {loading ? (
                  <div style={{color:'#8ca0b3'}}>Loading...</div>
                ) : (
                  <ul style={{listStyle:'none', padding:0, margin:0}}>
                    {devicesByPartner[logo.name].length === 0 ? (
                      <li style={{padding:'6px 0', color:'#8ca0b3'}}>No devices found</li>
                    ) : (
                      devicesByPartner[logo.name].map(device => (
                        <li
                          key={device.id || device.name}
                          style={{padding:'6px 0', borderBottom:'1px solid #23272f', cursor:'pointer'}}
                          onClick={() => handleDeviceClick(device.id)}
                        >
                          {device.name}
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
      {deviceTrendError && (
        <div style={{color:'#FF4F4F', fontWeight:700, margin:'18px 0'}}>
          {deviceTrendError}
        </div>
      )}
      <div className="dashboard-grid">
        <div className="dashboard-card animated-card" style={{minHeight: 320}}>
          <div className="card-title" style={{fontSize:'1.5em', fontWeight:800, color:'#4F8DFD', letterSpacing:'0.5px', fontFamily:'Segoe UI, Arial, sans-serif'}}>Time Series Health</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={deviceMetrics.length ? deviceMetrics : timeSeriesData}>
              <XAxis
                dataKey={deviceMetrics.length ? "timestamp" : "time"}
                stroke="#bcee09"
                tick={{fill:'#bcee09', fontWeight:700, fontSize: '1.15em', angle: -30, textAnchor: 'end'}}
                axisLine={true}
                tickLine={true}
                interval={0}
                minTickGap={30}
                tickFormatter={tick => {
                  // Show date and time (DD MMM HH:MM) for clarity
                  if (!tick) return '';
                  if (deviceMetrics.length) {
                    const d = new Date(tick);
                    const day = d.getDate().toString().padStart(2, '0');
                    const month = d.toLocaleString('en-US', { month: 'short' });
                    const hour = d.getHours().toString().padStart(2, '0');
                    const minute = d.getMinutes().toString().padStart(2, '0');
                    return `${day} ${month} ${hour}:${minute}`;
                  }
                  return tick;
                }}
              />
              <YAxis
                stroke="#bcee09"
                tick={{fill:'#bcee09', fontWeight:700, fontSize: '1.15em'}}
                axisLine={true}
                tickLine={true}
                allowDecimals={true}
                domain={[dataMin => Math.floor(dataMin * 0.95), dataMax => Math.ceil(dataMax * 1.05)]}
              />
              <Tooltip contentStyle={{background:'#23272f', color:'#fff', borderRadius:'12px', fontWeight:600, fontSize:'1em', border:'none'}} />
              {deviceMetrics.length
                ? Object.keys(deviceMetrics[0] || {}).filter(k => k !== 'timestamp').map((metric, idx) => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={["#4F8DFD", "#FFD600", "#bcee09", "#FF4F4F", "#8ca0b3", "#23272f", "#09bcee"][idx % 7]}
                      strokeWidth={3}
                      dot={{ r: 4, stroke:'#23272f', strokeWidth:2 }}
                      activeDot={{ r: 7, stroke:'#4F8DFD', strokeWidth:3 }}
                      isAnimationActive={true}
                      animationDuration={1200}
                    />
                  ))
                : <Line type="monotone" dataKey="value" stroke="#4F8DFD" strokeWidth={3} dot={{ r: 4, stroke:'#23272f', strokeWidth:2 }} activeDot={{ r: 7, stroke:'#4F8DFD', strokeWidth:3 }} isAnimationActive={true} animationDuration={1200} />}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="dashboard-card animated-card" style={{minHeight: 320}}>
          <div className="card-title" style={{fontSize:'1.5em', fontWeight:800, color:'#4F8DFD', letterSpacing:'0.5px', fontFamily:'Segoe UI, Arial, sans-serif'}}>Health Status Bar<br /><span style={{fontSize:'0.95em', color:'#8ca0b3', fontWeight:500}}>(process_count, cpu_freq_mhz, disk_free_gb)</span></div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={barMetrics.length ? barMetrics : []}>
              <XAxis
                dataKey="timestamp"
                stroke="#bcee09"
                tick={{fill:'#bcee09', fontWeight:700, fontSize: '1.05em', angle: -30, textAnchor: 'end'}}
                axisLine={true}
                tickLine={true}
                interval={0}
                minTickGap={30}
                tickFormatter={tick => {
                  if (!tick) return '';
                  const d = new Date(tick);
                  const day = d.getDate().toString().padStart(2, '0');
                  const month = d.toLocaleString('en-US', { month: 'short' });
                  const hour = d.getHours().toString().padStart(2, '0');
                  const minute = d.getMinutes().toString().padStart(2, '0');
                  return `${day} ${month} ${hour}:${minute}`;
                }}
              />
              <YAxis
                stroke="#bcee09"
                tick={{fill:'#bcee09', fontWeight:700, fontSize: '1.05em'}}
                axisLine={true}
                tickLine={true}
                domain={[0, 5000]}
                allowDecimals={true}
              />
              <Tooltip contentStyle={{background:'#23272f', color:'#fff', borderRadius:'12px', fontWeight:600, fontSize:'1em', border:'none'}} />
              <Bar dataKey="process_count" fill="#4F8DFD" radius={[14,14,14,14]} barSize={24} />
              <Bar dataKey="cpu_freq_mhz" fill="#FFD600" radius={[14,14,14,14]} barSize={24} />
              <Bar dataKey="disk_free_gb" fill="#bcee09" radius={[14,14,14,14]} barSize={24} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
