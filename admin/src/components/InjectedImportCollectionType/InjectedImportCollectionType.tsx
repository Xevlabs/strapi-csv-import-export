import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { ImportModal } from '../ImportModal/ImportModal';
import pluginId from '../../../../server/src/utils/pluginId';
import { useSlug } from '../../hooks/useSlug';
import { getAuthHeader } from '../../utils/auth';

export const InjectedImportCollectionType: React.FC = () => {
  const { get } = useFetchClient() as { get: (url: string, options?: any) => Promise<any> };
  const [canImport, setCanImport] = useState(false);
  const { slug } = useSlug();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await get(`/${pluginId}/config`, { headers: getAuthHeader() });
        if (response.data.authorizedImports.includes(slug)) {
          setCanImport(true);
        }
      } catch (error) {
        console.error('Error while fetching plugin config :', error);
      }
    };
    fetchConfig();
  }, [get, slug]);

  return canImport ? <ImportModal onClose={() => {}} /> : null;
};

