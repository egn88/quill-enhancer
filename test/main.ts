import Quill from 'quill';
import { createEnhancedQuill } from '../src/core/createEnhancedQuill';

createEnhancedQuill({
  Quill,
  container: '#editor',
  options: {
    theme: 'snow',
    modules: {
      toolbar: [
        ['bold', 'italic'],
        ['customTable', 'editTableStyle']
      ]
    }
  },
  enableContextStyles: true
});
