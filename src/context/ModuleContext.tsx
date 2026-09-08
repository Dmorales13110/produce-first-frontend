import { createContext, useContext, useState, type ReactNode } from 'react';

// Definimos los módulos válidos como un tipo literal
export type AppModule = 'grower' | 'cooling' | 'produce-first';

interface ModuleContextType {
  activeModule: AppModule;
  setActiveModule: (module: AppModule) => void;
}

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export const ModuleProvider = ({ children }: { children: ReactNode }) => {
  const [activeModule, setActiveModule] = useState<AppModule>('grower');

  return (
    <ModuleContext.Provider value={{ activeModule, setActiveModule }}>
      {children}
    </ModuleContext.Provider>
  );
};

export const useModule = (): ModuleContextType => {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error('useModule debe ser usado dentro de un ModuleProvider');
  }
  return context;
};