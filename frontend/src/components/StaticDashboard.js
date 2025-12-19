import React from 'react';
import homeBackground from '../assets/homeaq.jpeg';

function StaticDashboard() {
  return (
    <div style={{ 
      textAlign: 'center', 
      padding: '2rem',
      backgroundImage: `url(${homeBackground})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background bubbles */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0) translateX(0) rotate(0deg);
              opacity: 0.2;
            }
            50% {
              transform: translateY(-20px) translateX(10px) rotate(180deg);
              opacity: 0.5;
            }
            100% {
              transform: translateY(0) translateX(0) rotate(360deg);
              opacity: 0.2;
            }
          }
          
          @keyframes lightning {
            0% {
              text-shadow: 0 0 5px rgba(0, 168, 204, 0.5), 0 0 10px rgba(0, 168, 204, 0.3);
            }
            50% {
              text-shadow: 0 0 15px rgba(0, 168, 204, 0.8), 0 0 25px rgba(0, 168, 204, 0.6), 0 0 35px rgba(0, 168, 204, 0.4);
            }
            100% {
              text-shadow: 0 0 10px rgba(0, 168, 204, 0.7), 0 0 20px rgba(0, 168, 204, 0.5), 0 0 30px rgba(0, 168, 204, 0.3);
            }
          }
        `}
      </style>
      
      {/* Floating bubbles */}
      {Array.from({ length: 15 }, (_, i) => (
        <div 
          key={i}
          style={{
            position: 'absolute',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            animation: `float ${15 + Math.random() * 10}s infinite ease-in-out`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${20 + Math.random() * 40}px`,
            height: `${20 + Math.random() * 40}px`,
            animationDelay: `${Math.random() * 5}s`
          }}
        />
      ))}
      
      <div style={{
        backgroundColor: 'rgba(0, 30, 60, 0.85)',
        padding: '2.5rem',
        borderRadius: '20px',
        maxWidth: '1200px',
        margin: '2rem auto',
        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        position: 'relative',
        zIndex: 2
      }}>
        {/* Navigation Bar */}
        <nav style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '2rem',
          marginBottom: '2rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
          paddingBottom: '1rem'
        }}>
          <a href="#home" style={{ 
            color: '#00a8cc', 
            textDecoration: 'none', 
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>Home</a>
          <a href="#about" style={{ 
            color: '#00a8cc', 
            textDecoration: 'none', 
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>About</a>
          <a href="#profile" style={{ 
            color: '#00a8cc', 
            textDecoration: 'none', 
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>Profile</a>
          <a href="#contact" style={{ 
            color: '#00a8cc', 
            textDecoration: 'none', 
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }}>Contact Us</a>
        </nav>

        {/* Home Section */}
        <section id="home" style={{ 
          padding: '2rem 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h1 style={{ 
            fontSize: '3rem',
            margin: '0 0 1rem 0',
            background: 'linear-gradient(90deg, #00a8cc, #0a4f70)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Aquarium Commerce
          </h1>
          <p style={{ 
            fontSize: '1.5rem', 
            maxWidth: '800px', 
            margin: '0 auto 2rem auto',
            color: '#00a8cc',
            textShadow: '0 0 10px rgba(0, 168, 204, 0.7), 0 0 20px rgba(0, 168, 204, 0.5), 0 0 30px rgba(0, 168, 204, 0.3)',
            animation: 'lightning 2s infinite alternate'
          }}>
            🌊 Your Ultimate B2B & B2C Marketplace for All Things Aquatic! 🐠
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '2rem', 
            margin: '3rem 0'
          }}>
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              width: '250px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>🐠</div>
              <h3 style={{ 
                color: '#FF6B6B',
                marginBottom: '1rem'
              }}>For Customers</h3>
              <p>Find the best aquarium products from trusted retailers</p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '15px',
              width: '250px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>🏪</div>
              <h3 style={{ 
                color: '#4ECDC4',
                marginBottom: '1rem'
              }}>For Retailers</h3>
              <p>Expand your customer base and manage inventory efficiently</p>
            </div>
            
            <div style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              padding: '2rem',
              borderRadius: '15px',
              width: '250px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(5px)'
            }}>
              <div style={{
                fontSize: '3rem',
                marginBottom: '1rem'
              }}>📦</div>
              <h3 style={{ 
                color: '#FFD166',
                marginBottom: '1rem'
              }}>For Wholesalers</h3>
              <p>Connect with retailers and streamline bulk orders</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" style={{ 
          padding: '3rem 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            marginBottom: '1.5rem',
            fontSize: '2.5rem',
            color: '#00a8cc'
          }}>
            About Our Platform
          </h2>
          <p style={{ 
            fontSize: '1.2rem', 
            lineHeight: '1.7',
            maxWidth: '900px',
            margin: '0 auto',
            padding: '0 1rem'
          }}>
            Aquarium Commerce is a comprehensive B2B and B2C e-commerce platform designed specifically for the aquarium industry. 
            Whether you're a hobbyist looking for the perfect fish tank setup, a retailer expanding your product range, 
            or a wholesaler managing bulk orders, our platform connects all stakeholders in the aquarium ecosystem. 
            With features like real-time inventory tracking, order management, and product recommendations, 
            we make aquarium commerce seamless and efficient for everyone involved.
          </p>
          
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '2rem', 
            margin: '3rem 0'
          }}>
            <div style={{ width: '300px' }}>
              <div style={{
                height: '200px',
                backgroundColor: 'rgba(0, 100, 150, 0.3)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid rgba(0, 168, 204, 0.3)'
              }}>
                <span style={{ fontSize: '3rem' }}>🚀</span>
              </div>
              <h3 style={{ color: '#4ECDC4' }}>Innovation</h3>
              <p>Cutting-edge technology for modern aquarium commerce</p>
            </div>
            
            <div style={{ width: '300px' }}>
              <div style={{
                height: '200px',
                backgroundColor: 'rgba(0, 100, 150, 0.3)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid rgba(0, 168, 204, 0.3)'
              }}>
                <span style={{ fontSize: '3rem' }}>🤝</span>
              </div>
              <h3 style={{ color: '#FF6B6B' }}>Community</h3>
              <p>Connecting all stakeholders in the aquarium ecosystem</p>
            </div>
            
            <div style={{ width: '300px' }}>
              <div style={{
                height: '200px',
                backgroundColor: 'rgba(0, 100, 150, 0.3)',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                border: '1px solid rgba(0, 168, 204, 0.3)'
              }}>
                <span style={{ fontSize: '3rem' }}>🔒</span>
              </div>
              <h3 style={{ color: '#FFD166' }}>Security</h3>
              <p>Secure transactions and data protection</p>
            </div>
          </div>
        </section>

        {/* Profile Section */}
        <section id="profile" style={{ 
          padding: '3rem 0',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <h2 style={{ 
            marginBottom: '2rem',
            fontSize: '2.5rem',
            color: '#00a8cc'
          }}>
            User Profile
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '3rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '300px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 168, 204, 0.3)',
                margin: '0 auto 1.5rem auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '4rem'
              }}>
                👤
              </div>
              <h3 style={{ color: '#00a8cc' }}>John Doe</h3>
              <p style={{ color: '#aaa' }}>Customer</p>
              <p style={{ marginTop: '1rem' }}>
                Member since: January 2023<br />
                Total Orders: 15<br />
                Favorite Category: Fish Tanks
              </p>
            </div>
            
            <div style={{
              width: '600px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                color: '#00a8cc',
                marginBottom: '1.5rem'
              }}>Account Details</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Full Name</label>
                <input 
                  type="text" 
                  defaultValue="John Doe"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Email Address</label>
                <input 
                  type="email" 
                  defaultValue="john.doe@example.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+1 (555) 123-4567"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <button style={{
                marginTop: '1.5rem',
                padding: '0.8rem 2rem',
                backgroundColor: '#00a8cc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Update Profile
              </button>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" style={{ 
          padding: '3rem 0'
        }}>
          <h2 style={{ 
            marginBottom: '2rem',
            fontSize: '2.5rem',
            color: '#00a8cc'
          }}>
            Contact Us
          </h2>
          
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '3rem'
          }}>
            <div style={{ 
              width: '300px',
              textAlign: 'left'
            }}>
              <h3 style={{ color: '#00a8cc' }}>Get in Touch</h3>
              <p style={{ marginBottom: '1.5rem' }}>
                Have questions or feedback? We'd love to hear from you.
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#00a8cc' }}>📧 Email:</strong><br />
                support@aquariumcommerce.com
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#00a8cc' }}>📞 Phone:</strong><br />
                +1 (800) 123-4567
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <strong style={{ color: '#00a8cc' }}>🏢 Office:</strong><br />
                123 Aquarium Street<br />
                Marine City, MC 12345
              </div>
            </div>
            
            <div style={{
              width: '500px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              padding: '2rem',
              borderRadius: '15px',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              textAlign: 'left'
            }}>
              <h3 style={{ 
                color: '#00a8cc',
                marginBottom: '1.5rem'
              }}>Send us a Message</h3>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Name</label>
                <input 
                  type="text" 
                  placeholder="Your Name"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Email</label>
                <input 
                  type="email" 
                  placeholder="your.email@example.com"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Subject</label>
                <input 
                  type="text" 
                  placeholder="How can we help?"
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white'
                  }}
                />
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '0.5rem',
                  color: '#00a8cc'
                }}>Message</label>
                <textarea 
                  rows="5"
                  placeholder="Your message here..."
                  style={{
                    width: '100%',
                    padding: '0.8rem',
                    borderRadius: '5px',
                    border: '1px solid rgba(0, 168, 204, 0.5)',
                    backgroundColor: 'rgba(0, 30, 60, 0.5)',
                    color: 'white',
                    resize: 'vertical'
                  }}
                ></textarea>
              </div>
              
              <button style={{
                padding: '0.8rem 2rem',
                backgroundColor: '#00a8cc',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}>
                Send Message
              </button>
            </div>
          </div>
        </section>
        
        {/* Footer */}
        <footer style={{
          marginTop: '3rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center'
        }}>
          <p>© 2023 Aquarium Commerce. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
}

export default StaticDashboard;