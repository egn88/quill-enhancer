export function findAncestor(el: HTMLElement, tag: string): HTMLElement | null {
    let current: HTMLElement | null = el;
    while (current) {
      if (current.tagName.toLowerCase() === tag.toLowerCase()) {
        return current;
      }
      current = current.parentElement;
    }
    return null;
  }
  
  export function getColumnIndex(cell: HTMLElement): number {
    const row = cell.closest('tr');
    if (!row) return -1;
    return Array.from(row.children).indexOf(cell);
  }
  
  export function getCellsInColumn(table: HTMLTableElement, colIndex: number): HTMLElement[] {
    return Array.from(table.rows).map(row => row.cells[colIndex]).filter(Boolean) as HTMLElement[];
  }
  
  export function deleteRow(cell: HTMLElement) {
    const row = cell.closest('tr');
    if (row) {
      row.parentNode?.removeChild(row);
    }
  }
  
  export function deleteColumn(cell: HTMLElement) {
    const colIndex = getColumnIndex(cell);
    const table = cell.closest('table');
    if (!table || colIndex === -1) return;
  
    Array.from(table.rows).forEach(row => {
      const cell = row.cells[colIndex];
      if (cell) row.removeChild(cell);
    });
  }
  
  export function setHeaderRow(cell: HTMLElement) {
    const row = cell.closest('tr');
    const table = cell.closest('table');
    if (!row || !table) return;
  
    const thead = document.createElement('thead');
    thead.appendChild(row.cloneNode(true));
  
    const tbody = table.querySelector('tbody');
    if (tbody && tbody.contains(row)) {
      tbody.removeChild(row);
    }
  
    table.insertBefore(thead, table.firstChild);
  }
  
  export function createStyledCell(): HTMLTableCellElement {
    const td = document.createElement('td');
    td.setAttribute('contenteditable', 'true');
    td.innerHTML = '';
    td.style.minWidth = '80px';
    td.style.minHeight = '20px';
    td.style.padding = '4px';
    td.style.border = '1px solid #ccc';
    td.style.verticalAlign = 'top';
    return td;
  }
  