export const dataFormats = {
  CSV: 'csv',
  JSON: 'json',
  JSON_V2: 'json-v2',
} as const;

export type DataFormat = (typeof dataFormats)[keyof typeof dataFormats];

export const dataFormatConfigs: Record<DataFormat, { fileExt: string; fileContentType: string; language: string }> = {
  [dataFormats.CSV]: {
    fileExt: 'csv',
    fileContentType: 'text/csv',
    language: 'csv',
  },
  [dataFormats.JSON]: {
    fileExt: 'json',
    fileContentType: 'application/json',
    language: 'json',
  },
  [dataFormats.JSON_V2]: {
    fileExt: 'json',
    fileContentType: 'application/json',
    language: 'json',
  },
};
