import { StyleRequest } from "../core/types";

export async function showDefaultStyleDialog(info: StyleRequest): Promise<Partial<CSSStyleDeclaration> | null> {
    return new Promise((resolve) => {
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.4);
        z-index: 9998;
      `;
  
      const dialog = document.createElement('div');
      dialog.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 20px;
        border-radius: 6px;
        box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        width: 320px;
        font-family: sans-serif;
        z-index: 9999;
      `;
  
      dialog.innerHTML = `
        <h3 style="margin-top:0;">Style ${info.type}</h3>
  
        <label>Background Color:</label>
        <input type="color" id="style-bg" value="${getColorFromStyle(info.target.style.backgroundColor)}" />
  
        <label>Border:</label>
        <input type="text" id="style-border" value="${info.target.style.border || ''}" style="width: 100%;" />
  
        <label>Padding:</label>
        <input type="text" id="style-padding" value="${info.target.style.padding || ''}" style="width: 100%;" />
  
        <label>Font Size:</label>
        <input type="text" id="style-font-size" value="${info.target.style.fontSize || ''}" style="width: 100%;" />
  
        <div style="margin: 6px 0;">
          <label><input type="checkbox" id="style-bold" ${info.target.style.fontWeight === 'bold' ? 'checked' : ''}/> Bold</label>
          <label><input type="checkbox" id="style-italic" ${info.target.style.fontStyle === 'italic' ? 'checked' : ''}/> Italic</label>
        </div>
  
        <div style="text-align: right; margin-top: 16px;">
          <button id="style-cancel">Cancel</button>
          <button id="style-apply">Apply</button>
        </div>
      `;
  
      overlay.appendChild(dialog);
      document.body.appendChild(overlay);
  
      dialog.querySelector('#style-cancel')?.addEventListener('click', () => {
        overlay.remove();
        resolve(null);
      });
  
      dialog.querySelector('#style-apply')?.addEventListener('click', () => {
        const bg = (dialog.querySelector('#style-bg') as HTMLInputElement).value;
        const border = (dialog.querySelector('#style-border') as HTMLInputElement).value;
        const padding = (dialog.querySelector('#style-padding') as HTMLInputElement).value;
        const fontSize = (dialog.querySelector('#style-font-size') as HTMLInputElement).value;
        const isBold = (dialog.querySelector('#style-bold') as HTMLInputElement).checked;
        const isItalic = (dialog.querySelector('#style-italic') as HTMLInputElement).checked;
  
        const style: Partial<CSSStyleDeclaration> = {
          backgroundColor: bg,
          border,
          padding,
          fontSize,
          fontWeight: isBold ? 'bold' : '',
          fontStyle: isItalic ? 'italic' : ''
        };
  
        overlay.remove();
        resolve(style);
      });
    });
  }
  
  function getColorFromStyle(value: string): string {
    if (!value) return '#ffffff';
    const ctx = document.createElement('canvas').getContext('2d');
    if (!ctx) return '#ffffff';
    ctx.fillStyle = value;
    return ctx.fillStyle;
  }
  