import axios from 'axios';

const createTestRequest = async () => {
  try {
    // First login to get the token
    const loginResponse = await axios.post('http://localhost:5000/api/v1/internal/login', {
      email: 'internal@insa.com',
      password: 'internal123'
    });

    const token = loginResponse.data.token;

    // Create a test request
    const requestResponse = await axios.post(
      'http://localhost:5000/api/v1/internal/requests',
      {
        title: 'Test Request',
        description: 'This is a test request created for testing the dashboard',
        priority: 'medium',
        category: 'general',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log('Test request created successfully:', requestResponse.data);
  } catch (error) {
    console.error('Error creating test request:', error.response?.data || error.message);
  }
};

createTestRequest(); 