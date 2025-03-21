export interface QuillExtension {
  name: string;
  icon?: string; // HTML or text icon for the toolbar button
  register: (Quill: any) => void;
  handler: (quill: any, range: any) => void;
}

export interface EnhancedQuillOptions {
  Quill: any;
  container: string | HTMLElement;
  options: any; // Same as Quill options
  extensions?: QuillExtension[];
  enableContextStyles?: boolean;
  onStyleRequest?: (info: StyleRequest) => void;
}

export interface StyleRequest {
  tag: string;
  type: string;
  style: string;
  target: HTMLElement;
}

