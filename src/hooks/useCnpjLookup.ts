import {useState} from 'react';
import {
  fetchCompanyByCnpj,
  type CnpjResponse,
} from '../services/api/brasilApi';

export function useCnpjLookup() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function lookup(cnpj: string): Promise<CnpjResponse | null> {
    setLoading(true);
    setError(null);
    try {
      return await fetchCompanyByCnpj(cnpj);
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
