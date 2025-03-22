import { getTranslation } from './utils/getTranslation';
import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import {pluginPermissions} from './permissions';
// @ts-ignore
import { Alerts } from './components/Injected/Alerts/Alerts';
// @ts-ignore
import { InjectedImportCollectionType } from './components/InjectedImportCollectionType/InjectedImportCollectionType';
// @ts-ignore
import { InjectedExportCollectionType } from './components/InjectedExportCollectionType/InjectedExportCollectionType';
import translations from "./translations";

export default {
  register(app: any) {
    app.addMenuLink({
      to: `plugins/${PLUGIN_ID}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${PLUGIN_ID}.plugin.name`,
        defaultMessage:'Import Export',
      },
      permissions: pluginPermissions.main,
      Component: async () => {
        const { App } = await import('./pages/App');

        return App;
      },
    });

    app.registerPlugin({
      id: PLUGIN_ID,
      initializer: Initializer,
      isReady: false,
      name: PLUGIN_ID,
    });
  },

  bootstrap(app:any) {
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: `${PLUGIN_ID}-alerts`,
      Component: Alerts,
    });
    app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: `${PLUGIN_ID}-import`,
      Component: InjectedImportCollectionType,
    });
      app.getPlugin('content-manager').injectComponent('listView', 'actions', {
      name: `${PLUGIN_ID}-export`,
      Component: InjectedExportCollectionType,
    });
  },

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTranslations = [
      {
        data: translations.en,
        locale: 'en'
      },
      {
        data: translations.fr,
        locale: 'fr'
      }
    ];

    return importedTranslations;
  },
};
