import React from 'react';
import GameCreationWizard from '../components/GameCreationWizard';
import { useTranslation } from 'react-i18next';

const CreateGameWizardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('createGame.title')}
          </h1>
          <p className="text-gray-600">
            {t('createGame.subtitle')}
          </p>
        </div>

        <GameCreationWizard />
      </div>
    </div>
  );
};

export default CreateGameWizardPage;
