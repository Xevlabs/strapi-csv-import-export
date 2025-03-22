//@ts-nocheck
import { Box } from '@strapi/design-system';
import React, { memo } from 'react';
import { Page } from '@strapi/strapi/admin';
import { pluginPermissions } from '../permissions';
import { Main } from '@strapi/design-system';
import { Header } from '../components/Header.jsx';
import Preferences from '../components/Preferences/Preferences.jsx';
import About from '../components/About/About.jsx';

const HomePage = () => {
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
