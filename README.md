<img width="160" src="https://storage.googleapis.com/xevlabs-website-cms/strapi/Logo_white_f68427f47e/Logo_white_f68427f47e.png"/>

# Import Export with CSV for Strapi 5
Import/Export data from and to your database for Strapi 5 - a fork of [strapi-import-export](https://github.com/Prototypr/strapi-import-export?tab=readme-ov-file), but removed the JSON format, and used new library for CSV processing.

### NPM Install:
`npm i strapi-csv-import-export`

### Guide

This plugin allows you to import / export with csv format on strapi collection.

To do so, you need to add into the `config/plugin.ts`

```typescript
...
"strapi-csv-import-export": {
          config: {
            authorizedExports: ["api::machine.machine"],
            authorizedImports: ["api::machine.machine"]
  }
}
...
```

#### Config
`authorizedExports`: String[] - A list of collection slugs where you allow exports for the app
`authorizedImports`: String[] - A list of collection slugs where you allow imports for the app

> **ℹ️ Info :** By default, no collection is allowed for export / import.
---

### Upgrades from the original repo
There was a few things added from the original repo
- Cleaning some code / removed comments
- Removed JSON V2 / JSON format
- Used [json-2-csv](ttps://github.com/mrodrig/json-2-csv) to parse and generate csv
- Added some config for CSV generation
- Added config to allow only some collections for import / export

---
### TODO

- Pass json-2-csv config as plugin config
- Re-introduce properly deepness
- More testing (media hasn't been tested)
- Add imports with relation lists
- ~~Added french translations~~