import { handleAsyncError } from '../../content-api/utils.js';
import pluginId from "../../../utils/pluginId";

const getConfig = async () => {
  return await strapi.config.get(`plugin::${pluginId}`);
}

export default ({ strapi }) => ({
  getConfig: handleAsyncError(getConfig),
});
