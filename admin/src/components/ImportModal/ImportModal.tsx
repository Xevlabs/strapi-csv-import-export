// @ts-nocheck
import { Modal, Button, Typography, Flex, Box, Loader } from '@strapi/design-system';
import { CheckCircle, File as IconFile, Upload } from '@strapi/icons';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useIntl } from 'react-intl';
import styled from 'styled-components';
import { useFetchClient } from '@strapi/admin/strapi-admin';
import { PLUGIN_ID } from '../../pluginId';
import { getAuthHeader } from '../../utils/auth';
import { useAlerts } from '../../hooks/useAlerts';
import { useI18n } from '../../hooks/useI18n';
import { useSlug } from '../../hooks/useSlug';
import { dataFormats, type DataFormat } from '../../utils/dataFormats';
import { handleRequestErr } from '../../utils/error';
import getTrad from '../../utils/getTrad';
import { Editor } from '../Editor';
import { ImportEditor } from './components/ImportEditor/ImportEditor';

const Label = styled.label`
  --hover-color: hsl(210, 100%, 50%);
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  flex: 1;
  height: 260px;
  padding: 48px;
  border-width: 3px;
  border-color: #ddd;
  border-radius: 12px;
  cursor: pointer;
  border-style: dashed;
  text-align: center;
  &:hover {
    border-color: var(--hover-color);
  }

  & > *:not(:first-child) {
    margin-top: 16px;
  }

  input {
    display: none;
  }
`;

const IconWrapper = styled.span`
  height: 100px;
  svg {
    width: 6rem;
    height: 6rem;
    color: #c0c0cf;
  }
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DragOverLabel = styled(Label)`
  &.dragged-over {
    border-color: var(--hover-color);

    &::after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 5;
    }
  }
`;

const ModalState = {
  SUCCESS: 'success',
  PARTIAL: 'partial',
  UNSET: 'unset',
} as const;

type ModalStateKey = (typeof ModalState)[keyof typeof ModalState];

type ImportModalProps = {
  onClose: () => void;
};

export const ImportModal: React.FC<ImportModalProps> = ({ onClose }) => {
  const { i18n } = useI18n();
  const { formatMessage } = useIntl();

  const { slug } = useSlug();
  const { notify } = useAlerts();
  const navigate = useNavigate();

  const [file, setFile] = useState<File | null>(null);
  const [data, setData] = useState('');
  const [options, setOptions] = useState<Record<string, unknown>>({});
  const [dataFormat, setDataFormat] = useState<DataFormat>(dataFormats.CSV);
  const [labelClassNames, setLabelClassNames] = useState('plugin-ie-import_modal_input-label');
  const [uploadSuccessful, setUploadSuccessful] = useState<ModalStateKey>(ModalState.UNSET);
  const [uploadingData, setUploadingData] = useState(false);
  const [importFailuresContent, setImportFailuresContent] = useState('');

  const closeModal = () => {
    if (uploadSuccessful === ModalState.SUCCESS) {
      refreshView();
    }
    onClose();
  };

  const onDataChanged = (value: string) => {
    setData(value);
  };

  const onOptionsChanged = (value: Record<string, unknown>) => {
    setOptions(value);
  };

  const onReadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    readFile(selectedFile);
    setFile(selectedFile);
  };

  const readFile = (selectedFile: File) => {
    if (selectedFile.type === 'text/csv' || /\.csv$/i.test(selectedFile.name)) {
      setDataFormat(dataFormats.CSV);
    } else if (selectedFile.type === 'application/json' || /\.json$/i.test(selectedFile.name)) {
      setDataFormat(dataFormats.JSON);
    } else {
      throw new Error(`File type ${selectedFile.type} not supported.`);
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setData(text);
      }
    };
    reader.readAsText(selectedFile);
  };

  const resetDataSource = () => {
    setData('');
    setDataFormat(dataFormats.CSV);
    setFile(null);
  };

  const fetchClient = useFetchClient() as {
    post: (url: string, body: any, options?: any) => Promise<any>;
  };

  const uploadData = async () => {
    setUploadingData(true);
    try {
      const { post } = fetchClient;
      const res = await post(
        `/${PLUGIN_ID}/import`,
        {
          data: { slug, data, format: dataFormat, ...options },
        },
        { headers: getAuthHeader() },
      );
      const { failures } = res.data;
      if (!failures.length) {
        setUploadSuccessful(ModalState.SUCCESS);
        notify(
          i18n('plugin.message.import.success.imported.title'),
          i18n('plugin.message.import.success.imported.message'),
          'success',
        );
      } else {
        setUploadSuccessful(ModalState.PARTIAL);
        setImportFailuresContent(JSON.stringify(failures, null, '\t'));
        notify(
          i18n('plugin.message.import.error.imported-partial.title'),
          i18n('plugin.message.import.error.imported-partial.message'),
          'danger',
        );
      }
    } catch (err) {
      handleRequestErr(err, {
        403: () =>
          notify(
            i18n('plugin.message.import.error.forbidden.title'),
            i18n('plugin.message.import.error.forbidden.message'),
            'danger',
          ),
        413: () =>
          notify(
            i18n('plugin.message.import.error.payload-too-large.title'),
            i18n('plugin.message.import.error.payload-too-large.message'),
            'danger',
          ),
        default: () =>
          notify(
            i18n('plugin.message.import.error.unexpected.title'),
            i18n('plugin.message.import.error.unexpected.message'),
            'danger',
          ),
      });
    } finally {
      setUploadingData(false);
    }
  };

  const refreshView = () => {
    navigate('/tmp');
    navigate(-1);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setLabelClassNames([labelClassNames, 'plugin-ie-import_modal_input-label--dragged-over'].join(' '));
  };

  const handleDragLeave = () => {
    setLabelClassNames(labelClassNames.replaceAll('plugin-ie-import_modal_input-label--dragged-over', ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleDragLeave();
    const droppedFile = e.dataTransfer.files?.[0];
    if (droppedFile) {
      readFile(droppedFile);
      setFile(droppedFile);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data);
    notify('Copied', '', 'success');
  };

  const showLoader = uploadingData;
  const showFileDragAndDrop = !uploadingData && uploadSuccessful === ModalState.UNSET && !data;
  const showEditor = !uploadingData && uploadSuccessful === ModalState.UNSET && data;
  const showSuccess = !uploadingData && uploadSuccessful === ModalState.SUCCESS;
  const showPartialSuccess = !uploadingData && uploadSuccessful === ModalState.PARTIAL;

  const showImportButton = showEditor;
  const showRemoveFileButton = showEditor;

  return (
    <Modal.Root onOpenChange={(open) => { if (!open) { closeModal(); } }}>
      <Modal.Trigger>
        <Button startIcon={<Upload />}>{formatMessage({ id: getTrad('plugin.cta.import') })}</Button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            <Typography fontWeight="bold" textColor="neutral800" as="h2" style={{ marginBottom: '16px' }}>
              {i18n('plugin.cta.import')}
            </Typography>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showFileDragAndDrop && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <Typography variant="beta" textColor="neutral800">
                  {i18n('plugin.import.data-source-step.title')}
                </Typography>
              </div>
              <Flex gap={4}>
                <DragOverLabel
                  className={`plugin-ie-import_modal_label ${labelClassNames}`}
                  onDragEnter={handleDragEnter}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <IconWrapper>
                    <IconFile />
                  </IconWrapper>
                  <Typography variant="delta" textColor="neutral600">
                    {i18n('plugin.import.drag-drop-file')}
                  </Typography>
                  <input type="file" accept=".csv" hidden onChange={onReadFile} />
                </DragOverLabel>
              </Flex>
            </>
          )}
          {showLoader && (
            <>
              <Flex justifyContent="center">
                <Loader>{i18n('plugin.import.importing-data')}</Loader>
              </Flex>
            </>
          )}
          {showEditor && (
            <ImportEditor
              file={file}
              data={data}
              dataFormat={dataFormat}
              slug={slug}
              onDataChanged={onDataChanged}
              onOptionsChanged={onOptionsChanged}
            />
          )}
          {showSuccess && (
            <Flex direction="column" alignItems="center" gap={4}>
              <Box paddingBottom={4}>
                <CheckCircle width="6rem" height="6rem" color="success500" />
              </Box>
              <Typography variant="beta" textColor="neutral800">
                {i18n('plugin.message.import.success.imported-successfully')}
              </Typography>
              <Box paddingTop={4}>
                <Button onClick={closeModal} variant="tertiary">
                  {i18n('plugin.cta.close')}
                </Button>
              </Box>
            </Flex>
          )}
          {showPartialSuccess && (
            <>
              <Typography textColor="neutral800" fontWeight="bold" as="h2">
                {i18n('plugin.import.partially-failed')}
              </Typography>
              <Typography textColor="neutral800" as="p">
                {i18n('plugin.import.detailed-information')}
              </Typography>
              <Editor content={importFailuresContent} language={'json'} readOnly />
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {showRemoveFileButton && (
            <Button onClick={resetDataSource} variant="tertiary">
              {i18n('plugin.cta.back-to-data-sources')}
            </Button>
          )}
          {showImportButton && <Button onClick={uploadData}>{i18n('plugin.cta.import')}</Button>}
          {showPartialSuccess && (
            <Button variant="secondary" onClick={copyToClipboard}>
              {i18n('plugin.cta.copy-to-clipboard')}
            </Button>
          )}
        </Modal.Footer>
      </Modal.Content>
    </Modal.Root>
  );
};

