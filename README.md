# FriendlyFeed 0.1.0

_A Chrome extension to make Facebooks News Feed more Friendly_

# Built With

* [Visual Studio Code 1.12.2](https://code.visualstudio.com/)
* [Google Chrome for Windows Version 58.0.3029.110 (64-bit)](https://www.google.com/chrome/)

# For Developers

There is not much to getting started with this project other than cloning/forking the repository, running `yarn install` and opening up your code editor to the src/ folder. Build the project using `gulp build`. Note that currently only the dev target is available (e.g. build/dev). 

## Installing The Extension in Developer Mode

Testing is done locally by side-loading the extension in developer mode.

1. Navigate to [chrome://extensions/](chrome://extensions/)
1. Check the box in the top right that says "Developer mode"
1. Click the button "Load unpacked extension..." and select the build/dev folder.

## Tips
1. Refresh the extensions page to reload the extension following code changes
1. Right-click the extension button and choose Inspect popup to get an extension specific Developer Tools window

# Roadmap

* Autostart and run in the background without requiring the icon to be clicked
* Hook the News Feed menu item and prevent it from switching to the utterly useless and annoying Top Stories
* Other DOM reformatting to create an efficient feed that can be rapidly consumed. E.g. implement Ctrl-J, Ctrl-K and spacebar for navigation

# Change Log

0.1.0 (2017-06-28)
* Barely a working proof of concept
