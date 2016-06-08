# WP REST API Plugin jQuery Example

The goal of this code is to be the most succinct, easy-to-understand JavaScript
example of using the WordPress REST API.

[More information about the REST API.](http://v2.wp-api.org)

## Client-side (within the browser)

All API calls are done from within your browser. This means you can use it to
make rich web apps that load data in the background, and even offload many
page hits from your server, decreasing your server load. All of this,
while being more responsive and giving the the impression of a faster-loading
user experience.

## It uses jQuery

jQuery is the most common JavaScript tool to use for more complex browser code.
It's one of the easiest ways to get started with JavaScript and is definitely
the way to go if you're not using a larger-scale client-side framework like
[React](https://facebook.github.io/react/),
[Angular](https://angularjs.org/),
or [Ember](http://emberjs.com/).

## It's a Plugin

This code works within a WordPress plugin. If you follow the pattern, you can
make your own WordPress plugin with a rich client experience.

## Public and Authenticated calls

There are examples of public calls and ones that use cookie/nonce authentication.

[More info about authentication.](http://v2.wp-api.org/guide/authentication/)


## Bonus: Multiple Language Support!

Given that we all tend to pattern greatly off of example code, I've added support
to this plugin for [Internationalization (i18n).](https://en.wikipedia.org/wiki/Internationalization_and_localization)
This is to encourage folks to make their plugins i18n-ready.
When you write your own code similar to the i18n code I've added to this plugin,
it will allow someone who installs your plugin to add translation files
for different languages and have all strings translated within the plugin
(including JavaScript code!)

While this does add a little bit of complexity to the code, it's well worth it.
WordPress is a very international software platform, so we should all do what
we can to make our plugins accessible to the non-English speaking community!

[More information about i18n in WordPress](https://codex.wordpress.org/I18n_for_WordPress_Developers)

### How to use:

Whenever you add a new translate string, you'll need to re-generate the .pot file.

 1. [Install node/npm](https://docs.npmjs.com/getting-started/installing-node) if you haven't got it already.
 2. Install grunt-cli if you haven't already: `npm install -g grunt-cli`
 3. Run `grunt makepot` to generate the new .pot file.

