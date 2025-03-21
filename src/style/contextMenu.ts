import { StyleRequest } from "../core/types";
import { showDefaultStyleDialog } from "./styleDialog"; // replaces old defaultStyleDialog

import {
  createStyledCell,
  getColumnIndex,
  getCellsInColumn,
  deleteColumn,
  deleteRow,
  setHeaderRow,
} from "./domUtils";

export function setupContextMenu(
  quill: any,
  onStyleRequest?: (info: StyleRequest) => void
) {
  quill.root.addEventListener("contextmenu", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target || !quill.root.contains(target)) return;

    const blot = quill.constructor.find(target, true);
    const type = blot?.statics?.blotName || target.tagName.toLowerCase();

    if (!["customTable", "customBlock", "td", "tr", "table"].includes(type))
      return;

    event.preventDefault();

    const menu = document.createElement("div");
    menu.className = "ql-enhancer-context-menu";
    menu.style.cssText = `
      position: absolute;
      left: ${event.pageX}px;
      top: ${event.pageY}px;
      background: #fff;
      border: 1px solid #ccc;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      z-index: 9999;
    `;

    const addItem = (label: string, action: () => void) => {
      const item = document.createElement("div");
      item.innerText = label;
      item.style.cssText = `
        padding: 4px 8px;
        cursor: pointer;
      `;
      item.addEventListener("click", () => {
        menu.remove();
        action();
      });
      menu.appendChild(item);
    };

    const cleanup = () => menu.remove();
    setTimeout(() => document.addEventListener("click", cleanup), 0);

    const showStyleDialog = (el: HTMLElement, type: string) => {
      const info: StyleRequest = {
        tag: el.tagName.toLowerCase(),
        type,
        style: el.getAttribute("style") ?? "",
        target: el,
      };
      if (onStyleRequest) onStyleRequest(info);
      else showDefaultStyleDialog(info);
    };

    const td = target.closest("td") as HTMLTableCellElement;
    const tr = target.closest("tr") as HTMLTableRowElement;
    const table = target.closest("table") as HTMLTableElement;

    if (td) {
      const colIndex = getColumnIndex(td);
      const cells = getCellsInColumn(table, colIndex);

      addItem("Cell Style", async () => {
        const refStyle = td.getAttribute("style") ?? "";
      
        const style = await showDefaultStyleDialog({
          tag: td.tagName.toLowerCase(),
          type: "cell",
          style: refStyle,
          target: td,
        });
      
        if (style) {
          Object.entries(style).forEach(([key, value]) => {
            // @ts-ignore
            td.style[key] = value ?? "";
          });
        }
      });

      addItem("Column Style", async () => {
        const firstCell = cells[0];
        const refStyle = firstCell.getAttribute("style") ?? "";

        const style = await showDefaultStyleDialog({
          tag: firstCell.tagName.toLowerCase(),
          type: "column",
          style: refStyle,
          target: firstCell,
        });

        if (style) {
          cells.forEach((cell) => {
            Object.entries(style).forEach(([key, value]) => {
              // @ts-ignore
              cell.style[key] = value ?? "";
            });
          });
        }
      });

      addItem("Delete Column", () => deleteColumn(td));

      addItem("Add Column Left", () => {
        const colIndex = getColumnIndex(td);
        Array.from(table.rows).forEach((row) => {
          const newCell = createStyledCell();
          row.insertBefore(newCell, row.cells[colIndex]);
        });
      });

      addItem("Add Column Right", () => {
        const colIndex = getColumnIndex(td);
        Array.from(table.rows).forEach((row) => {
          const newCell = createStyledCell();
          row.insertBefore(newCell, row.cells[colIndex + 1] || null);
        });
      });
    }

    if (tr) {
      addItem("Row Style", async () => {
        const tds = tr.querySelectorAll("td");
        if (tds.length === 0) return;
      
        const ref = tds[0];
        const refStyle = ref.getAttribute("style") ?? "";
      
        const style = await showDefaultStyleDialog({
          tag: ref.tagName.toLowerCase(),
          type: "row",
          style: refStyle,
          target: ref,
        });
      
        if (style) {
          tds.forEach((cell) => {
            Object.entries(style).forEach(([key, value]) => {
              // @ts-ignore
              cell.style[key] = value ?? "";
            });
          });
        }
      });
      

      addItem("Add Row Above", () => {
        const clone = tr.cloneNode(true) as HTMLTableRowElement;
        clone.querySelectorAll("td").forEach((td) => (td.innerHTML = ""));
        tr.parentNode?.insertBefore(clone, tr);
      });

      addItem("Add Row Below", () => {
        const clone = tr.cloneNode(true) as HTMLTableRowElement;
        clone.querySelectorAll("td").forEach((td) => (td.innerHTML = ""));
        tr.parentNode?.insertBefore(clone, tr.nextSibling);
      });

      addItem("Delete Row", () => deleteRow(tr));

      addItem("Set as Header Row", () => setHeaderRow(tr));
    }

    document.body.appendChild(menu);
  });
}
