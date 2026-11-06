import React, { useState } from 'react';

const AdminPanel: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/leads', {
        headers: { 'Authorization': `Bearer ${password}` },
      });
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
        setAuthenticated(true);
      } else {
        alert('Invalid password');
      }
    } catch (e) {
      alert('Error fetching leads');
    }
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="p-8 bg-white rounded-xl shadow-lg text-center max-w-sm w-full">
          <h2 className="text-2xl font-bold mb-4">Admin Access</h2>
          <input
            type="password"
            placeholder="Enter Admin Password"
            className="w-full p-2 border rounded mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={fetchLeads}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-8">Lead Dashboard</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-4 font-semibold">Date</th>
              <th className="p-4 font-semibold">Company</th>
              <th className="p-4 font-semibold">Name</th>
              <th className="p-4 font-semibold">Bundle</th>
              <th className="p-4 font-semibold">MRR</th>
              <th className="p-4 font-semibold">Setup</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} className="border-b hover:bg-gray-50">
                <td className="p-4">{new Date(lead.timestamp).toLocaleDateString()}</td>
                <td className="p-4 font-medium">{lead.company}</td>
                <td className="p-4">{lead.name}</td>
                <td className="p-4">{lead.bundle}</td>
                <td className="p-4">${lead.mrr}</td>
                <td className="p-4">${lead.setup_fee}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;
