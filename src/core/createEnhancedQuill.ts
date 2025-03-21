import type { EnhancedQuillOptions, QuillExtension } from './types';
import { BUILTIN_EXTENSIONS } from './extensionRegistry';
import { setupContextMenu } from '../style/contextMenu';

export function createEnhancedQuill(config: EnhancedQuillOptions): any {
  const { Quill, container, options, extensions = [], enableContextStyles, onStyleRequest } = config;

  const extensionMap = new Map<string, QuillExtension>();

  // Flatten toolbar items to look for extension keys
  const toolbarConfig = options.modules?.toolbar?.container || options.modules?.toolbar || [];
  const toolbarItems = toolbarConfig.flat();

  // Auto-register built-in extensions based on toolbar config
  for (const item of toolbarItems) {
    if (typeof item === 'string' && BUILTIN_EXTENSIONS[item]) {
      extensionMap.set(item, BUILTIN_EXTENSIONS[item]());
    }
  }

  // Add explicit extensions (can override built-ins)
  for (const ext of extensions) {
    extensionMap.set(ext.name, ext);
  }

  // Register all extensions
  extensionMap.forEach(ext => {
    ext.register(Quill);
  });

  // Rebuild full toolbar config with our extensions included
  const fullOptions = {
    ...options,
    modules: {
      ...options.modules,
      toolbar: {
        container: toolbarItems,
      }
    }
  };

  const quill = new Quill(container, fullOptions);

  const toolbar = quill.getModule('toolbar');
  extensionMap.forEach(ext => {
    // Add button handlers
    toolbar.addHandler(ext.name, () => {
      const range = quill.getSelection();
      if (range) ext.handler(quill, range);
    });

    // Inject custom icon
    const button = document.querySelector(`.ql-${ext.name}`);
    if (button && ext.icon) {
      button.innerHTML = ext.icon;
    }
  });

  // Setup context menu support
  if (enableContextStyles) {
    setupContextMenu(quill, onStyleRequest);
  }

  return quill;
}
