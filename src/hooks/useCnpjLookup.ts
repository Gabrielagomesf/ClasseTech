import {useState} from 'react';
import {lookupCnpj, type CnpjData} from '../services/api/lookupApi';

export function useCnpjLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(cnpj: string): Promise<CnpjData | null> {
    setLoading(true);
    setError(null);
    try {
      return await lookupCnpj(cnpj);
    } catch {
      setError(
        'Não foi possível consultar o CNPJ. Você pode continuar preenchendo manualmente.',
      );
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {lookup, loading, error};
}
