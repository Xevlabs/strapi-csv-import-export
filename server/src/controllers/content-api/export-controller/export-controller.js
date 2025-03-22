import Joi from 'joi';

import { getService } from '../../../utils/utils.js';
import { checkParams, handleAsyncError } from '../utils.js';

const bodySchema = Joi.object({
  slug: Joi.string().required(),
  exportFormat: Joi.string().valid('csv', 'json', 'json-v2').required(),
  search: Joi.string().default(''),
  applySearch: Joi.boolean().default(false),
  relationsAsId: Joi.boolean().default(false),
  deepness: Joi.number().integer().min(1).max(2).default(2),
  exportPluginsContentTypes: Joi.boolean().default(false),
});

const exportData = async (ctx) => {
  let { slug, search, applySearch, exportFormat, relationsAsId, deepness } = checkParams(bodySchema, ctx.request.body);
  const data = await getService('export').exportData({ slug, search, applySearch, exportFormat, relationsAsId, deepness });
  ctx.body = {
    data,
  };
};

export default ({ strapi }) => ({
  exportData: handleAsyncError(exportData),
});
