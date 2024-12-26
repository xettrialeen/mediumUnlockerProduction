// ==UserScript==
// @name         Medium Preview Pro
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Preview Medium articles with drag + resize + context menu
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      *
// @run-at       document-end
// @author http  xettri aleen
// ==/UserScript==

(function() {
  'use strict';

  GM_addStyle(`
      .medium-preview {
          position: fixed;
          z-index: 999999999;
          display: none;
          width: 90vw;
          max-width: 800px;
          height: 85vh;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12);
          overflow: hidden;
          opacity: 0;
          transform: translate(0, 0);
          transition: transform 0.2s ease;
          font-family: -apple-system, system-ui, sans-serif;
          resize: both;
      }

      .medium-preview.visible {
          opacity: 1;
          transform: scale(1) translateY(0);
      }

      .medium-preview.fullscreen {
          width: 100vw !important;
          height: 100vh !important;
          max-width: none !important;
          top: 0 !important;
          left: 0 !important;
          border-radius: 0;
          resize: none;
      }

      .preview-header {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 56px;
          background: #fff;
          border-bottom: 1px solid rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          cursor: move;
          backdrop-filter: blur(8px);
          z-index: 2;
      }

      .preview-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          max-width: 60%;
      }

      .preview-favicon {
          width: 20px;
          height: 20px;
          border-radius: 4px;
      }

      .preview-title {
          font-size: 14px;
          font-weight: 500;
          color: #1a1a1a;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
      }

      .preview-controls {
          display: flex;
          gap: 8px;
      }

      .preview-button {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          border: none;
          background: transparent;
          color: #666;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          transition: all 0.2s;
      }

      .preview-button:hover {
          background: rgba(0,0,0,0.05);
          color: #000;
      }

      .preview-content {
          width: 100%;
          height: calc(100% - 56px);
          margin-top: 56px;
      }

      .preview-iframe {
          width: 100%;
          height: 100%;
          border: none;
      }

      .medium-toggle {
          position: fixed;
          bottom: 24px;
          right: 24px;
          background: #fff;
          border-radius: 30px;
          padding: 8px 16px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          color: #666;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          border: 1px solid #eee;
          cursor: pointer;
          z-index: 999999;
          transition: all 0.2s;
      }

      .context-menu {
          position: fixed;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          padding: 8px 0;
          min-width: 180px;
          z-index: 9999999999;
      }

      .context-item {
          padding: 8px 16px;
          cursor: pointer;
          font-size: 13px;
          color: #333;
          display: flex;
          align-items: center;
          gap: 8px;
      }

      .context-item:hover {
          background: #f5f5f5;
      }
  `);

  let previews = new Map();
  let contextMenu = null;
  const isEnabled = GM_getValue('previewEnabled', true);

  function createPreview(url, x, y) {
      const preview = document.createElement('div');
      preview.className = 'medium-preview';
      const readmediumUrl = `https://readmedium.com/en/${encodeURIComponent(url)}`;
      const urlObj = new URL(url);
      const title = urlObj.pathname.split('/').pop().replace(/-/g, ' ');
      const favicon = `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=64`;

      preview.innerHTML = `
          <div class="preview-header">
              <div class="preview-meta">
                  <img class="preview-favicon" src="${favicon}">
                  <div class="preview-title">${title}</div>
              </div>
              <div class="preview-controls">
                  <button class="preview-button open-button" title="Open in New Tab">↗</button>
                  <button class="preview-button fullscreen-button" title="Toggle Fullscreen">⤢</button>
                  <button class="preview-button close-button" title="Close">×</button>
              </div>
          </div>
          <div class="preview-content">
              <iframe class="preview-iframe" src="${readmediumUrl}" sandbox="allow-scripts allow-same-origin allow-popups"></iframe>
          </div>
      `;

      preview.style.left = `${x}px`;
      preview.style.top = `${y}px`;
      makeDraggable(preview);
      setupControls(preview, url);

      document.body.appendChild(preview);
      preview.style.display = 'block';
      requestAnimationFrame(() => preview.classList.add('visible'));

      previews.set(url, preview);
      return preview;
  }

function makeDraggable(preview) {
   const header = preview.querySelector('.preview-header');
   let isDragging = false;
   let initialX, initialY;

   header.onmousedown = e => {
       if (preview.classList.contains('fullscreen')) return;
       isDragging = true;
       initialX = e.clientX - preview.offsetLeft;
       initialY = e.clientY - preview.offsetTop;
       preview.style.zIndex = Math.max(...Array.from(previews.values())
           .map(p => parseInt(p.style.zIndex || 999999999))) + 1;

       const moveHandler = e => {
           if (!isDragging) return;
           e.preventDefault();
           preview.style.left = `${e.clientX - initialX}px`;
           preview.style.top = `${e.clientY - initialY}px`;
       };

       const upHandler = () => {
           isDragging = false;
           document.removeEventListener('mousemove', moveHandler);
           document.removeEventListener('mouseup', upHandler);
       };

       document.addEventListener('mousemove', moveHandler);
       document.addEventListener('mouseup', upHandler);
   };
}

  function setupControls(preview, url) {
      preview.querySelector('.close-button').onclick = () => {
          preview.classList.remove('visible');
          setTimeout(() => {
              preview.remove();
              previews.delete(url);
          }, 200);
      };

      preview.querySelector('.fullscreen-button').onclick = () => {
          preview.classList.toggle('fullscreen');
          const btn = preview.querySelector('.fullscreen-button');
          btn.textContent = preview.classList.contains('fullscreen') ? '⟲' : '⤢';
      };

      preview.querySelector('.open-button').onclick = () =>
          window.open(preview.querySelector('iframe').src, '_blank');
  }

  function handleContextMenu(e) {
      const link = e.target.closest('a[href*="medium.com"], [data-href*="medium.com"]');
      if (!link || !isEnabled) return;

      e.preventDefault();
      if (contextMenu) contextMenu.remove();

      const url = link.getAttribute('data-href') || link.href;
      contextMenu = document.createElement('div');
      contextMenu.className = 'context-menu';
      contextMenu.innerHTML = `
          <div class="context-item preview-item">📄 Preview Article</div>
          <div class="context-item open-item">↗️ Open in New Tab</div>
      `;

      contextMenu.style.left = `${e.clientX}px`;
      contextMenu.style.top = `${e.clientY}px`;

      contextMenu.querySelector('.preview-item').onclick = () => {
          createPreview(url, e.clientX, e.clientY);
          contextMenu.remove();
      };

      contextMenu.querySelector('.open-item').onclick = () => {
          window.open(url, '_blank');
          contextMenu.remove();
      };

      document.body.appendChild(contextMenu);
  }

  document.addEventListener('contextmenu', handleContextMenu);
  document.addEventListener('click', e => {
      if (contextMenu && !contextMenu.contains(e.target)) {
          contextMenu.remove();
      }
  });

})();