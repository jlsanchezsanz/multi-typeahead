[![Published on webcomponents.org](https://img.shields.io/badge/webcomponents.org-published-blue.svg)](https://www.webcomponents.org/jlsanchezsanz/multi-typeahead)

# \<multi-typeahead\>
Typeahead with multiple selection.

## Usage

  ```html
  <multi-typeahead
    items="[[users]]"
    collapsed
    remove-selected
    selected-items="{{selectedUsers}}">
  </multi-typeahead>
  ```

## Install the Polymer-CLI

First, make sure you have the [Polymer CLI](https://www.npmjs.com/package/polymer-cli) installed. Then run `polymer serve` to serve your element locally.

## Viewing Your Element

```
$ polymer serve
```

## Running Tests

Install the following packages in order to add coverage to the tests:

```
npm i -g t2ym/web-component-tester#wct6-plugin
```
```
npm i -g t2ym/web-component-tester-istanbul#0.10.1-wct6.1
```

Run your tests by executing the following command:

```
$ wct
```

Your application is already set up to be tested via [web-component-tester](https://github.com/Polymer/web-component-tester). Run `wct` to run your application's test suite locally.

## Contributing
1. Fork it!
2. Create your feature branch: `git checkout -b my-new-feature`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin my-new-feature`
5. Submit a pull request :D