import { createTableExtension } from '../extensions/tableExtension';
import { createCustomBlockExtension } from '../extensions/customBlockExtension';
import { QuillExtension } from './types';

export const BUILTIN_EXTENSIONS: Record<string, () => QuillExtension> = {
  customTable: createTableExtension,
  customBlock: createCustomBlockExtension,
};

