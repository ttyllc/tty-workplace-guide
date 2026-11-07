import React from 'react';

const MOCK_EVENTS = [
    "Client in Fort Myers just configured Fiduciary & Tax + 12 users",
    "New Workplace Solution designed for Legal firm in Naples",
    "Tax professional in Cape Coral just upgraded to Encrypted Tax Vault",
    "Fiduciary firm in Sarasota configured Audit-Ready Exchange P1",
    "Business Base setup completed for 5-user agency in Bonita Springs",
    "Client in Estero just added Virtual Attendant & Dedicated DID",
];

const LiveTicker: React.FC = () => {
    return (
        <div className="ticker-container">
            <div className="ticker-track">
                {/* Duplicate list for seamless looping */}
                {[...MOCK_EVENTS, ...MOCK_EVENTS].map((event, i) => (
                    <div key={i} className="ticker-item">
                        <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                        {event}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LiveTicker;
