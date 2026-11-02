import {useState} from 'react';
import {fetchAddressByCep, type CepResponse} from '../services/api/brasilApi';

export function useCepLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(cep: string): Promise<CepResponse | null> {
    setLoading(true);
    setError(null);
    try {
      return await fetchAddressByCep(cep);
    } catch {
      setError('Não foi possível consultar o CEP. Preencha manualmente.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {lookup, loading, error};
}
