import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

const DailyVisPage = () => {
  const svgRef = useRef(null);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apiStatus, setApiStatus] = useState('checking'); // 'online', 'offline', 'checking'
  
  // Check API health on component mount
  useEffect(() => {
    fetch('http://174.138.45.200:3000/api/healthcheck')
      .then(res => {
        if (res.ok) {
          setApiStatus('online');
        } else {
          setApiStatus('offline');
        }
      })
      .catch(() => {
        setApiStatus('offline');
      });
      
    // Check status every 30 seconds
    const statusInterval = setInterval(() => {
      fetch('http://174.138.45.200:3000/api/healthcheck')
        .then(res => {
          setApiStatus(res.ok ? 'online' : 'offline');
        })
        .catch(() => {
          setApiStatus('offline');
        });
    }, 30000);
    
    return () => clearInterval(statusInterval);
  }, []);

  // Generate some sample daily data if we don't have real data yet
  useEffect(() => {
    // This would normally come from your API
    const sampleData = [
      { domain: 'github.com', count: 25, day: 'Mon' },
      { domain: 'twitter.com', count: 18, day: 'Mon' },
      { domain: 'medium.com', count: 15, day: 'Mon' },
      { domain: 'dev.to', count: 12, day: 'Mon' },
      { domain: 'nytimes.com', count: 10, day: 'Mon' },
      { domain: 'github.com', count: 22, day: 'Tue' },
      { domain: 'twitter.com', count: 20, day: 'Tue' },
      { domain: 'medium.com', count: 12, day: 'Tue' },
      { domain: 'dev.to', count: 15, day: 'Tue' },
      { domain: 'nytimes.com', count: 8, day: 'Tue' },
      { domain: 'github.com', count: 30, day: 'Wed' },
      { domain: 'twitter.com', count: 15, day: 'Wed' },
      { domain: 'medium.com', count: 20, day: 'Wed' },
      { domain: 'dev.to', count: 10, day: 'Wed' },
      { domain: 'nytimes.com', count: 12, day: 'Wed' },
    ];

    // Fetch real data from API if available
    const fetchData = async () => {
      try {
        // Use the new daily-domains endpoint 
        const response = await fetch('http://174.138.45.200:3000/api/daily-domains');
        if (response.ok) {
          const result = await response.json();
          if (result && result.daily_domains) {
            // Use the daily domains data which already includes day information
            setData(result.daily_domains);
            console.log('Fetched daily domain data:', result.daily_domains);
          } else {
            console.warn('API returned invalid data format, using sample data');
            setData(sampleData);
          }
        } else {
          // Try backup endpoint if the daily endpoint isn't available yet
          try {
            const topDomainsResponse = await fetch('http://174.138.45.200:3000/api/top-domains');
            if (topDomainsResponse.ok) {
              const topDomainsResult = await topDomainsResponse.json();
              if (topDomainsResult && topDomainsResult.domains) {
                // Map the top domains to days of the week for visualization
                const apiData = topDomainsResult.domains.slice(0, 30).map((item, index) => ({
                  ...item,
                  day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index % 7]
                }));
                setData(apiData);
                console.log('Fetched domain data from fallback endpoint:', apiData);
              } else {
                setData(sampleData);
              }
            } else {
              setData(sampleData);
            }
          } catch (fallbackError) {
            console.error('Error with fallback endpoint:', fallbackError);
            setData(sampleData);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setData(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    // Set up animation interval
    const interval = setInterval(() => {
      // Add some random variation to make the animation more interesting
      setData(current => 
        current.map(item => ({
          ...item,
          count: Math.max(5, item.count + Math.floor(Math.random() * 6) - 2)
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Create D3 visualization
  useEffect(() => {
    if (loading || !data.length) return;

    const svg = d3.select(svgRef.current);
    const width = svg.node().getBoundingClientRect().width;
    const height = 400;
    const margin = { top: 30, right: 30, bottom: 50, left: 60 };
    
    svg.selectAll("*").remove();
    
    // Find unique days
    const days = [...new Set(data.map(d => d.day))];
    
    // X scale
    const x = d3.scaleBand()
      .domain(days)
      .range([margin.left, width - margin.right])
      .padding(0.1);
    
    // Y scale
    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.count) * 1.1])
      .range([height - margin.bottom, margin.top]);
    
    // Color scale
    const color = d3.scaleOrdinal()
      .domain([...new Set(data.map(d => d.domain))])
      .range(d3.schemeSet3);
    
    // Create groups for each day
    const dayGroups = svg.selectAll(".day-group")
      .data(days)
      .join("g")
      .attr("class", "day-group");
    
    // For each day, create stacked bars
    days.forEach(day => {
      const dayData = data.filter(d => d.day === day);
      
      // Sort by count (descending)
      dayData.sort((a, b) => b.count - a.count);
      
      // Calculate positions
      let yPos = height - margin.bottom;
      
      // Draw bars for this day
      dayGroups.filter(d => d === day)
        .selectAll("rect")
        .data(dayData)
        .join("rect")
        .attr("x", () => x(day))
        .attr("y", d => {
          const prevYPos = yPos;
          yPos -= (d.count / d3.max(data, d => d.count)) * (height - margin.top - margin.bottom);
          return prevYPos - (d.count / d3.max(data, d => d.count)) * (height - margin.top - margin.bottom);
        })
        .attr("width", x.bandwidth())
        .attr("height", d => (d.count / d3.max(data, d => d.count)) * (height - margin.top - margin.bottom))
        .attr("fill", d => color(d.domain))
        .attr("stroke", "#00ff00")
        .attr("stroke-width", 1.5)
        .attr("opacity", 0.8)
        .on("mouseover", function(event, d) {
          d3.select(this)
            .attr("opacity", 1)
            .attr("stroke-width", 3);
          
          // Add tooltip
          svg.append("text")
            .attr("class", "tooltip")
            .attr("x", x(day) + x.bandwidth() / 2)
            .attr("y", y(d.count) - 10)
            .attr("text-anchor", "middle")
            .attr("fill", "white")
            .text(`${d.domain}: ${d.count}`);
        })
        .on("mouseout", function() {
          d3.select(this)
            .attr("opacity", 0.8)
            .attr("stroke-width", 1.5);
          
          svg.selectAll(".tooltip").remove();
        });
    });
    
    // Add X axis
    svg.append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .style("color", "#00ff00");
    
    // Add Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .style("color", "#00ff00");
    
    // Add X axis label
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height - 10)
      .attr("text-anchor", "middle")
      .attr("fill", "#00ff00")
      .text("Day of Week");
    
    // Add Y axis label
    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -(height / 2))
      .attr("y", 15)
      .attr("text-anchor", "middle")
      .attr("fill", "#00ff00")
      .text("Domain Count");
    
    // Add legend
    const uniqueDomains = [...new Set(data.map(d => d.domain))];
    const legendGroup = svg.append("g")
      .attr("transform", `translate(${width - margin.right - 100},${margin.top})`);
    
    legendGroup.selectAll("rect")
      .data(uniqueDomains)
      .join("rect")
      .attr("x", 0)
      .attr("y", (d, i) => i * 20)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", d => color(d))
      .attr("stroke", "#00ff00")
      .attr("stroke-width", 1);
    
    legendGroup.selectAll("text")
      .data(uniqueDomains)
      .join("text")
      .attr("x", 20)
      .attr("y", (d, i) => i * 20 + 12.5)
      .attr("fill", "#00ff00")
      .text(d => d);
    
    // Add animation - transition height changes
    svg.selectAll("rect")
      .transition()
      .duration(1000)
      .attr("y", function() { return d3.select(this).attr("y"); })
      .attr("height", function() { return d3.select(this).attr("height"); });
      
  }, [data, loading]);

  if (loading) {
    return <div>Loading visualization...</div>;
  }

  const [selectedDay, setSelectedDay] = useState(null);
  
  const filteredData = selectedDay 
    ? data.filter(item => item.day === selectedDay)
    : data;
    
  return (
    <div className="daily-viz-page">
      <h1 className="title">Daily Domain Visualization</h1>
      
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        marginBottom: '10px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '14px',
          backgroundColor: apiStatus === 'online' ? '#004d00' : 
                          apiStatus === 'offline' ? '#4d0000' : '#333',
          color: '#fff'
        }}>
          <span style={{
            height: '10px',
            width: '10px',
            borderRadius: '50%',
            backgroundColor: apiStatus === 'online' ? '#00ff00' : 
                            apiStatus === 'offline' ? '#ff0000' : '#ffaa00',
            marginRight: '8px',
            display: 'inline-block'
          }}></span>
          API Status: {apiStatus === 'online' ? 'Connected' : 
                     apiStatus === 'offline' ? 'Disconnected' : 'Checking...'}
        </div>
      </div>
      
      <div className="controls">
        <button 
          className="refresh-button"
          onClick={() => {
            setLoading(true);
            fetch('http://174.138.45.200:3000/api/daily-domains')
              .then(res => res.json())
              .then(result => {
                if (result && result.daily_domains) {
                  setData(result.daily_domains);
                } else {
                  // Fallback to top-domains if necessary
                  return fetch('http://174.138.45.200:3000/api/top-domains').then(res => res.json());
                }
              })
              .then(result => {
                if (result && result.domains) {
                  const apiData = result.domains.slice(0, 30).map((item, index) => ({
                    ...item,
                    day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index % 7]
                  }));
                  setData(apiData);
                }
                setLoading(false);
              })
              .catch(err => {
                console.error(err);
                setLoading(false);
              });
          }}
        >
          Refresh Data
        </button>
        
        {selectedDay ? (
          <button 
            className="toggle-button"
            onClick={() => setSelectedDay(null)}
          >
            Show All Days
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '5px' }}>
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
              <button
                key={day}
                className="toggle-button"
                onClick={() => setSelectedDay(day)}
                style={{ 
                  padding: '8px 12px',
                  minWidth: '40px'
                }}
              >
                {day}
              </button>
            ))}
          </div>
        )}
      </div>
      
      <div className="chart-container fade-in" style={{ 
        border: '2px solid #00ff00', 
        borderRadius: '5px',
        padding: '20px',
        marginBottom: '20px',
        backgroundColor: '#111'
      }}>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <div>Loading visualization data...</div>
          </div>
        ) : (
          <svg ref={svgRef} width="100%" height="400" style={{ backgroundColor: '#111' }}></svg>
        )}
      </div>
      
      <h2 className="section-title">
        {selectedDay ? `Domains for ${selectedDay}` : 'Domains by Day'}
      </h2>
      
      <div className="domains-grid">
        {filteredData.map((item, index) => (
          <div 
            key={index} 
            className={`domain-card pop-in`}
            style={{ 
              border: '2px solid #00ff00',
              borderRadius: '5px',
              padding: '10px',
              backgroundColor: '#111',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animationDelay: `${index * 0.05}s`
            }}
          >
            <div className="domain-name" style={{ fontWeight: 'bold', color: '#00ff00' }}>
              <a href={`https://${item.domain}`} target="_blank" rel="noopener noreferrer">
                {item.domain}
              </a>
            </div>
            <div className="domain-stats" style={{ marginTop: '5px' }}>
              <div className="domain-count">
                <span className="count-number">{item.count}</span>
                <span className="count-label">mentions</span>
              </div>
              <div style={{ color: '#00cc00', marginTop: '5px' }}>Day: {item.day}</div>
            </div>
            
            {index === 0 && item.day === selectedDay && (
              <div className="top-badge">TOP</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyVisPage;