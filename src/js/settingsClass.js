/**
 * SettingsClass
 * - Implements the ability to save, read and synchronize extension settings
 * 
 */
'use strict';
/* global SettingsClass chrome */

class SettingsClass {

  /**
   * 
   * 
   * @static
   * @param {object} defaultSettings 
   * @returns a Promise containing the restored settings or defaults if no settings have been saved yet
   * @memberof SettingsClass
   */
  static restore(defaultSettings) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(defaultSettings, (settings) => {
        let err = chrome.runtime.error
        if (err) {
          console.error('Error restoring settings:', err);
          reject(err);
        } else {
          resolve(settings);
        }
      });
    });
  }


  /**
   * 
   * 
   * @static
   * @param {object} settings 
   * @returns a Promise containing the saved settings
   * @memberof SettingsClass
   */
  static save(settings) {
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(settings, () => {
        let err = chrome.runtime.error
        if (err) {
          console.error('Error restoring settings:', err);
          reject(err);
        }
        else {
          resolve(settings);
        }
      });
    });
  }


  /**
   * 
   * 
   * @static
   * @param {object} defaultSettings 
   * @returns a Promise containing an empty object or defaultSettings if it was passed in. Does not save the defaultSettings
   * @memberof SettingsClass
   */
  static clear(defaultSettings) {
    let self = this;
    return new Promise((resolve, reject) => {
      chrome.storage.sync.clear(() => {
        let err = chrome.runtime.error
        if (err) {
          console.error('Error restoring settings:', err);
          reject(err);
        } else {
          if (defaultSettings) {
            self.save(defaultSettings)
              .then(settings => {
                resolve(settings);
              })
          }
          else {
            resolve({});
          }
        }
      });
    });
  }
}
