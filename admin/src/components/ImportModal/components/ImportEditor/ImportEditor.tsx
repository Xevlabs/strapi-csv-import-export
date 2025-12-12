// @ts-nocheck
import { Box, Typography } from '@strapi/design-system';
import React, { useEffect, useState } from 'react';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from '../../../../pluginId';
import { getAuthHeader } from '../../../../utils/auth';
import { useForm } from '../../../../hooks/useForm';
import { useI18n } from '../../../../hooks/useI18n';
import { Editor } from '../../../Editor/Editor';
import { type DataFormat } from '../../../../utils/dataFormats';

type ImportEditorProps = {
  file: File | null;
  data: string;
  dataFormat: DataFormat;
  slug: string;
  onDataChanged: (value: string) => void;
  onOptionsChanged: (value: Record<string, unknown>) => void;
};

export const ImportEditor: React.FC<ImportEditorProps> = ({
  file,
  data,
  dataFormat,
  slug,
  onDataChanged,
  onOptionsChanged,
}) => {
  const { i18n } = useI18n();
  const [attributeNames, setAttributeNames] = useState<string[]>([]);
  const fetchClient = useFetchClient() as { get: (url: string, options?: any) => Promise<any> };

  const { options } = useForm({ idField: 'id' });

  useEffect(() => {
    const fetchAttributeNames = async () => {
      const { get } = fetchClient;
      try {
        const resData = await get(`/${PLUGIN_ID}/import/model-attributes/${slug}`, { headers: getAuthHeader() });
        setAttributeNames(resData?.data?.data?.attribute_names);
      } catch (error) {
        console.error('Error fetching attribute names:', error);
      }
    };
    fetchAttributeNames();
  }, [fetchClient, slug]);

  useEffect(() => {
    onOptionsChanged(options);
  }, [options, onOptionsChanged]);

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

