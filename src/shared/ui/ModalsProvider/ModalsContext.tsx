import { createContext } from 'react';
import type { TModalsHookResult } from './useModals';

type TModalsContext = TModalsHookResult;

export const ModalsContext = createContext<Partial<TModalsContext>>({});
