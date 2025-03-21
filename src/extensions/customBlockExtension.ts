import { QuillExtension } from '../core/types';

export function createCustomBlockExtension(): QuillExtension {
  return {
    name: 'customBlock',
    icon: '📦',
    register(Quill) {
      const BlockEmbed = Quill.import('blots/block/embed');

      class CustomBlock extends BlockEmbed {
        static readonly blotName = 'customBlock';
        static readonly tagName = 'div';
        static readonly className = 'custom-block';

        static create(value: any) {
          const node = super.create();
          node.classList.add(this.className);
          node.innerHTML = value || 'Dummy Content';
          return node;
        }
      }

      Quill.register(CustomBlock);
    },
    handler(quill, range) {
      quill.insertEmbed(range.index, 'customBlock', 'Dummy Content');
    }
  };
}

