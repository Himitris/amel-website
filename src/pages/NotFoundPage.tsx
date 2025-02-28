import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg text-center">
        <h1 className="text-6xl font-extrabold text-silver-500">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700">Page non trouvée</h2>
        <p className="text-gray-500">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="pt-6">
          <Link 
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-silver-500 hover:bg-silver-600"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;