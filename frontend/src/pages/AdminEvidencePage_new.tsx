import React from 'react';
import { Shield } from 'lucide-react';

const AdminEvidencePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Evidence Management</h1>
          </div>

          <div className="text-center py-12">
            <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Evidence Management Feature Under Development
            </h3>
            <p className="text-gray-500">
              This feature is currently under development. Stay tuned!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEvidencePage;
