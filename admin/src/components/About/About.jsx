import React from 'react';
import { Box, Flex, Typography, Link } from '@strapi/design-system';
import { useIntl } from 'react-intl';

const About = () => {
  const { formatMessage: i18n } = useIntl();

  return (
    <Box style={{ alignSelf: 'stretch' }} background="neutral0" padding={8} marginTop={6} hasRadius={true}>
      <Flex direction="column" alignItems="start" gap={6}>
        <Flex direction="column" alignItems="start" gap={0}>
          <Typography variant="beta">{i18n({ id: 'plugin.page.about.title', defaultMessage: 'About' })}</Typography>
        </Flex>

        <Box>
          <Flex direction="column" alignItems="start" gap={4}>
          <Flex direction="column" alignItems="start" gap={2}>
                <Typography variant="delta">Strapi 5 Version</Typography>
                <Typography>
                    {i18n({
                        id: 'plugin.page.about.strapi5.description',
                        defaultMessage: 'This is a plugin made by Xev. agency.'
                    })}
                </Typography>
                <Flex direction="row" gap={4}>
                    <Link href="https://xev.agency" isExternal>
                        Xev. Website
                    </Link>
                </Flex>
            </Flex>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(About);
