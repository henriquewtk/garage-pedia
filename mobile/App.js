import React, { useEffect } from 'react';

import AppNavigator from './src/navigation/AppNavigator';
import { inicializarBanco } from './src/database/database';

export default function App() {
  useEffect(() => {
    inicializarBanco();
  }, []);

  return <AppNavigator />;
}