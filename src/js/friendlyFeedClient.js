/**
 * FriendlyFeedClient
 * - This payload is injected into the Facebook DOM
 * 
 */
'use strict';
/* global chrome */

class FriendlyFeedClient {
  constructor() {
    let self = this;

    // Request settings from background page and act accordingly
    chrome.runtime.sendMessage({ getSettings: true }, (settings => {
      self.settings = settings;

      // Reload to "Most Recent" if we are not on "Most Recent"
      if (self.settings.automaticallyRedirect && (window.location.href === 'https://www.facebook.com/' || window.location.href === 'https://www.facebook.com/?sk=h_nor')) {
        window.location.href = 'https://www.facebook.com/?sk=h_chr';
      }

      // Add an observer to look for new lazy loaded DOM additions
      let observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {

          // If the addition is a hyperfeed_story aka a 'post' then successively apply filters
          if (mutation.type === 'childList' && mutation.target.id.startsWith('hyperfeed_story_id')) {
            for (let fn of self.postFilters) {
              if (fn.call(self, mutation.target)) {
                break;
              }
            }
          }
        });
      });

      // pass in the target node, as well as the observer options
      observer.observe(document.querySelector('div[role=feed]'), { childList: true, subtree: true });

      console.log('FriendlyFeed Client v0.1.0 is running');
    }));
  }


  /**
   * Getter for an array of methods used to identify and remove various post types
   * 
   * @readonly
   * @memberof FriendlyFeedClient
   */
  get postFilters() {
    return [
      post => {
        // People You May Know
        if (this.settings.hidePeopleYouMayKnow) {
          let spans = post.querySelectorAll('span');
          spans.forEach(span => {
            if (span.innerText === 'People you may know') {
              console.log('FriendlyFeed removed a "people you may know" post');
              post.style.outline = '5px solid red';
              post.parentNode.removeChild(post);
              chrome.runtime.sendMessage({ removed: true }, ack => {
                return true;
              });
            }
          });
        }
        return false
      },
      post => {
        // Sponsored Posts
        if (this.settings.hideSponsoredPosts) {
          let anchors = post.querySelectorAll('a');
          anchors.forEach(a => {
            if (a.innerText === 'Sponsored') {
              console.log('FriendlyFeed removed a sponsored post');
              post.style.outline = '5px solid red';
              post.parentNode.removeChild(post);
              chrome.runtime.sendMessage({ removed: true }, ack => {
                return true;
              });
            }
          });
        }
        return false;
      }
    ]
  }
}

// Create singleton instance
var friendlyFeedClient = friendlyFeedClient || new FriendlyFeedClient();
