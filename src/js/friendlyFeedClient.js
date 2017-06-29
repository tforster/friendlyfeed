/**
 * FriendlyFeedClient
 * - This is the payload that is injected into the Facebook DOM
 * 
 */
"use strict";
/* global */

class FriendlyFeedClient {
  constructor() {
    let self = this;
    window.addEventListener('scroll', () => {
      self.remove();
    });
    document.querySelector('body').classList.add('FriendlyFeedClient');
    console.log('FriendlyFeed Client running')
  }

  remove() {
    let shit = [].filter.call(document.querySelectorAll('a'), (a) => {
      return a.innerText == 'Sponsored';
    });

    shit.forEach(poo => {
      let p = poo;
      while (!p.querySelector('._4r_y')) {
        p = p.parentNode;
      }
      if (p.id !== 'content_container') {
        console.log('FriendlyFeedClient removed a sponsored post');
        // Todo: animate the removal so we can see this is doing its job
        p.parentNode.removeChild(p)
      }
    });
  }
}

if (!document.body.classList.contains('FriendlyFeedClient')) {
  new FriendlyFeedClient();
}
