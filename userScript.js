// ==UserScript==
// @name         MediumUnlockMethod2
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Unlock Medium articles
// @author       Xettri Alen
// @match        https://javascript.plainenglish.io/*
// @match        https://medium.com/*
// @match        https://medium.com/
// @match        https://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=medium.com
// @run-at       document-start
// @grant        none
// @license      WTFPL
// ==/UserScript==

(function () {
  class MediumArticleUnlocker {
    constructor() {
      this.initialize();
    }

    async initialize() {
      if (window.location.pathname === "/") return;

      const scriptElements = document.querySelectorAll('script[src*="medium"]');
      if (scriptElements.length === 0) return;

      const meteredContentElement = document.querySelector(".meteredContent");
      if (!meteredContentElement) return;

      try {
        const googleWebCacheUrl = `https://webcache.googleusercontent.com/search?q=cache:${encodeURIComponent(
          window.location.href
        )}&sca_esv=565636678&strip=0&vwsrc=1`;

        const response = await fetch(googleWebCacheUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.0.0 Safari/537.36",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Google Web Cache (${response.status}): ${response.statusText}`
          );
        }

        // adding divs

        const htmlContent = await response.text();
        const tempElement = document.createElement("div");
        tempElement.innerHTML = htmlContent;
        const preElements = tempElement.querySelector("pre");

        const root = document.querySelector("#root");
        const hostElement = document.createElement("div");
        hostElement.className = "profile-medium";
        hostElement.innerHTML = `<div class="profile-container"><img src="https://raw.githubusercontent.com/xettrialeen/mediumUnlockerProduction/main/aleen.jpeg" alt=""><div class="profile-title"><div class="profile-title-header">Xettri Aleen</div><div class="profile-title-body"><div class="profile-title-body-icon"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="12" fill="none" viewBox="0 0 16 12"><path fill="#F0F0F0" d="M0 .704h16v10.592H0V.704Z"/><path fill="#0052B4" d="M0 11.296V.704l8.763 5.423H2.738l5.737 5.17H0Z"/><path fill="#D80027" d="M7.649 5.81.319 1.274v9.706h7.33L1.912 5.81H7.65Z"/><path fill="#F0F0F0" d="m3.063 8.124-.456-.213.242-.439-.495.094-.062-.496-.345.365-.345-.365-.063.496-.495-.094.243.439-.456.213.456.213-.243.438.495-.094.063.497.345-.366.345.366.062-.497.495.094-.242-.438.456-.213Zm-.305-4.12-.331-.156.176-.318-.36.068-.045-.361-.251.265-.251-.265-.046.361-.36-.068.177.318-.332.155.812.162.811-.162Z"/><path fill="#F0F0F0" d="M2.92 4.003a.97.97 0 0 1-.973.968.97.97 0 0 1-.974-.968"/></svg></div><div class="profile-title-body-content">Dharan,Nepal</div></div></div></div><div class="profile-description">Banging Heads with Sveltekit,Pocketbase, Spline,Figma,Tauri and reverse engineering.</div><div class="profile-skill"><div class="profile-skill-header">Skill</div><div class="profile-skill-badges"><div class="profile-skill-badge">FullStack Developer</div><div class="profile-skill-badge">UI Designer</div><div class="profile-skill-badge">Pentester</div></div></div><div class="profile-contact"><div class="profile-contact-header">Contact Detail</div><div class="profile-contact-social-icon"><div class="social-profile"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 14 14"><path stroke="#475467" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.167" d="M8.196 3.5A2.917 2.917 0 0 1 10.5 5.804M8.196 1.167a5.25 5.25 0 0 1 4.637 4.631M5.965 8.087a8.518 8.518 0 0 1-1.66-2.34 1.013 1.013 0 0 1-.066-.154.61.61 0 0 1 .086-.503c.028-.04.061-.073.128-.14.204-.203.306-.305.373-.408a1.167 1.167 0 0 0 0-1.272c-.067-.102-.17-.204-.373-.408l-.114-.114c-.31-.31-.465-.465-.631-.549a1.167 1.167 0 0 0-1.053 0c-.167.084-.322.24-.632.55l-.092.091c-.309.31-.463.464-.581.674a1.97 1.97 0 0 0-.224.862c0 .24.047.406.14.735a11.11 11.11 0 0 0 2.843 4.832 11.105 11.105 0 0 0 4.833 2.843c.329.093.493.14.734.14.268.002.63-.093.863-.223.21-.118.364-.273.673-.582l.092-.092c.31-.31.465-.465.55-.631a1.166 1.166 0 0 0 0-1.053c-.085-.167-.24-.322-.55-.632l-.114-.114c-.204-.204-.306-.306-.408-.372a1.167 1.167 0 0 0-1.272 0c-.103.066-.205.168-.408.372a1.1 1.1 0 0 1-.14.128.61.61 0 0 1-.502.086.846.846 0 0 1-.155-.066 8.518 8.518 0 0 1-2.34-1.66Z"/></svg><div class="social-profile-info">+9779807038534</div></div><div class="social-profile"><svg xmlns="http://www.w3.org/2000/svg" width="14" height="12" fill="none" viewBox="0 0 14 12"><path stroke="#475467" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.167" d="M12.542 9.5 8.667 6M5.333 6 1.458 9.5m-.291-6.417 4.762 3.334c.386.27.579.405.789.458.185.046.379.046.564 0 .21-.053.403-.188.788-.458l4.763-3.334m-8.866 7.584h6.066c.98 0 1.47 0 1.845-.191a1.75 1.75 0 0 0 .765-.765c.19-.374.19-.864.19-1.844V4.133c0-.98 0-1.47-.19-1.844a1.75 1.75 0 0 0-.765-.765c-.375-.19-.865-.19-1.845-.19H3.967c-.98 0-1.47 0-1.845.19a1.75 1.75 0 0 0-.765.765c-.19.374-.19.864-.19 1.844v3.734c0 .98 0 1.47.19 1.844.168.33.436.597.765.765.374.19.865.19 1.845.19Z"/></svg><div class="social-profile-info">aleenbhandari2@gmail.com</div></div><div class="social-links-profile"><a target="_blank" href="https://twitter.com/xettri_aleen"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="none" viewBox="0 0 20 18"><path fill="#344054" d="M6.292 17.125c7.545 0 11.673-6.253 11.673-11.673 0-.176-.004-.356-.012-.532A8.332 8.332 0 0 0 20 2.796a8.09 8.09 0 0 1-2.355.645 4.125 4.125 0 0 0 1.804-2.27 8.247 8.247 0 0 1-2.605.996A4.108 4.108 0 0 0 9.85 5.91a11.654 11.654 0 0 1-8.456-4.284A4.108 4.108 0 0 0 2.664 7.1a4.108 4.108 0 0 1-1.86-.512v.051a4.102 4.102 0 0 0 3.293 4.023 4.078 4.078 0 0 1-1.851.07 4.112 4.112 0 0 0 3.831 2.852A8.229 8.229 0 0 1 0 15.282a11.64 11.64 0 0 0 6.292 1.843Z"/></svg></a><a target="_blank" href="https://www.facebook.com/xettrialeen/"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#344054" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.093 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.563V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10Z"/></svg></a><a target="_blank" href="https://github.com/xettrialeen"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#344054" fill-rule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 10 4.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 20 10.017C20 4.484 15.522 0 10 0Z" clip-rule="evenodd"/></svg></a><a target="_blank" href="https://www.instagram.com/aleenxettri/"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20"><path fill="#344054" d="M10 1.8c2.672 0 2.988.012 4.04.06.976.042 1.503.206 1.855.343.464.18.8.399 1.148.746.352.352.566.684.746 1.149.137.351.3.882.344 1.855.047 1.055.058 1.371.058 4.04 0 2.671-.011 2.987-.058 4.038-.043.977-.207 1.504-.344 1.856-.18.465-.398.8-.746 1.148a3.077 3.077 0 0 1-1.148.746c-.352.137-.883.301-1.856.344-1.055.047-1.371.059-4.039.059-2.672 0-2.988-.012-4.04-.059-.976-.043-1.503-.207-1.855-.344a3.1 3.1 0 0 1-1.148-.746 3.076 3.076 0 0 1-.746-1.148c-.137-.352-.3-.883-.344-1.856-.047-1.054-.058-1.37-.058-4.039 0-2.672.011-2.988.058-4.039.043-.976.207-1.504.344-1.855.18-.465.398-.801.746-1.149a3.076 3.076 0 0 1 1.148-.746c.352-.137.883-.3 1.856-.344 1.05-.046 1.367-.058 4.039-.058ZM10 0C7.285 0 6.945.012 5.879.059 4.816.105 4.086.277 3.453.523A4.88 4.88 0 0 0 1.68 1.68 4.9 4.9 0 0 0 .523 3.45C.277 4.085.105 4.811.06 5.874.012 6.945 0 7.285 0 10s.012 3.055.059 4.121c.046 1.063.218 1.793.464 2.426.258.66.598 1.219 1.157 1.773a4.888 4.888 0 0 0 1.77 1.153c.636.246 1.362.418 2.425.465 1.066.046 1.406.058 4.121.058 2.715 0 3.055-.012 4.121-.058 1.063-.047 1.793-.22 2.426-.465a4.888 4.888 0 0 0 1.77-1.153 4.888 4.888 0 0 0 1.152-1.77c.246-.636.418-1.363.465-2.425.047-1.066.058-1.406.058-4.121 0-2.715-.011-3.055-.058-4.121-.047-1.063-.22-1.793-.465-2.426A4.683 4.683 0 0 0 18.32 1.68 4.889 4.889 0 0 0 16.55.527C15.915.281 15.188.11 14.126.062 13.055.012 12.715 0 10 0Z"/><path fill="#344054" d="M10 4.863A5.138 5.138 0 0 0 4.863 10a5.138 5.138 0 0 0 10.273 0c0-2.836-2.3-5.137-5.136-5.137Zm0 8.469a3.333 3.333 0 1 1 .001-6.665A3.333 3.333 0 0 1 10 13.332Zm6.54-8.672a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"/></svg></a></div><a class="mail-btn" href="mailto:aleenbhandari2@gmail.com"><div class="mail-text">Hire Me for Your Project</div><svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 15 15"><path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.333" d="m8.663 1.756 5.018 3.262c.178.115.266.173.33.25.058.068.1.146.126.231.03.096.03.202.03.413V10.8c0 1.12 0 1.68-.218 2.108a2 2 0 0 1-.874.874c-.428.218-.988.218-2.108.218H4.033c-1.12 0-1.68 0-2.108-.218a2 2 0 0 1-.874-.874C.833 12.48.833 11.92.833 10.8V5.912c0-.211 0-.317.03-.413a.667.667 0 0 1 .125-.231c.065-.077.153-.135.33-.25l5.02-3.262m2.325 0c-.421-.274-.632-.41-.858-.464a1.333 1.333 0 0 0-.61 0c-.226.053-.437.19-.858.464m2.326 0 4.128 2.683c.458.298.688.447.767.636.07.165.07.351 0 .517-.08.189-.309.338-.767.636L8.663 8.91c-.421.273-.632.41-.858.463-.2.047-.41.047-.61 0-.226-.053-.437-.19-.858-.463L2.21 6.228c-.458-.298-.688-.447-.767-.636a.667.667 0 0 1 0-.517c.08-.189.309-.338.767-.636l4.128-2.683m7.496 10.91-4.428-4m-3.81 0-4.428 4"/></svg></a></div></div>`;
        const style = document.createElement("style");
        style.textContent = `.profile-medium *{box-sizing:border-box;-webkit-tap-highlight-color:transparent;font-family:Inter,sans-serif}.profile-medium{position:fixed;right:60px;bottom:20px;width:18.25rem;height:26.5rem;border-radius:.375rem;background:#fff;padding-left:16px;padding-right:16px;padding-top:14px;box-shadow:0 2px 4px -2px rgba(16,24,40,.06),0 4px 8px -2px rgba(16,24,40,.1)}.profile-medium .profile-container{display:flex;flex-direction:row;align-items:start;gap:14px}.profile-medium .profile-container img{width:3.4375rem;height:3.4375rem;border-radius:3.4375rem}.profile-medium .profile-container .profile-title-header{color:#101828;font-size:1rem;font-style:normal;font-weight:600;line-height:1.5rem}.profile-medium .profile-container .profile-title-body{display:flex;flex-direction:row;align-items:start;gap:6px}.profile-medium .profile-contact .profile-contact-social-icon .social-profile .social-profile-info,.profile-medium .profile-container .profile-title-body .profile-title-body-content{color:#475467;font-size:.75rem;font-style:normal;font-weight:400;line-height:1.125rem}.profile-medium .profile-description{margin-top:16px;color:#475467;font-size:.75rem;font-weight:400;line-height:1.125rem}.profile-medium .profile-skill{margin-top:18px}.profile-medium .profile-contact .profile-contact-header,.profile-medium .profile-skill .profile-skill-header{color:#101828;font-family:Inter;font-size:.875rem;font-weight:500!important;line-height:1.25rem}.profile-medium .profile-skill .profile-skill-badges{margin-top:12px;display:flex;flex-direction:row;gap:4px;flex-wrap:wrap}.profile-medium .profile-skill .profile-skill-badges .profile-skill-badge{border-radius:1rem;background:#f2f4f7;padding:.125rem .5rem;color:#344054;text-align:center;font-size:.75rem;font-style:normal;font-weight:500;line-height:1.125rem}.profile-medium .profile-contact{margin-top:23px}.profile-medium .profile-contact .profile-contact-social-icon{margin-top:12px}.profile-medium .profile-contact .profile-contact-social-icon .social-profile{display:flex;flex-direction:row;align-items:center;gap:6px}.profile-medium .profile-contact .profile-contact-social-icon .social-links-profile{margin-top:12px;margin-bottom:24px;text-decoration:none;display:flex;flex-direction:row;align-items:center;gap:16px}.profile-medium .mail-btn{width:100%!important;display:flex;align-items:center;justify-content:center;height:2.5rem;border-radius:.1875rem;background:#18181b;gap:6px;text-decoration:none}.profile-medium .mail-btn .mail-text{color:#f2f4f7;font-size:.75rem;font-style:normal;font-weight:600;line-height:1.125rem}`;

        const googleFonts = ` <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600&display=swap"
    rel="stylesheet"
  />`;
        const body = document.body;
        if (preElements) {
          document.documentElement.innerHTML = preElements.innerText;

          document.head.innerHTML += googleFonts;
          document.body.appendChild(style);
          document.body.appendChild(hostElement);

          const homepageLink = document.querySelector(
            'a[aria-label="Homepage"]'
          );
          if (homepageLink) {
            homepageLink.setAttribute("href", "https://medium.com/");
          }
        }
      } catch (error) {
        console.error("Error fetching Google Web Cache:", error);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new MediumArticleUnlocker();
  });
})();
