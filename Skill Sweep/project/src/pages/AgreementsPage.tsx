import React from 'react';
import AgreementList from '../components/agreement/AgreementList';

const AgreementsPage: React.FC = () => {
  return (
    <div className="flex justify-center">
      <div className="w-full">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Agreements</h1>
        <AgreementList />
      </div>
    </div>
  );
};

export default AgreementsPage;