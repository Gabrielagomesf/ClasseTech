import {useState} from 'react';
import {lookupCep, type CepData} from '../services/api/lookupApi';

export function useCepLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(cep: string): Promise<CepData | null> {
    setLoading(true);
    setError(null);
    try {
      return await lookupCep(cep);
    } catch {
      setError('Não foi possível consultar o CEP. Preencha manualmente.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {lookup, loading, error};
}
