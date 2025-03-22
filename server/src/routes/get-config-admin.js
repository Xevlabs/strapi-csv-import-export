export default {
  type: 'admin',
  routes: [
    {
      method: 'GET',
      path: '/config',
      handler: 'configAdmin.getConfig',
      config: {
        policies: [],
      },
    },
  ],
};
