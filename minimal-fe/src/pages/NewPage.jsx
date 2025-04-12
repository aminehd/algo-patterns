import React, { useState, useEffect } from 'react';

const NewPage = () => {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from our new API endpoint
    fetch('http://174.138.45.200:3000/api/daily-domains')
      .then(response => {
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data && data.daily_domains) {
          setDomains(data.daily_domains);
        } else {
          setError('Invalid data format received from API');
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching data:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Group domains by day
  const domainsByDay = domains.reduce((acc, domain) => {
    const day = domain.day;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(domain);
    return acc;
  }, {});

  if (loading) {
    return (
      <div style={{ padding: '20px', color: '#00ff00' }}>
        <h1>Loading Daily Domain Data...</h1>
        <div style={{ 
          width: '50px',
          height: '50px',
          border: '5px solid rgba(0, 255, 0, 0.3)',
          borderRadius: '50%',
          borderTopColor: '#00ff00',
          animation: 'spin 1s linear infinite',
          margin: '20px auto'
        }}></div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: '#ff0000' }}>
        <h1>Error Loading Data</h1>
        <p>{error}</p>
        <p>Please check your backend connection and try again later.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#121212', color: '#e0e0e0' }}>
      <h1 style={{ color: '#00ff00', textAlign: 'center', marginBottom: '20px' }}>
        Daily Domain Visualization
      </h1>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '20px',
        marginTop: '20px'
      }}>
        {Object.entries(domainsByDay).map(([day, dayDomains]) => (
          <div key={day} style={{ 
            border: '2px solid #00ff00',
            borderRadius: '8px',
            padding: '15px',
            backgroundColor: '#1a1a1a'
          }}>
            <h2 style={{ color: '#00ff00', textAlign: 'center', marginBottom: '15px' }}>
              {day}
            </h2>
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              {dayDomains.map((domain, index) => (
                <div key={index} style={{
                  backgroundColor: '#222',
                  border: '1px solid #333',
                  borderLeft: `4px solid #00ff00`,
                  padding: '10px',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ fontWeight: 'bold' }}>
                    <a 
                      href={`https://${domain.domain}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: '#00cc00', textDecoration: 'none' }}
                    >
                      {domain.domain}
                    </a>
                  </div>
                  <div style={{ 
                    backgroundColor: '#004400',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '14px'
                  }}>
                    {domain.count}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPage;