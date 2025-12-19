import React, { useState } from 'react';

function SupportDashboard() {
  const [tickets, setTickets] = useState([
    { id: 1, subject: 'Issue with product images not loading', priority: 'High', status: 'Open', date: 'Dec 5, 2023', customer: 'John Smith' },
    { id: 2, subject: 'Order #ORD-7842 shipping delay', priority: 'Medium', status: 'In Progress', date: 'Dec 4, 2023', customer: 'Sarah Johnson' },
    { id: 3, subject: 'Account login issues', priority: 'Low', status: 'Resolved', date: 'Dec 3, 2023', customer: 'Michael Brown' },
    { id: 4, subject: 'Payment gateway error', priority: 'High', status: 'Open', date: 'Dec 2, 2023', customer: 'Emily Davis' },
    { id: 5, subject: 'Product return request', priority: 'Medium', status: 'Closed', date: 'Dec 1, 2023', customer: 'Robert Wilson' }
  ]);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    priority: 'Medium',
    message: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewTicket(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitTicket = (e) => {
    e.preventDefault();
    if (newTicket.subject && newTicket.message) {
      const ticket = {
        id: tickets.length + 1,
        subject: newTicket.subject,
        priority: newTicket.priority,
        status: 'Open',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        customer: 'Admin'
      };
      setTickets([ticket, ...tickets]);
      setNewTicket({ subject: '', priority: 'Medium', message: '' });
      alert('Support ticket submitted successfully!');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return '#ff6b6b';
      case 'In Progress': return '#f368e0';
      case 'Resolved': return '#1dd1a1';
      case 'Closed': return '#4ecdc4';
      default: return '#00a8cc';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#ff6b6b';
      case 'Medium': return '#f368e0';
      case 'Low': return '#4ecdc4';
      default: return '#00a8cc';
    }
  };

  return (
    <div style={{ 
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '10px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
    }}>
      <h2 style={{ 
        color: '#0a4f70',
        marginBottom: '20px'
      }}>
        💬 Support Center
      </h2>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(500px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Create Support Ticket</h3>
          <form onSubmit={handleSubmitTicket}>
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Subject</label>
              <input
                type="text"
                name="subject"
                value={newTicket.subject}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
                placeholder="Brief description of the issue"
              />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Priority</label>
              <select
                name="priority"
                value={newTicket.priority}
                onChange={handleInputChange}
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
            
            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '5px' }}>Description</label>
              <textarea
                name="message"
                value={newTicket.message}
                onChange={handleInputChange}
                rows="5"
                style={{
                  width: '100%',
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ddd'
                }}
                placeholder="Detailed description of the issue"
              ></textarea>
            </div>
            
            <button type="submit" style={{
              padding: '10px 20px',
              backgroundColor: '#00a8cc',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}>
              Submit Ticket
            </button>
          </form>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
        }}>
          <h3>Support Statistics</h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <div style={{
              backgroundColor: 'rgba(0, 168, 204, 0.1)',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#00a8cc' }}>24</div>
              <div>Total Tickets</div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 107, 107, 0.1)',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#ff6b6b' }}>8</div>
              <div>Open Tickets</div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(31, 209, 161, 0.1)',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#1dd1a1' }}>12</div>
              <div>Resolved</div>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(243, 104, 224, 0.1)',
              padding: '15px',
              borderRadius: '5px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', color: '#f368e0' }}>4</div>
              <div>In Progress</div>
            </div>
          </div>
          
          <h3>Contact Information</h3>
          <div style={{ marginBottom: '10px' }}>
            <strong>Support Email:</strong> support@aquariumcommerce.com
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Phone:</strong> +1 (800) 123-4567
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM EST
          </div>
        </div>
      </div>
      
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.05)'
      }}>
        <h3>Recent Support Tickets</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #eee' }}>
              <th style={{ textAlign: 'left', padding: '10px' }}>ID</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Subject</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Customer</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Date</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '10px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map(ticket => (
              <tr key={ticket.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '10px' }}>#{ticket.id}</td>
                <td style={{ padding: '10px' }}>{ticket.subject}</td>
                <td style={{ padding: '10px' }}>{ticket.customer}</td>
                <td style={{ padding: '10px' }}>{ticket.date}</td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    color: getPriorityColor(ticket.priority),
                    fontWeight: 'bold'
                  }}>
                    {ticket.priority}
                  </span>
                </td>
                <td style={{ padding: '10px' }}>
                  <span style={{ 
                    color: getStatusColor(ticket.status),
                    fontWeight: 'bold'
                  }}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SupportDashboard;