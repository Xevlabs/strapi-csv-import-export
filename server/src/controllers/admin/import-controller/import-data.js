import { CustomSlugs } from '../../../config/constants.js';
import { getAllSlugs } from '../../../utils/models.js';
import { getService } from '../../../utils/utils.js';
import pluginId from "../../../utils/pluginId";

export default ({ strapi }) => importData;

async function importData(ctx) {
  if (!(await hasPermissions(ctx))) {
    return ctx.forbidden();
  }

  const { user } = ctx.state;
  const { data } = ctx.request.body;
  const {slug, data:dataRaw, format, idField} = data
  const fileContent = await getService('import').parseInputData(format, dataRaw, { slug });

  const res = await getService('import').importData(dataRaw, {
      slug,
      format,
      user,
      idField,
    });

  ctx.body = {
    failures: res.failures,
  };
}

async function hasPermissions(ctx) {
  const { data } = ctx.request.body;
  const {slug } = data
  const { userAbility } = ctx.state;
  const config = await strapi.config.get(`plugin::${pluginId}`)

  let slugsToCheck = [];
  if (slug === CustomSlugs.WHOLE_DB) {
    slugsToCheck.push(...getAllSlugs());
  } else {
    slugsToCheck.push(slug);
  }

  return slugsToCheck.every((slug) => hasPermissionForSlug(userAbility, slug, config));
}

function hasPermissionForSlug(userAbility, slug, config) {
  const permissionChecker = strapi.plugin('content-manager').service('permission-checker').create({ userAbility, model: slug });
  return permissionChecker.can.create() && permissionChecker.can.update() && config.authorizedImports.includes(slug);
}
