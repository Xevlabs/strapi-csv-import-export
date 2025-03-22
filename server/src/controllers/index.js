import exportAdminController from './admin/export-controller';
import importAdminController from './admin/import-controller';
import configAdminController from './admin/config-controller';
import exportContentApiController from './content-api/export-controller';
import importContentApiController from './content-api/import-controller';

const controllers = {
  exportAdmin: exportAdminController,
  importAdmin: importAdminController,
  configAdmin: configAdminController,
  export: exportContentApiController,
  import: importContentApiController,
};

export default controllers;

export {
  exportAdminController as exportAdmin,
  importAdminController as importAdmin,
  configAdminController as configAdmin,
  exportContentApiController as export,
  importContentApiController as import,
};