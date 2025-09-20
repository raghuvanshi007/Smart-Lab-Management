import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingDashboard from './components/LandingDashboard';
import DeviceDashboard from './components/DeviceDashboard';
import HealthMonitor from './components/HealthMonitor';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingDashboard />} />
				<Route path="/dashboard" element={<DeviceDashboard />} />
				<Route path="/health" element={<HealthMonitor />} />
			</Routes>
		</Router>
	);
}

export default App;
