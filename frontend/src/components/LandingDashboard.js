import React from 'react';
import { FaBalanceScale } from 'react-icons/fa';
import { MdHealthAndSafety } from 'react-icons/md';
import { FaCheckCircle } from 'react-icons/fa';
import { GiBrain } from 'react-icons/gi';
import { MdAssessment } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AreaChart, Area } from 'recharts';
import './LandingDashboard.css';

const partnerLogos = [
  { name: 'AMD', src: '/amd-logo.png', className: 'partner-logo amd-logo' },
  { name: 'Intel', src: '/intel-logo.png', className: 'partner-logo intel-logo' },
  { name: 'Nvidia', src: '/nvidia-logo.png', className: 'partner-logo nvidia-logo' },
  { name: 'Qualcomm', src: '/qualcomm-logo.png', className: 'partner-logo qualcomm-logo' }
];

const regressionData = [
  { name: 'Jan', value: 4 },
  { name: 'Feb', value: 7 },
  { name: 'Mar', value: 5 },
  { name: 'Apr', value: 0.5 }
];

const comparisonData = [
  { name: 'Nov', amd: 60, intel: 40, nvidia: 80, qualcomm: 70 },
  { name: 'Dec', amd: 80, intel: 60, nvidia: 90, qualcomm: 60 },
  { name: 'Jan', amd: 90, intel: 70, nvidia: 85, qualcomm: 80 },
  { name: 'Feb', amd: 70, intel: 80, nvidia: 95, qualcomm: 90 },
  { name: 'Mar', amd: 85, intel: 60, nvidia: 80, qualcomm: 100 },
  { name: 'Apr', amd: 95, intel: 50, nvidia: 70, qualcomm: 90 }
];

export default function LandingDashboard() {
  const navigate = useNavigate();
  // Pie chart data for each card
  const pieData = [
    [
      { name: 'Healthy', value: 60 },
      { name: 'Warning', value: 25 },
      { name: 'Critical', value: 15 }
    ],
    [
      { name: 'Active', value: 70 },
      { name: 'Idle', value: 20 },
      { name: 'Error', value: 10 }
    ],
    [
      { name: 'AMD', value: 40 },
      { name: 'Intel', value: 30 },
      { name: 'Nvidia', value: 20 },
      { name: 'Qualcomm', value: 10 }
    ],
    [
      { name: 'Available', value: 80 },
      { name: 'Unavailable', value: 20 }
    ]
  ];
  // Card icons
  const cardIcons = [
    <GiBrain style={{fontSize:'2em', color:'#4F8DFD', marginRight:'8px'}} />,
    <FaCheckCircle style={{fontSize:'2em', color:'#bcee09', marginRight:'8px'}} />,
    <FaBalanceScale style={{fontSize:'2em', color:'#FFD600', marginRight:'8px'}} />,
    <MdHealthAndSafety style={{fontSize:'2em', color:'#00A4EF', marginRight:'8px'}} />
  ];
  const pieColors = [
    ['#4F8DFD', '#FFD600', '#bcee09'],
    ['#bcee09', '#FFD600', '#FF4F4F'],
    ['#4F8DFD', '#bcee09', '#FFD600', '#00A4EF'],
    ['#4F8DFD', '#FF4F4F']
  ];
  // Track which pie slice is hovered for pop effect
  const [activeIndex, setActiveIndex] = React.useState([-1, -1, -1, -1]);
  return (
    <div className="landing-dashboard">
      <div className="dashboard-header animated-fadein">
        <div className="landing-logo-block">
          <svg className="landing-logo" width="54" height="54" viewBox="0 0 54 54" fill="none" xmlns="http://www.w3.org/2000/svg" style={{marginRight: '20px'}}>
            <rect x="2" y="2" width="22" height="22" fill="#fff"/>
            <rect x="30" y="2" width="22" height="22" fill="#fff"/>
            <rect x="2" y="30" width="22" height="22" fill="#fff"/>
            <rect x="30" y="30" width="22" height="22" fill="#fff"/>
          </svg>
          <span className="landing-logo-title" style={{fontSize: '2.8em', fontWeight: 800, color: '#f7fafc', textShadow: '0 2px 8px #23272f'}}>WSSI Lab Copilot</span>
        </div>
        {/* Partner logos moved below subtitle */}
  <p className="landing-subtitle animated-subtitle" style={{textAlign: 'center', marginBottom: '50px'}}>A Unified Agentic Device Manager across AMD, Intel, Nvidia, Qualcomm</p>
  <div className="partner-logos-collage" style={{display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '30px 310px 40px 0'}}>
          {partnerLogos.map((logo, idx) => (
            <img
              key={logo.name}
              src={logo.src}
              alt={logo.name}
              className={logo.className + ' collage-logo'}
              style={{
                height: '55px',
                width: 'auto',
                marginLeft: idx === 0 ? '0px' : '16px',
                marginRight: '0px',
                verticalAlign: 'middle',
                boxShadow: '0 2px 24px 0 #4F8DFD, 0 2px 12px rgba(44,62,80,0.12)', // Add glow
                transition: 'transform 0.3s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.3s',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.13)';
                e.currentTarget.style.boxShadow = '0 0 32px 0 #4F8DFD, 0 6px 18px #4F8DFD';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 2px 24px 0 #4F8DFD, 0 2px 12px rgba(44,62,80,0.12)';
              }}
            />
          ))}
        </div>
        <button className="dashboard-enter-btn animated-btn" style={{marginTop: '32px'}} onClick={() => navigate('/dashboard')}>
          Enter Dashboard
        </button>
      </div>
  {/* Removed Report section/title as requested */}
      <div className="dashboard-grid">
        {/* AI INSIGHTS */}
        <div className="dashboard-card animated-card" style={{animationDelay: '0.5s'}}>
          <div className="card-title" style={{display:'flex', alignItems:'center'}}>{cardIcons[0]}AI INSIGHTS</div>
          <div style={{padding:'32px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', width:'100%'}}>
            {/* Animated SVG logo */}
            <svg width="250" height="250" viewBox="10 10 70 70" fill="none" xmlns="http://www.w3.org/2000/svg" style={{animation:'pulse 2.5s infinite', marginBottom:'0px'}}>
              <circle cx="35" cy="22" r="5" fill="#2DE3A7" opacity="0.9" />
              <ellipse cx="35" cy="22" rx="10" ry="5" stroke="#2DE3A7" strokeWidth="2" opacity="0.7" />
              <ellipse cx="35" cy="22" rx="5" ry="10" stroke="#2DE3A7" strokeWidth="2" opacity="0.7" transform="rotate(30 35 22)" />
              <ellipse cx="35" cy="22" rx="5" ry="10" stroke="#2DE3A7" strokeWidth="2" opacity="0.7" transform="rotate(-30 35 22)" />
              <rect x="28" y="35" width="14" height="8" rx="4" fill="#23272f" stroke="#2DE3A7" strokeWidth="1.5" />
              <rect x="26" y="43" width="6" height="12" rx="3" fill="#23272f" stroke="#2DE3A7" strokeWidth="1.2" />
              <rect x="38" y="43" width="6" height="12" rx="3" fill="#23272f" stroke="#2DE3A7" strokeWidth="1.2" />
              <rect x="32" y="43" width="6" height="10" rx="3" fill="#23272f" stroke="#2DE3A7" strokeWidth="1.2" />
              <rect x="30" y="55" width="4" height="8" rx="2" fill="#23272f" stroke="#2DE3A7" strokeWidth="1" />
              <rect x="36" y="55" width="4" height="8" rx="2" fill="#23272f" stroke="#2DE3A7" strokeWidth="1" />
            </svg>
            <span style={{marginTop:'18px', color:'#2DE3A7', fontWeight:600, fontSize:'1.15em', textAlign:'center', letterSpacing:'1px', textShadow:'0 2px 8px #23272f', opacity:0, animation:'fadein 1.5s 0.5s forwards'}}>
              Latest AI model performance, trends, and actionable insights
            </span>
            <style>{`
              @keyframes pulse {
                0% { transform: scale(1); filter: drop-shadow(0 0 0 #2DE3A7); }
                50% { transform: scale(1.05); filter: drop-shadow(0 0 16px #2DE3A7); }
                100% { transform: scale(1); filter: drop-shadow(0 0 0 #2DE3A7); }
              }
              @keyframes fadein {
                to { opacity: 1; }
              }
              @keyframes chartFadeIn {
                0% { opacity: 0; transform: scale(0.95); }
                100% { opacity: 1; transform: scale(1); }
              }
              .chart-fadein {
                animation: chartFadeIn 1.2s cubic-bezier(.68,-0.55,.27,1.55) forwards;
              }
              .dashboard-card .card-title {
                font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif;
                font-size: 1.25em;
                font-weight: 700;
                letter-spacing: 1px;
                color: #f7fafc;
                text-shadow: 0 2px 8px #23272f;
                margin-bottom: 12px;
              }
              .dashboard-card span,
              .dashboard-card div,
              .dashboard-card text {
                font-family: 'Montserrat', 'Segoe UI', Arial, sans-serif !important;
                font-weight: 500;
                letter-spacing: 0.5px;
              }
              .dashboard-card .dashboard-status-label {
                font-size: 1.1em;
                font-weight: 600;
                color: #bcee09;
                text-shadow: 0 2px 8px #23272f;
              }
              .dashboard-card .comparison-label {
                font-size: 1.1em;
                font-weight: 600;
                color: #FFD600;
                text-shadow: 0 2px 8px #23272f;
              }
              .dashboard-card .health-label {
                font-size: 1.1em;
                font-weight: 600;
                color: #00A4EF;
                text-shadow: 0 2px 8px #23272f;
              }
            `}</style>
          </div>
        </div>
        {/* DASHBOARD STATUS */}
        <div className="dashboard-card animated-card chart-fadein" style={{animationDelay: '0.7s'}}>
          <div className="card-title" style={{display:'flex', alignItems:'center'}}>{cardIcons[1]}DASHBOARD STATUS</div>
          <div style={{padding:'32px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            {/* Elegant animated bar chart for device status */}
            <BarChart
              width={360}
              height={220}
              data={[
                { name: 'Total', value: 80 },
                { name: 'Online', value: 45 },
                { name: 'Warning', value: 20 },
                { name: 'Critical', value: 15 }
              ]}
              style={{background: 'rgba(44,62,80,0.08)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(44,62,80,0.10)', transition:'box-shadow 0.8s cubic-bezier(.68,-0.55,.27,1.55)'}}
            >
              <defs>
                <linearGradient id="barGradientTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4F8DFD" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#23272f" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="barGradientOnline" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#6CA8FF" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#23272f" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="barGradientWarning" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A0BFFF" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#23272f" stopOpacity={0.7}/>
                </linearGradient>
                <linearGradient id="barGradientCritical" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#CBD5E1" stopOpacity={0.9}/>
                  <stop offset="100%" stopColor="#23272f" stopOpacity={0.7}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#cbd5e1" fontSize={15} tick={{fill:'#cbd5e1', fontWeight:600}} axisLine={false} tickLine={false} />
              <YAxis stroke="#cbd5e1" fontSize={15} tick={{fill:'#cbd5e1', fontWeight:600}} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{fill:'rgba(44,62,80,0.12)'}}
                contentStyle={{background:'#23272f', color:'#fff', borderRadius:'12px', fontWeight:600, fontSize:'1em', border:'none', boxShadow:'0 2px 12px #000'}}
                formatter={(value, name) => [
                  <span style={{color:'#4F8DFD', fontWeight:800, fontSize:'1.15em', textShadow:'0 2px 8px #23272f'}}>{value}</span>,
                  <span style={{color:'#fff', fontWeight:600}}>{name}</span>
                ]}
              />
              <Bar
                dataKey="value"
                radius={[14,14,14,14]}
                isAnimationActive={true}
                animationDuration={1400}
                barSize={38}
                label={({ x, y, width, value, index }) => {
                  // Animated value label
                  const labelColors = [
                    { fill: '#4F8DFD', shadow: '#23272f' }, // Total
                    { fill: '#fff', shadow: '#23272f' },    // Online
                    { fill: '#fff', shadow: '#23272f' },    // Warning
                    { fill: '#fff', shadow: '#23272f' }     // Critical
                  ];
                  return (
                    <text
                      x={x + width / 2}
                      y={y - 16}
                      fill={labelColors[index].fill}
                      textAnchor="middle"
                      style={{
                        fontWeight: 900,
                        fontSize: '1.35em',
                        letterSpacing: '1px',
                        filter: `drop-shadow(0 2px 12px ${labelColors[index].shadow})`,
                        stroke: '#23272f',
                        strokeWidth: 0.5,
                        transition: 'fill 0.6s cubic-bezier(.68,-0.55,.27,1.55), font-size 0.6s',
                      }}
                    >
                      {value}
                    </text>
                  );
                }}
              >
                <Cell key="total" fill="url(#barGradientTotal)" />
                <Cell key="online" fill="url(#barGradientOnline)" />
                <Cell key="warning" fill="url(#barGradientWarning)" />
                <Cell key="critical" fill="url(#barGradientCritical)" />
              </Bar>
            </BarChart>
            <div style={{marginTop:'18px', color:'#bcee09', fontWeight:600, fontSize:'1em', letterSpacing:'1px', textShadow:'0 2px 8px #23272f'}}>Live device status overview</div>
          </div>
        </div>
        {/* CROSS-IHV COMPARISON */}
        <div className="dashboard-card animated-card chart-fadein" style={{animationDelay: '0.9s'}}>
          <div className="card-title" style={{display:'flex', alignItems:'center'}}>{cardIcons[2]}CROSS-IHV COMPARISON</div>
          <div style={{padding:'32px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
            <LineChart width={340} height={210} data={comparisonData} style={{background: 'rgba(44,62,80,0.08)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(44,62,80,0.10)', transition:'box-shadow 0.8s cubic-bezier(.68,-0.55,.27,1.55)'}}>
              <XAxis dataKey="name" stroke="#FFD600" fontSize={14} tick={{fill:'#FFD600', fontWeight:600}} axisLine={false} tickLine={false} />
              <YAxis stroke="#FFD600" fontSize={14} tick={{fill:'#FFD600', fontWeight:600}} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{background:'#23272f', color:'#FFD600', borderRadius:'12px', fontWeight:600, fontSize:'1em', border:'none', boxShadow:'0 2px 12px #000'}}
              />
              <Line type="monotone" dataKey="amd" stroke="#4F8DFD" strokeWidth={3} dot={{ r: 4, stroke:'#fff', strokeWidth:2 }} activeDot={{ r: 7, stroke:'#4F8DFD', strokeWidth:3 }} isAnimationActive={true} animationDuration={1200} />
              <Line type="monotone" dataKey="intel" stroke="#FFD600" strokeWidth={3} dot={{ r: 4, stroke:'#fff', strokeWidth:2 }} activeDot={{ r: 7, stroke:'#FFD600', strokeWidth:3 }} isAnimationActive={true} animationDuration={1200} />
              <Line type="monotone" dataKey="nvidia" stroke="#00A4EF" strokeWidth={3} dot={{ r: 4, stroke:'#fff', strokeWidth:2 }} activeDot={{ r: 7, stroke:'#00A4EF', strokeWidth:3 }} isAnimationActive={true} animationDuration={1200} />
              <Line type="monotone" dataKey="qualcomm" stroke="#2DE3A7" strokeWidth={3} dot={{ r: 4, stroke:'#fff', strokeWidth:2 }} activeDot={{ r: 7, stroke:'#2DE3A7', strokeWidth:3 }} isAnimationActive={true} animationDuration={1200} />
            </LineChart>
            <span style={{marginTop:'16px', color:'#FFD600', fontWeight:600, fontSize:'1em', letterSpacing:'1px', textShadow:'0 2px 8px #23272f'}}>Device performance and health comparison</span>
          </div>
        </div>
        {/* SYSTEM HEALTH & AVAILABILITY */}
        <div className="dashboard-card animated-card chart-fadein" style={{animationDelay: '1.1s'}}>
            <div className="dashboard-card animated-card chart-fadein" style={{animationDelay: '1.1s', cursor: 'pointer'}} onClick={() => navigate('/health')}>
              <div className="card-title" style={{display:'flex', alignItems:'center'}}>{cardIcons[3]}SYSTEM HEALTH & AVAILABILITY</div>
                <div style={{padding:'32px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center'}}>
                  <AreaChart width={340} height={210} data={[
                    { name: '10:00', health: 95, available: 90, alerts: 2 },
                    { name: '10:10', health: 92, available: 88, alerts: 3 },
                    { name: '10:20', health: 97, available: 93, alerts: 1 },
                    { name: '10:30', health: 93, available: 89, alerts: 4 },
                    { name: '10:40', health: 96, available: 92, alerts: 2 },
                    { name: '10:50', health: 94, available: 90, alerts: 3 }
                  ]} style={{background: 'rgba(44,62,80,0.08)', borderRadius: '18px', boxShadow: '0 4px 24px rgba(44,62,80,0.10)'}}>
                    <XAxis dataKey="name" stroke="#00A4EF" fontSize={14} tick={{fill:'#00A4EF', fontWeight:600}} axisLine={false} tickLine={false} />
                    <YAxis stroke="#00A4EF" fontSize={14} tick={{fill:'#00A4EF', fontWeight:600}} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{background:'#23272f', color:'#00A4EF', borderRadius:'12px', fontWeight:600, fontSize:'1em', border:'none', boxShadow:'0 2px 12px #000'}} />
                    <Area type="monotone" dataKey="health" stroke="#2DE3A7" strokeWidth={3} fill="#2DE3A7" fillOpacity={0.18} activeDot={{ r: 7 }} isAnimationActive={true} animationDuration={1200} name="Health" />
                    <Area type="monotone" dataKey="available" stroke="#4F8DFD" strokeWidth={3} fill="#4F8DFD" fillOpacity={0.18} activeDot={{ r: 7 }} isAnimationActive={true} animationDuration={1200} name="Available" />
                    <Area type="monotone" dataKey="alerts" stroke="#FFD600" strokeWidth={3} fill="#FFD600" fillOpacity={0.18} activeDot={{ r: 7 }} isAnimationActive={true} animationDuration={1200} name="Alerts" />
                  </AreaChart>
                  <span style={{marginTop:'16px', color:'#00A4EF', fontWeight:600, fontSize:'1em', letterSpacing:'1px', textShadow:'0 2px 8px #23272f'}}>Live system health, device availability, and alerts</span>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
