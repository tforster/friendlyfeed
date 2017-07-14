# FriendlyFeed 0.1.0

A Chrome extension to make Facebooks News Feed more Friendly

## Built With

* [Visual Studio Code](https://code.visualstudio.com/) on Windows 10
* [Google Chrome for Windows Version 59.0.3071.115 (Official Build) (64-bit)](https://www.google.com/chrome/)
* [Oh-My-Zsh](https://github.com/robbyrussell/oh-my-zsh) on Bash on Ubuntu on [Windows Subsystem for Linux](https://msdn.microsoft.com/en-us/commandline/wsl/install_guide)
* [NodeJS](https://nodejs.org/en/) 7.8.0
* ~~NPM 4.2.0~~ [Yarn](https://yarnpkg.com/lang/en/) 0.27.5
* [Git](https://git-scm.com/) 2.7.4
* [Gulp](http://gulpjs.com/)
* [Coffee](https://en.wikipedia.org/wiki/Coffee): A good source of [C8H10N4O2](https://pubchem.ncbi.nlm.nih.gov/compound/caffeine)
* [Cloudinary](http://cloudinary.com): Use as a CLI (via query string) to crop and resize images
* [babel-eslint](https://github.com/babel/babel-eslint): Handles ES2017 features like arrow functions inside classes better than the default Espree parser.
* [TinyPNG](https://tinypng.com/developers): PNG and JPG minification
* [Babili](https://github.com/babel/babili): ES6 minification

## For Developers

There is not much to getting started with this project other than cloning/forking the repository, running `yarn install` and opening up your code editor to the src/ folder. Run `yarn dev` to start a gulp watcher and continuously build development changes to the build/dev folder. Build the release with `gulp build --target release`.

Note that the images submitted to the Chrome store were generated using Cloudinary on some screenshots. See this [Google Sheet](https://docs.google.com/spreadsheets/d/1cqH8ki3f4VdZdlpC-CF-SSQK8oLyjwXMKhJqpdLkEmE/edit#gid=0) for URL details.

### Installing The Extension in Developer Mode

Testing is done locally by side-loading the extension in developer mode.

1. Navigate to [chrome://extensions/](chrome://extensions/)
1. Check the box in the top right that says "Developer mode"
1. Click the button "Load unpacked extension..." and select the build/dev folder.

### Tips

1. Refresh the extensions page to reload the extension following code changes
1. Right-click the extension button and choose Inspect popup to get an extension specific Developer Tools window

## How It Works

There are three views implemented using individual .html "pages":

* background.html: Is mostly superfluous and only required as a wrapper to call app.js and settingsClass.js. If (when) Chrome supported Javascript modules then background.html could likely be eliminated.
* extension.html: Implements the UI displayed when the extension icon is clicked. Here the user can easily toggle behaviours such as auto removing sponsored posts and defaulting to a chronological feed
* settings.html: Is mostly a "help about" page as there are no current requirements for occasional settings (yet).

Along with three pages are three Javascript files (note that no 1:1 correlation between them and and the .html files should be inferred):

* settigsClass.js: Is treated like a third party library or module. It exposes a class making it easy to save and retrieve configuration about an extension. It uses Google's [chrome.storage.sync](https://developer.chrome.com/extensions/storage) api meaning settings will replicate across all browsers the user is authenticated on.
* app.js: Is where the majority of the extension logic occurs. 
* friiendlyFeedClient.js: In order for the extension to properly parse the Facebook DOM and content it is necessary to load a script that appears to be of the origin. This is done by "injecting" friendlyFeedClient.js into the Facebook page. 

The view handler corresponds to either background.html, extension.html or settings.html. Since settings is mostly a static page the remainder of the discussion focuses on the background and extension views.

* Background View: The background view is loaded when Chrome first launches and is nothing more than a wrapper around app.js and settingsClass.js. In a future version I hope to be able to do away with background.html and specify the scripts in a background.scripts array in manifest.json. The background creates an instance of the app which in turn creates a singleton instance of the settings class.
* Extension View: The extension view grabs the current settings (or provides defaults if it is the first time) and injects friendlyFeedClient.js into the Facebook DOM. The friendlyFeedClient creates a singleton and sets up a mutation observer to listen for DOM additions. Each time a DOM addition is discovered it is checked to see if it is a new post. If it is, it is handed off to an array of filters that check it for removal. Currently there are two filters, one for sponsored posts and another for "people you may know". More filters will likely be added as required.

## Change Log

0.1.0 (2017-06-28)

* Barely a working proof of concept

## Known Issues

* After saving configuration chagnes it is necessary to refresh Facebook for them to take effect

## Roadmap

* Since TinyPNG has a 500 request per month limit need to improve its integration into the buld flow so that it is only called sparingly
