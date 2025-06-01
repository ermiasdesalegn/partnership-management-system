import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { FaLock, FaUnlock, FaSave } from 'react-icons/fa';
import { getPartnershipPrivileges, setPartnershipPrivileges } from '../../api/adminApi';

const PartnerPrivileges = ({ partnerId }) => {
  const queryClient = useQueryClient();
  const [privileges, setPrivileges] = useState(null);  // <- start with null

  // Fetch current privileges
  const { data, isLoading, error } = useQuery({
    queryKey: ['partnerPrivileges', partnerId],
    queryFn: () => getPartnershipPrivileges(partnerId),
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to fetch privileges');
    }
  });

  // when data arrives, update local state
  useEffect(() => {
    if (data?.data?.privileges) {
      setPrivileges(data.data.privileges);
    }
  }, [data]);

  const updatePrivilegesMutation = useMutation({
    mutationFn: (newPrivileges) => setPartnershipPrivileges(partnerId, newPrivileges),
    onSuccess: () => {
      queryClient.invalidateQueries(['partnerPrivileges', partnerId]);
      toast.success('Privileges updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update privileges');
    }
  });

  const handleTogglePrivilege = (role) => {
    setPrivileges((prev) => ({
      ...prev,
      [role]: !prev[role],
    }));
  };

  const handleSavePrivileges = () => {
    updatePrivilegesMutation.mutate(privileges);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-700">Failed to load privileges. Please try again later.</p>
      </div>
    );
  }

  if (!privileges) {
    return (
      <div className="p-4 text-gray-600">No privileges data available.</div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Partnership Privileges</h3>

      <div className="space-y-4">
        {Object.entries(privileges).map(([role, isEnabled]) => (
          <div key={role} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center">
              {isEnabled ? (
                <FaUnlock className="text-green-500 mr-2" />
              ) : (
                <FaLock className="text-red-500 mr-2" />
              )}
              <span className="text-gray-700 capitalize">{role.replace('-', ' ')}</span>
            </div>
            <button
              onClick={() => handleTogglePrivilege(role)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {isEnabled ? 'Restrict Access' : 'Grant Access'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleSavePrivileges}
          disabled={updatePrivilegesMutation.isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <FaSave className="mr-2" />
          {updatePrivilegesMutation.isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default PartnerPrivileges;
