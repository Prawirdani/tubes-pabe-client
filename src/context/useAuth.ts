import { AuthCtx } from './AuthProvider';
import { useContext } from 'react';

export const useAuth = () => useContext(AuthCtx);
