import React, {useEffect, useState} from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { ExportModal } from '../ExportModal/ExportModal';
import pluginId from "../../../../server/src/utils/pluginId";
import {useSlug} from "../../hooks/useSlug";
import {ImportModal} from "../ImportModal/ImportModal";

export const InjectedImportCollectionType = () => {
  const { get } = useFetchClient();
  const [canImport, setCanImport] = useState(false);
  const { slug, isSlugWholeDb } = useSlug();
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await get(`/${pluginId}/config`);
        if (response.data.authorizedImports.includes(slug)) {
          setCanImport(true);
        }
      } catch (error) {
        console.error('Error while fetching plugin config :', error);
      }
    };
    fetchConfig();
  }, [slug]);

  return  canImport &&
  (<ImportModal/>)
};
