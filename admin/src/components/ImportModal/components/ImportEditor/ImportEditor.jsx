import { Box, Tabs, Typography, Grid, Field, SingleSelect, SingleSelectOption } from '@strapi/design-system';
import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin'; // Import useFetchClient hook
import { PLUGIN_ID } from '../../../../pluginId'; // Ensure PLUGIN_ID is correctly imported

import { useForm } from '../../../../hooks/useForm';
import { useI18n } from '../../../../hooks/useI18n';
import { Editor } from '../../../Editor/Editor';

export const ImportEditor = ({ file, data, dataFormat, slug, onDataChanged, onOptionsChanged }) => {
  const { i18n } = useI18n();
  const [attributeNames, setAttributeNames] = useState([]);
  const fetchClient = useFetchClient(); // Use the hook here within the component

  const { options } = useForm({ idField: 'id' });

  useEffect(() => {
    const fetchAttributeNames = async () => {
      const { get } = fetchClient;
      try {
        const resData = await get(`/${PLUGIN_ID}/import/model-attributes/${slug}`);
        setAttributeNames(resData?.data?.data?.attribute_names);
      } catch (error) {
        console.error('Error fetching attribute names:', error);
      }
    };
    fetchAttributeNames();
  }, [fetchClient, slug]); // Include dependencies

  useEffect(() => {
    onOptionsChanged(options);
  }, [options]);

  return (
        <Box padding={4}>
          {file?.name && (
            <Box paddingTop={2} paddingBottom={2}>
              <Typography fontWeight="bold" as="span">
                {i18n('plugin.import.file-name')}:
              </Typography>
              <Typography as="span"> {file.name}</Typography>
            </Box>
          )}
          <Box marginTop={2}>
            <Editor content={data} language={dataFormat} onChange={onDataChanged} />
          </Box>
        </Box>
  );
};
