// TERRIBLE PSEUDO MODULE IMPORT SYSTEM
// This code is loaded by vanilla browser <script> tag, so
// sriquire(moduleName) is in global scope (e.g. part of
// the window object)
function sriquire(moduleName) {
  if (!window.MODULES[moduleName]) {
    console.error(`${module} is not in our cheap module wrapper`);
    return;
  }
  return window.MODULES[moduleName];
}
// TERRIBLE PSEUDO MODULE DEFINITION
// Wrap our "module" inside an IIFE for scope containment
// such that it returns an object that addresses its internal
// functions. It all works through the magic of javascript
// closures and scope objects.
sriquire.export = (() => {
  // div console
  const HTCONSOLES = {};
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function m_GetDivText(id) {
    const el = document.getElementById(id);
    if (!el) {
      console.log(`GetDivText: element ${id} does not exist`);
      return undefined;
    }
    const text = el.textContent;
    if (text === undefined) {
      console.log(`HTMLTextOut: element ${id} does not have textContent`);
      return {};
    }
    el.style.whiteSpace = 'pre';
    el.style.fontFamily = 'monospace';
    return { element: el, text };
  }
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function m_HTMLTextJumpRow(row, lineBuffer, id) {
    const { element, text } = m_GetDivText(id);
    if (text === undefined) return lineBuffer;
    // convert content to line buffer
    if (lineBuffer.length === 0) {
      console.log(`initializing linebuffer from element id='${id}'`);
      lineBuffer = text.split('\n'); // creates a NEW array
    }
    // handle line underflow in buffer if row exceeds line buffer
    if (row > lineBuffer.length - 1) {
      const count = row + 1 - lineBuffer.length;
      for (let i = count; i > 0; i--) lineBuffer.push('');
    }
    return lineBuffer;
  }
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function m_HTMLTextPrint(str = '', lineBuffer, id) {
    const { element, text } = m_GetDivText(id);
    if (!text) return lineBuffer;
    // append text
    lineBuffer.push(str);
    element.textContent = lineBuffer.join('\n');
    return lineBuffer;
  }
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /** Function to modify the text area of a passed HTML element. Always return
   *  lineBuffer so we can reassign the reference, as the array often changes.
   */
  function m_HTMLTextPlot(str = '', lineBuffer, id, row = 0, col = 0) {
    const { element, text } = m_GetDivText(id);
    if (!element) return lineBuffer;
    if (text === undefined) {
      console.log(`HTMLTextOut: element ${id} does not have textContent`);
      return lineBuffer;
    }
    // ensure row exists
    lineBuffer = m_HTMLTextJumpRow(row, lineBuffer, id);
    // fetch line
    let line = lineBuffer[row];
    if (line === undefined) {
      console.log(`HTMLTextOut: unexpected line error for line ${row}`);
      return lineBuffer;
    }
    // handle column underflow in line if col exceeds line length
    if (col + str.length > line.length + str.length) {
      for (let i = 0; i < col + str.length - line.length; i++) line += ' ';
    }
    // insert str into line
    let p1 = line.substr(0, col);
    let p3 = line.substr(col + str.length, line.length - (col + str.length));
    lineBuffer[row] = `${p1}${str}${p3}`;
    // write buffer back out
    element.textContent = lineBuffer.join('\n');
    return lineBuffer;
  }
  /// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  /** Return function to print a string, given a DIV id and optional row/column.
   */
  function MakeHTMLConsole(divId, row = 0, col = 0) {
    let buffer = [];
    if (typeof divId !== 'string') throw Error('bad id');
    if (!document.getElementById(divId)) {
      console.warn(`id '${divId}' doesn't exist`);
      return {
        print: () => {},
        plot: () => {},
        clear: () => {},
        gotoRow: () => {}
      };
    }
    let hcon;
    if (HTCONSOLES[divId]) {
      hcon = HTCONSOLES[divId];
    } else {
      hcon = {
        buffer: [],
        plot: (str, y = row, x = col) => {
          buffer = m_HTMLTextPlot(str, buffer, divId, y, x);
        },
        print: (str) => {
          buffer = m_HTMLTextPrint(str, buffer, divId);
        },
        clear: (startRow = 0, endRow = buffer.length) => {
          buffer.splice(startRow, endRow);
        },
        gotoRow: (row) => {
          buffer = m_HTMLTextJumpRow(row, buffer, divId);
        }
      };
      HTCONSOLES[divId] = hcon;
    }
    return hcon;
  }
  // module export
  return { MakeHTMLConsole };
})();

// TERRIBLE WINDOWS MODULE EXPORT
// Check that this isn't Node (window is undefined there) and
// set a window global to point to this "module". It is all so
// hacky
if (typeof window !== 'undefined') {
  if (typeof MODULES !== 'object') window.MODULES = {};
  window.MODULES.console = sriquire.export;
}
