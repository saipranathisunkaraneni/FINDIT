import { useContext } from 'react';
import { FindItContext } from './findItContextDef';

export const useFindIt = () => {
  const context = useContext(FindItContext);
  if (!context) {
    throw new Error('useFindIt must be used within a FindItProvider');
  }
  return context;
};
