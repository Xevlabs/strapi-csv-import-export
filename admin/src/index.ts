import { PLUGIN_ID } from './pluginId';
import { Initializer } from './components/Initializer';
import { PluginIcon } from './components/PluginIcon';
import { pluginPermissions } from './permissions';
// @ts-ignore
import { Alerts } from './components/Injected/Alerts/Alerts';
// @ts-ignore
import { InjectedImportCollectionType } from './components/InjectedImportCollectionType/InjectedImportCollectionType';
// @ts-ignore
import { InjectedExportCollectionType } from './components/InjectedExportCollectionType/InjectedExportCollectionType';
import {prefixPluginTranslations} from "./utils/prefixPluginTranslations";

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

  async registerTrads({ locales }: {locales: any}) {
    const importedTrads = await Promise.all(
      locales.map((locale: any) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, PLUGIN_ID),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },};
