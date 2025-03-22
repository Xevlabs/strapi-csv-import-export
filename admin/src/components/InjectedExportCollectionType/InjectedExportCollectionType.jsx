import React, {useEffect, useState} from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { ExportModal } from '../ExportModal/ExportModal';
import pluginId from "../../../../server/src/utils/pluginId";
import {useSlug} from "../../hooks/useSlug";

export const InjectedExportCollectionType = () => {
  const { get } = useFetchClient();
  const [canExport, setCanExport] = useState(false);
  const { slug } = useSlug();
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await get(`/${pluginId}/config`);
        if (response.data.authorizedExports.includes(slug)) {
          setCanExport(true);
        }
      } catch (error) {
        console.error('Error while fetching plugin config :', error);
      }
    };
    fetchConfig();
  }, [slug]);

  return  canExport &&
  (<ExportModal unavailableOptions={['exportPluginsContentTypes']}/>)
};
