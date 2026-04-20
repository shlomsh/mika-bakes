import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RecipeWithDetails } from '@/types';
import { CookAlongMode, readStoredMode } from './ModeSelector';
import CookAlongCozy from './CookAlongCozy';
import CookAlongStudio from './CookAlongStudio';

interface Props {
  recipe: RecipeWithDetails;
  onClose: () => void;
}

const CookAlong: React.FC<Props> = ({ recipe, onClose }) => {
  const [searchParams] = useSearchParams();
  const paramMode = searchParams.get('mode') as CookAlongMode | null;
  const [mode, setMode] = useState<CookAlongMode>(
    paramMode === 'cozy' || paramMode === 'studio' ? paramMode : readStoredMode()
  );

  const sharedProps = { recipe, mode, onModeChange: setMode, onClose };

  return mode === 'studio'
    ? <CookAlongStudio {...sharedProps} />
    : <CookAlongCozy {...sharedProps} />;
};

export default CookAlong;
