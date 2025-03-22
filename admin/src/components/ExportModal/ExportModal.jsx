import { Modal, Button, Typography, Flex, Grid, Loader, SingleSelect, SingleSelectOption, Checkbox } from '@strapi/design-system';
import { Download } from '@strapi/icons'; // Add this import for the Download icon
import pick from 'lodash/pick';
import qs from 'qs';
import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from '../../pluginId';
import { useAlerts } from '../../hooks/useAlerts';
import { useDownloadFile } from '../../hooks/useDownloadFile';
import { useI18n } from '../../hooks/useI18n';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useSlug } from '../../hooks/useSlug';
import { dataFormatConfigs, dataFormats } from '../../utils/dataFormats';
import { handleRequestErr } from '../../utils/error';
import { Editor } from '../Editor';

const DEFAULT_OPTIONS = {
  exportFormat: dataFormats.CSV,
  applyFilters: false,
  relationsAsId: false,
  deepness: 2,
  exportPluginsContentTypes: false,
};

export const ExportModal = ({ unavailableOptions = [], onClose }) => {
  const { i18n } = useI18n();
  const { search } = useLocation();
  const { downloadFile, withTimestamp } = useDownloadFile();
  const { slug, isSlugWholeDb } = useSlug();
  const { notify } = useAlerts();
  const { getPreferences } = useLocalStorage();
  const { post } = useFetchClient();

  const [options, setOptions] = useState(() => ({ ...DEFAULT_OPTIONS, ...getPreferences() }));
  const [data, setData] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleSetOption = (optionName) => (value) => {
    setOptions((previous) => ({ ...previous, [optionName]: value }));
  };

  const shouldShowOption = (optionName) => unavailableOptions.indexOf(optionName) === -1;

  const getData = async () => {
    setFetchingData(true);
    try {
      const res = await post(`/${PLUGIN_ID}/export/contentTypes`, {
        data:{
          slug,
          search: qs.stringify(pick(qs.parse(search), ['filters', 'sort'])),
          applySearch: options.applyFilters,
          exportFormat: options.exportFormat,
          relationsAsId: options.relationsAsId,
          deepness: 2,
          exportPluginsContentTypes: options.exportPluginsContentTypes,
        }
      });
      setData(res.data);
    } catch (err) {
      console.error('err', err);
      handleRequestErr(err, {
        403: () => notify(i18n('plugin.message.export.error.forbidden.title'), i18n('plugin.message.export.error.forbidden.message'), 'danger'),
        default: () => notify(i18n('plugin.message.export.error.unexpected.title'), i18n('plugin.message.export.error.unexpected.message'), 'danger'),
      });
    } finally {
      setFetchingData(false);
    }
  };

  const writeDataToFile = async () => {
    const config = dataFormatConfigs[options.exportFormat];
    if (!config) {
      throw new Error(`File extension ${options.exportFormat} not supported to export data.`);
    }

    let dataToCopy = data;
    if(typeof data === 'object'){
      dataToCopy =data?.data
    }

    const { fileExt, fileContentType } = config;
    const fileName = `export_${slug}.${fileExt}`.replaceAll(':', '-').replaceAll('--', '-');
    downloadFile(dataToCopy, withTimestamp(fileName), `${fileContentType};charset=utf-8;`);
  };

  const copyToClipboard = () => {
    let dataToCopy = data;
    if(typeof data === 'object'){
      dataToCopy =data?.data
    }
    navigator.clipboard.writeText(dataToCopy);
    notify(i18n('plugin.export.copied'), '', 'success');
  };

  const clearData = () => {
    setData(null);
  };

  const resetOptions = () => {
    const storedPreferences = getPreferences();
    setOptions({ ...DEFAULT_OPTIONS, ...storedPreferences });
    setData(null);
    setFetchingData(false);
  };

  const handleOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      resetOptions();
    }
  };

  return (
    <Modal.Root onClose={onClose} onOpenChange={handleOpenChange}>
      <Modal.Trigger>
        <Button startIcon={<Download />}>{i18n('plugin.cta.export', 'Export')}</Button>
      </Modal.Trigger>
      {isOpen && (
        <Modal.Content>
          <Modal.Header>
            <Modal.Title>
              <Flex gap={2}>
                <Typography fontWeight="bold" textColor="neutral800" as="h2" id="title">
                  {i18n('plugin.cta.export', 'Export')}
                </Typography>
                <Typography textColor="neutral800" id="title">
                  {isSlugWholeDb ? i18n('plugin.export.whole-database', 'Whole database') : slug}
                </Typography>
              </Flex>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {fetchingData && (
              <Flex justifyContent="center">
                <Loader>{i18n('plugin.export.fetching-data')}</Loader>
              </Flex>
            )}
            {!data && !fetchingData && (
              <>
                <Flex direction="column" alignItems="start" gap="16px" marginTop={6}>
                  <Typography fontWeight="bold" textColor="neutral800" as="h2">
                    {i18n('plugin.export.options')}
                  </Typography>
                  {shouldShowOption('relationsAsId') && (
                    <Checkbox checked={options.relationsAsId} onCheckedChange={(value) => handleSetOption('relationsAsId')(value)}>
                      {i18n('plugin.export.relations-as-id')}
                    </Checkbox>
                  )}
                  {shouldShowOption('applyFilters') && (
                    <Checkbox checked={options.applyFilters} onCheckedChange={(value) => handleSetOption('applyFilters')(value)}>
                      {i18n('plugin.export.apply-filters-and-sort')}
                    </Checkbox>
                  )}
                  {shouldShowOption('exportPluginsContentTypes') && (
                    <Checkbox checked={options.exportPluginsContentTypes} onCheckedChange={(value) => handleSetOption('exportPluginsContentTypes')(value)}>
                      {i18n('plugin.export.plugins-content-types')}
                    </Checkbox>
                  )}
                </Flex>
              </>
            )}
            {data && !fetchingData && (
              <Editor content={data} language={dataFormatConfigs[options.exportFormat].language} />
            )}
          </Modal.Body>
          <Modal.Footer>
            {!!data && (
              <Button variant="tertiary" onClick={clearData}>
                {i18n('plugin.cta.back-to-options')}
              </Button>
            )}
            {!data && <Button onClick={getData}>{i18n('plugin.cta.get-data')}</Button>}
            {!!data && (
              <>
                <Button variant="secondary" onClick={copyToClipboard}>
                  {i18n('plugin.cta.copy-to-clipboard')}
                </Button>
                <Button onClick={writeDataToFile}>{i18n('plugin.cta.download-file')}</Button>
              </>
            )}
          </Modal.Footer>
        </Modal.Content>
      )}
    </Modal.Root>
  );
};
