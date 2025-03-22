// src/modules/tableBlots.ts
import Quill from "quill";

const Block = Quill.import("blots/block") as any;
const Container = Quill.import("blots/container") as any;

/**
 * Editable <td> cell blot
 */
export class CustomCellBlot extends Block {
  static readonly blotName = "custom-cell";
  static readonly tagName = "td";

  static create(value: any) {
    const node = super.create(value);
    node.setAttribute("contenteditable", "true");
    node.style.border = "1px solid #ccc";
    node.style.padding = "4px";
    node.style.minWidth = "80px";
    return node;
  }
}

/**
 * <tr> row container blot holding cells
 */
export class CustomRowBlot extends Container {
  static readonly blotName = "custom-row";
  static readonly tagName = "tr";

  static create(value: any) {
    return super.create(value);
  }

  optimize(context: any) {
    super.optimize(context);
    // Ensure all children are cell blots
    this.children.forEach((child: any) => {
      if (!(child instanceof CustomCellBlot)) {
        const td = CustomCellBlot.create(null);
        td.appendChild(child.domNode);
        this.domNode.replaceChild(td, child.domNode);
      }
    });
  }
}

/**
 * <table> root blot holding rows
 */
export class CustomTableBlot extends Container {
  static readonly blotName = "custom-table";
  static readonly tagName = "table";

  static create(value: any) {
    const node = super.create(value);
    node.style.borderCollapse = "collapse";
    node.classList.add("ql-enhancer-table");
    return node;
  }

  optimize(context: any) {
    super.optimize(context);
    // Ensure all children are row blots
    this.children.forEach((child: any) => {
      if (!(child instanceof CustomRowBlot)) {
        const tr = CustomRowBlot.create(null);
        tr.appendChild(child.domNode);
        this.domNode.replaceChild(tr, child.domNode);
      }
    });
  }
}

/**
 * Registers all table-related blots to Quill
 */
export function registerTableBlots(quill: typeof Quill) {
  quill.register(CustomCellBlot);
  quill.register(CustomRowBlot);
  quill.register(CustomTableBlot);
}
