import { QuillExtension } from "../core/types";
import { createStyledCell } from "../style/domUtils";

export function createTableExtension(): QuillExtension {
  return {
    name: "customTable",
    icon: "📊",
    register(Quill) {
      const BlockEmbed = Quill.import("blots/block/embed");

      class CustomTable extends BlockEmbed {
        static readonly blotName = "customTable";
        static readonly tagName = "div";
        static readonly className = "custom-table";

        static create() {
          const node = super.create();
          node.classList.add(this.className);

          const table = document.createElement("table");
          table.style.borderCollapse = "collapse";

          const tbody = document.createElement("tbody");

          for (let i = 0; i < 2; i++) {
            const tr = document.createElement("tr");
            for (let j = 0; j < 2; j++) {
              const td = createStyledCell();
              const cellDiv = document.createElement("div");
              cellDiv.innerHTML = `Cell ${i + 1}-${j + 1}`;
              td.appendChild(cellDiv);
              tr.appendChild(td);
            }
            tbody.appendChild(tr);
          }

          table.appendChild(tbody);
          node.appendChild(table);
          return node;
        }
      }

      Quill.register(CustomTable);
    },

  // 🔧 Also register a dummy format so the toolbar button shows
    handler(quill, range) {
      quill.insertEmbed(range.index, "customTable", {});
    },
  };
}
