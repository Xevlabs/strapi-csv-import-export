import { getModelAttributes } from '../../utils/models.js';
import { csv2json } from 'json-2-csv';


const inputFormatToParser = {
  csv: parseCsv,
};

const InputFormats = Object.keys(inputFormatToParser);

/**
 * Parse input data.
 */
async function parseInputData(format, dataRaw, { slug }) {
  const parser = inputFormatToParser[format];
  if (!parser) {
    throw new Error(`Data input format ${format} is not supported.`);
  }

  const data = await parser(dataRaw, { slug });
  return data;
}

async function parseCsv(dataRaw, { slug }) {
  const data = csv2json(dataRaw);
  return data;
}

export { InputFormats, parseInputData };
