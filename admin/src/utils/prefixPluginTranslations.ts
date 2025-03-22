const prefixPluginTranslations = (trad: any, pluginId: any) => {
	if (!pluginId) {
		throw new TypeError("pluginId can't be empty");
	}

	return Object.keys(trad).reduce((acc: any, current) => {
		acc[`${pluginId}.${current}`]  = trad[current];
		return acc;
	}, {});
};

export { prefixPluginTranslations };
