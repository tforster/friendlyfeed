"use strict";
/* global chrome */

class SettingsClass {
  constructor() {
    let self = this;

    this.data = {
    };

    return self;
  }


  /**
   * 
   * 
   * @returns a Promise containing the restored settings or defaults if no settings have been saved yet
   * 
   * @memberof SettingsClass
   */
  restore() {
    let self = this;
    return new Promise(function (resolve, reject) {
      let obj = self.data;
      chrome.storage.sync.get(obj, function (data) {
        if (chrome.runtime.error) {
          reject(chrome.runtime.error)
        } else {
          self.data = data;
          resolve(data);
        }
      });
    });
  }


  /**
   * 
   * 
   * @returns a Promise containing the saved settings
   * 
   * @memberof SettingsClass
   */
  save() {
    let self = this;

    return new Promise(function (resolve, reject) {
      let obj = self.data;
      chrome.storage.sync.set(obj, function () {
        if (chrome.runtime.error) {
          reject(chrome.runtime.error)
        }
        else {
          resolve(obj)
        }
      });
    });
  }


  /**
   * 
   * 
   * @returns a Promise with the empty default values
   * 
   * @memberof SettingsClass
   */
  clear() {
    return new Promise(function (resolve, reject) {
      chrome.storage.local.clear(function () {
        var error = chrome.runtime.lastError;
        if (error) {
          reject('clear error', error);
        } else {
          // Todo: call restore so we return defaults
          resolve();
        }
      });
    });

  }
}
  