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
       <div className="min-h-screen flex items-center justify-center bg-bg">
         <div className="p-8 bg-surface border border-border rounded-xl shadow-sm text-center max-w-sm w-full">
           <h2 className="text-2xl font-bold mb-4 text-fg">Admin Access</h2>
           <input
             type="password"
             placeholder="Enter Admin Password"
             className="input-field w-full mb-4"
             value={password}
             onChange={(e) => setPassword(e.target.value)}
           />
           <button
             onClick={fetchLeads}
             className="w-full py-2 bg-accent text-surface rounded font-semibold hover:bg-accent-hover transition-colors"
           >
             Login
           </button>
         </div>
       </div>
    );
  }

   return (
     <div className="p-8 bg-bg min-h-screen">
       <h2 className="text-3xl font-bold mb-8 text-fg">Lead Dashboard</h2>
       <div className="overflow-x-auto bg-surface rounded-lg border border-border shadow-sm">
         <table className="w-full text-left border-collapse">
           <thead className="bg-bg border-b border-border">
             <tr className="border-b">
               <th className="p-4 font-semibold text-muted">Date</th>
               <th className="p-4 font-semibold text-muted">Company</th>
               <th className="p-4 font-semibold text-muted">Name</th>
               <th className="p-4 font-semibold text-muted">Bundle</th>
               <th className="p-4 font-semibold text-muted">MRR</th>
               <th className="p-4 font-semibold text-muted">Setup</th>
             </tr>
           </thead>
           <tbody>
             {leads.map((lead) => (
               <tr key={lead.id} className="border-b border-border hover:bg-bg/50 transition-colors">
                 <td className="p-4 text-fg">{new Date(lead.timestamp).toLocaleDateString()}</td>
                 <td className="p-4 font-medium text-fg">{lead.company}</td>
                 <td className="p-4 text-fg">{lead.name}</td>
                 <td className="p-4 text-fg">{lead.bundle}</td>
                 <td className="p-4 text-fg">${lead.mrr}</td>
                 <td className="p-4 text-fg">${lead.setup_fee}</td>
               </tr>
             ))}
           </tbody>
         </table>
       </div>
     </div>
   );
};

export default AdminPanel;
