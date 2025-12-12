import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { ExportModal } from '../ExportModal/ExportModal';
import pluginId from '../../../../server/src/utils/pluginId';
import { useSlug } from '../../hooks/useSlug';
import { getAuthHeader } from '../../utils/auth';

export const InjectedExportCollectionType: React.FC = () => {
  const { get } = useFetchClient() as { get: (url: string, options?: any) => Promise<any> };
  const [canExport, setCanExport] = useState(false);
  const { slug } = useSlug();

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await get(`/${pluginId}/config`, { headers: getAuthHeader() });
        if (response.data.authorizedExports.includes(slug)) {
          setCanExport(true);
        }
      } catch (error) {
        console.error('Error while fetching plugin config :', error);
      }
    };
    fetchConfig();
  }, [get, slug]);

  return canExport ? (
    <ExportModal onClose={() => {}} unavailableOptions={['exportPluginsContentTypes']} />
  ) : null;
};

