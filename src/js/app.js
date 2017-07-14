/**
 * App
 * - The main app or extension
 * 
 */
'use strict';
/* global SettingsClass chrome ga */

class App {
  constructor() {
    let self = this;

    // Default setting to first-time-sync
    this.defaultSettings = {
      automaticallyRedirect: true,
      hideSponsoredPosts: true,
      hidePeopleYouMayKnow: true,
      sponsorCount: 0
    }

    SettingsClass.restore(self.defaultSettings)
      .then(settings => {        
        // Settings from chrome.storage.sync are cached in this class
        self.settings = settings;

        // All good, route to the requested view
        let id = document.querySelector('html').id;
        self.route(id + 'Page');
      })
      .catch(reason => {
        console.error('FrindlyFeed failed to initialize because:', reason);
      });
  }

  // Simple little page/view router
  route(pageId) {

    // The background page which is akin to the parent app orchestrating everything else
    this.backgroundPage = () => {
      let self = this;

      // Local method to update the badge on the extension icon with the number of sponsored ads that have been removed
      let updateBadgeCount = count => {
        chrome.browserAction.setBadgeText({ text: count.toString() });
      }

      chrome.browserAction.setBadgeBackgroundColor({ color: [255, 0, 0, 255] });
      updateBadgeCount(self.settings.sponsorCount || 0);

      // Listen for messages from the client and update the badge (currently two supported messages)
      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

        // 1. The friendlyFeedClient is requesting the current extension settings (currently from the constructor)
        if (request.getSettings) {
          sendResponse(self.settings);
        }

        // 2. A post was removed so update the badge count
        if (request.removed) {
          ++self.settings.sponsorCount;
          SettingsClass.save(self.settings)
            .then(() => {
              updateBadgeCount(self.settings.sponsorCount);
              sendResponse({ ack: true });
            })
            .catch(() => {
              sendResponse({ ack: false });
            })
        }
      });
    }

    // Settings Page
    this.settingsPage = () => { }

    // Extension Page
    this.extensionPage = () => {
      let self = this;

      // Local method to populate form controls
      let renderControls = () => {
        document.getElementById('automaticallyRedirect').checked = self.settings.automaticallyRedirect;
        document.getElementById('hideSponsoredPosts').checked = self.settings.hideSponsoredPosts;
        document.getElementById('hidePeopleYouMayKnow').checked = self.settings.hidePeopleYouMayKnow;
      }

      // Bind options save button
      document.getElementById('btnSave').addEventListener('click', e => {
        e.preventDefault();
        self.settings.automaticallyRedirect = document.getElementById('automaticallyRedirect').checked;
        self.settings.hideSponsoredPosts = document.getElementById('hideSponsoredPosts').checked;
        self.settings.hidePeopleYouMayKnow = document.getElementById('hidePeopleYouMayKnow').checked;

        SettingsClass.save(self.settings)
          .then(() => {
            // Do nothing for now
          })
          .catch(() => {
            // Do nothing for now
          });
        window.close();
      });

      // Bind options reset button
      document.getElementById('btnReset').addEventListener('click', e => {
        e.preventDefault();
        SettingsClass.clear(self.defaultSettings)
          .then((settings) => {
            self.settings = settings;
            renderControls();
            window.close();
          })
          .catch(() => {
            // Do nothing for now
          });
      });

      // Bind options link 
      document.getElementById('options').addEventListener('click', e => {
        e.preventDefault();
        // Open the extension options page using Google's recommended method
        chrome.runtime.openOptionsPage();
      });

      renderControls();
    }
    return this[pageId]();
  }
}

// Google Analytics Universal Script
(function (i, s, o, g, r, a, m) {
  i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () {
    (i[r].q = i[r].q || []).push(arguments)
  }, i[r].l = 1 * new Date(); a = s.createElement(o),
    m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m)
})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-102341050-1', 'auto');
ga('set', 'checkProtocolTask', function () { });
ga('require', 'displayfeatures');
ga('send', 'pageview', '/' + document.querySelector('html').id);

new App();
