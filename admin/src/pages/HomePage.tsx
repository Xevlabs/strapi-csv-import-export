//@ts-nocheck
import { Box, Checkbox, Flex, Link, Option, Select, Typography } from '@strapi/design-system';
import React, { memo, useState } from 'react';
import { Page } from '@strapi/strapi/admin';
import { pluginPermissions } from '../permissions';
import { Main } from '@strapi/design-system';
import { useIntl } from 'react-intl';
import { Header } from '../components/Header.jsx';
import { ImportModal } from '../components/ImportModal/ImportModal.jsx';
import { ExportModal } from '../components/ExportModal/ExportModal.jsx';
import Preferences from '../components/Preferences/Preferences.jsx';
import About from '../components/About/About.jsx';
import { getTranslation } from '../utils/getTranslation';
import { useI18n } from '../hooks/useI18n';
import { dataFormats } from '../utils/dataFormats';

const HomePage = () => {
  const { formatMessage } = useIntl();
  const { i18n } = useI18n();
  return (
    <>
    {/* mango */}
      <Main>
        <Box padding={6} paddingTop={3}>
          <Header />
          <Page.Protect permissions={pluginPermissions.main}>
            <Box padding={6} paddingTop={3} paddingBottom={0}>
              <Preferences />
            </Box>
            <Box padding={6} paddingTop={3} paddingBottom={0}>
              <About />
            </Box>
          </Page.Protect>
        </Box>
      </Main>
    </>
  );
};

export default memo(HomePage);
