import { useIntl } from 'react-intl';

import getTrad from '../utils/getTrad';

export const useI18n = () => {
  const { formatMessage } = useIntl();

  const i18n = (key: string, defaultMessage?: string) =>
    formatMessage({
      id: getTrad(key),
      defaultMessage,
    });

  return { i18n };
};
