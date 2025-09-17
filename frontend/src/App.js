import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingDashboard from './components/LandingDashboard';
import DeviceDashboard from './components/DeviceDashboard';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<LandingDashboard />} />
				<Route path="/dashboard" element={<DeviceDashboard />} />
			</Routes>
		</Router>
	);
}

export default App;
