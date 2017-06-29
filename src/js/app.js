/**
 * App
 * - The main app or extension
 * 
 */
"use strict"
/* global SettingsClass chrome */

class App {
  constructor() {
    let self = this;

    self.settingsClass = new SettingsClass();
    self.settingsClass.restore()
      .then(settings => {
        self.settings = settings;
        let id = document.querySelector('html').id;
        self.route(id + 'Page');
      });
  }

  // Simple little page/view router
  route(pageId) {

    // Settings Page
    this.settingsPage = () => {
      // Todo: Reserved for future use
    }

    // Extension Page
    this.extensionPage = () => {
      return new Promise(function (resolve, reject) {
        chrome.tabs.getSelected(null, function (tab) {
          let bodyClassList = document.querySelector('body').classList;
          let url = tab.url;
          if (url === 'https://www.facebook.com/') {
            // Todo: Add check for previous class injection
            chrome.tabs.executeScript(null, { file: '/js/friendlyFeedClient.js' });
          }
        });
      });
    }
    return this[pageId]();
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
