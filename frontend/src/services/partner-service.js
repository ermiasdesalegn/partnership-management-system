import httpService from './http-service.js';

const create = () => {
  const getOverallPartnershipStatistics = async () => {
    const response = await httpService.get('/api/v1/admin/partnership-statistics/overall');
    return response.data;
  };

  const getSignedPartnersActivityStatistics = async () => {
    const response = await httpService.get('/api/partnership-statistics/signed-partners');
    return response.data;
  };

  return {
    getOverallPartnershipStatistics,
    getSignedPartnersActivityStatistics
  };
};

export default create(); 