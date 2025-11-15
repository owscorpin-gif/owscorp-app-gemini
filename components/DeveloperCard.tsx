import React from 'react';
import type { Profile } from '../types';

interface DeveloperCardProps {
  developer: Profile;
  onNavigate: (page: string, params?: any) => void;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onNavigate }) => {
  const isVerified = developer.verification_status === 'Verified';
  
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group flex flex-col text-center">
      <div className="p-6">
        <img 
          src={`https://i.pravatar.cc/150?u=${developer.id}`} 
          alt={developer.full_name || 'Developer'} 
          className="w-24 h-24 rounded-full object-cover shadow-md mx-auto mb-4 border-4 border-white group-hover:border-primary transition-colors"
        />
        <h3 className="text-xl font-bold font-heading text-gray-900 inline-flex items-center">
          {developer.full_name || 'Unnamed Developer'}
          {isVerified && (
            <span title="Verified Developer">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1.5 text-primary" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            </span>
          )}
        </h3>
        {developer.company_name && <p className="text-sm text-gray-500">{developer.company_name}</p>}
        <p className="text-gray-600 mt-2 text-sm h-20 overflow-hidden">
          {developer.description ? `${developer.description.substring(0, 100)}...` : 'No bio provided.'}
        </p>
      </div>
      <div className="mt-auto p-6 bg-secondary">
        <button 
          onClick={() => onNavigate('developer', { developerId: developer.id })}
          className="w-full bg-primary text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-900 transition-colors"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default DeveloperCard;