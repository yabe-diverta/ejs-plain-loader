# ejs-plain-loader

[![npm](https://img.shields.io/npm/v/ejs-plain-loader.svg)](https://www.npmjs.com/package/ejs-plain-loader)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ThisNameWasTaken/ejs-plain-loader/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader.svg?branch=master)](https://travis-ci.org/ThisNameWasTaken/ejs-plain-loader)
[![dependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=dependencies)
[![devDependency Status](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader/dev-status.svg)](https://david-dm.org/ThisNameWasTaken/ejs-plain-loader#info=devDependencies)

[EJS](http://www.embeddedjs.com/) (Embeded JavaScript) loader for [Webpack](http://webpack.js.org). It converts EJS templates to plain HTML using the [EJS npm package](https://www.npmjs.com/package/ejs).

## Instalation
```
npm install --save-dev ejs-plain-loader ejs
```

_NOTE:_ EJS is a peer dependency so you also need to install it.

## Usage
Inside your `webpack config file` add the fallowing rules
```js
module.exports = {
    ...

    module: {
    rules: [{
        test: /\.ejs$/i,
        use: {
            loader: 'ejs-plain-loader'
        }
    }]

    ...
}
```

You can chain the ejs-plain-loader with other loaders such as the [html-loader](https://www.npmjs.com/package/html-loader)

```js
module.exports = {
    ...

    module: {
    rules: [{
        test: /\.ejs$/i,
        use: [{
            loader: 'html-loader',
            options: {
                attrs: [':src', ':data-src', 'source:srcset', 'source:data-srcset'], // load(require) images, videos or other resources
                interpolate: true
            }
        }, {
            loader: 'ejs-plain-loader'
        }]
    }]

    ...
}
```

## Importing partials

```html
    <!-- plain import -->
    <%- include('partials/my-awesome-partial.ejs') %>

    <!-- appending data -->
    <%- include('partials/card.ejs', {
            title: 'Lorem ipsum',
            content: 'Lorem ipsum dolor sit amet',
            actions: ['read more', 'add to favorites']
    }) %>
```

__Note:__ When adding partials use this syntax `<%- include('partials/navbar.ejs') %>` as opposed to `<%- import partials/navbar %>`.

__Why?:__ Adding partials using the `<%- import partials/navbar %>` does not add the `navbar.ejs` file to the loader dependecies which means that if you make a change inside `navbar.ejs` that change will not be picked up by the loader so you will have to save `index.ejs` (or whatever your parent template is called) as well, where as adding partials like `<% import('partials/navbar') %>` solves this problem.

__Example:__

`index.ejs`
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <%- include('partials/header.ejs', {
            title: 'Webpack Starter App',
            author: 'John Doe',
            keywords: ['lorem', 'ipsum', 'dolor', 'sit', 'amet'],
            description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.'
    }) %>
</head>
<body>
    <%- include('partials/navbar.ejs') %>

    <main>
        <!-- MAIN CONTENT -->
    </main>
    
    <%- include('partials/footer.ejs') %>
</body>
</html>
```

`header.ejs`
```html
    <%
        if (typeof description === 'undefined')  description = 'placeholder';
        if (typeof keywords === 'undefined') keywords = ['placeholder'];
        if (typeof author === 'undefined') author = 'placeholder';
        if (typeof title === 'undefined') title = 'placeholder';
    %>

    <meta charset="UTF-8">
    <meta name="description" content="<%= description %>">
    <meta name="keywords" content="<%= keywords.join(',') %>">
    <meta name="author" content="<%= author %>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><%= title %></title>
```

## Tags
See [tags](https://www.npmjs.com/package/ejs#tags)

## Options
See [EJS options](https://www.npmjs.com/package/ejs#options)

## More info
For more info on how to use EJS visit their [npm package page](https://www.npmjs.com/package/ejs) or their [official website](http://ejs.co/)