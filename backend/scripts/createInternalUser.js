const axios = require('axios');

const createInternalUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/v1/super-admin/users/internal', {
      email: 'internal@insa.com',
      name: 'Internal User',
      department: 'Internal Affairs'
    });

    console.log('Internal user created successfully:', response.data);
    console.log('Setup link:', response.data.data.setupLink);
  } catch (error) {
    console.error('Error creating internal user:', error.response?.data || error.message);
  }
};

createInternalUser(); 