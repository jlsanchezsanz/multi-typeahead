Polymer({

  is: 'multi-typeahead',

  properties: {
    /**
      * If true, the list collapses. Otherwise it's
      * displayed below the input.
      */
    collapse: {
      type: Boolean,
      value: false
    },

    /**
      * The icon displayed on selected items.
      */
    checkIcon: {
      type: String,
      value: 'icons:check'
    },

    /**
      * The icon used to unselect items.
      */
    clearIcon: {
      type: String,
      value: 'icons:clear'
    },

    /**
      * The list of items to be displayed.
      */
    items: {
      type: Array
    },

    /**
      * If true, the list is displayed. Only applies
      * in case of collapse is true.
      */
    open: {
      type: Boolean,
      observer: '_openChanged'
    },

    /**
      * Text displayed when there is no input.
      */
    placeholder: {
      type: String
    },

    /**
      * If true, the selected items are hidden.
      */
    removeSelected: {
      type: Boolean,
      value: false
    },

    /**
      * The number of rendered items.
      */
    _renderedCount: {
      type: Number,
      observer: '_renderedCountChanged'
    },

    /**
      * The value of the input used to search for items.
      */
    _searchValue: {
      type: String,
      value: ''
    },

    /**
      * The list of selected items.
      */
    selectedItems: {
      type: Array,
      notify: true,
      value: function() {
        return [];
      }
    }
  },

  listeners: {
    'keydown': '_onKeyDown',
    'click': '_onFocus',
    'focus': '_onFocus'
  },

  _onFocus: function(e) {
    e.stopPropagation();
    this.open = true;
    if (!this.$$('.hover')) {
      this._focusItem(this._nextActiveItemIndex());
    }
    this._focusInput();
  },

  attached: function() {
    this.open = !this.collapse;
  },

  _clearInput: function() {
    this._searchValue = '';
  },

  _computePlaceholder: function(placeholder, _searchValue, selectedItemsLength) {
    return _searchValue || selectedItemsLength ? '' : placeholder;
  },

  _filter: function(_searchValue, selectedItemsLength) {
    if (!_searchValue && !selectedItemsLength) {
      return null;
    } else {
      _searchValue = _searchValue.toLowerCase();
      return function(item) {
        return (this.removeSelected ? this.selectedItems.indexOf(item) < 0 : true)
          && item.name.toLowerCase().indexOf(_searchValue) >= 0;
      }.bind(this)
    }
  },

  _focusInput: function() {
    this.$.input.focus();
  },

  _focusItem: function(index) {
    if (index >= 0) {
      if (this.$$('.hover')) {
        this.$$('.hover').classList.remove('hover');
      }
      var list = Polymer.dom(this.root).querySelectorAll('.list-item');
      var element = list[index];
      element.focus();
      element.classList.add('hover');
    }
  },

  _handleArrowKey: function(key) {
    var list = Polymer.dom(this.root).querySelectorAll('.list-item');
    var focusedElement = this.$$('.hover');
    var index;
    if (focusedElement) {
      var focusedIndex = list.indexOf(focusedElement);
      if (key === 38) {
        index = this._previousActiveItemIndex(focusedElement);
      } else if (key === 40) {
        index = this._nextActiveItemIndex(focusedElement);
      }
    } else {
      index = list.length ? 0 : -1;
    }
    this._focusItem(index);
    this._focusInput();
  },

  _handleItemClick: function(e) {
    this._selectItem(e.target);
  },

  _isDisabled: function(item, selectedItems) {
    var found = this.selectedItems.find(function(selectedItem) {
      return selectedItem === item;
    });
    return found ? 'disabled' : '';
  },

  _nextActiveItemIndex: function(focusedElement) {
    var list = Polymer.dom(this.root).querySelectorAll('.list-item');
    var index = list.indexOf(focusedElement);
    var found = false;
    while (!found && index < list.length - 1) {
      index += 1;
      found = !list[index].classList.contains('disabled');
    }
    return found ? index : -1;
  },

  _onFocusItem: function(e) {
    e.stopPropagation();
    var element = e.target.parentNode.classList.contains('list-item')
      ? e.target.parentNode
      : e.target;
    if (this.$$('.hover')) {
      this.$$('.hover').classList.remove('hover');
    }
    element.classList.add('hover');
  },

  _onKeyDown: function(e) {
    e.stopPropagation();
    switch (e.which) {
      case 38:
      case 40:
        e.preventDefault();
        this._handleArrowKey(e.which);
        break;
      case 13:
        e.preventDefault();
        this._selectItem(this.$$('.hover'));
        break;
      case 8:
        if (this.selectedItems.length && !this._searchValue) {
          this.splice('selectedItems', this.selectedItems.length - 1, 1);
          this._focusItem(this._nextActiveItemIndex());
          this._focusInput();
        }
        break;
      case 27:
        e.preventDefault();
        this.$.input.blur();
        this.open = false;
        break;
    }
  },

  _onTypeaheadClick: function(e) {
    e.stopPropagation();
    if (this !== e.target && !this.contains(e.target)) {
      this.open = false;
    }
  },

  _openChanged: function(open) {
    if (this.collapse) {
      if (this.open) {
        this.listen(window, 'click', '_onTypeaheadClick');
      } else {
        this.unlisten(window, 'click', '_onTypeaheadClick');
      }
    }
  },

  _previousActiveItemIndex: function(focusedElement) {
    var list = Polymer.dom(this.root).querySelectorAll('.list-item');
    var index = list.indexOf(focusedElement);
    var found = false;
    while (!found && index != 0) {
      index -= 1;
      found = !list[index].classList.contains('disabled');
    }
    return found ? index : -1;
  },

  _removeItem: function(e) {
    var index = this.selectedItems.findIndex(function(item) {
      return item === e.model.item;
    });
    this.splice('selectedItems', index, 1);
    this._clearInput();
    this._focusItem(this._nextActiveItemIndex());
    this._focusInput();
  },

  _renderedCountChanged: function(newValue, oldValue) {
    if (oldValue >= 0) {
      this._focusItem(this._nextActiveItemIndex());
      this._focusInput();
    }
  },

  _selectItem: function(element) {
    if (element) {
      var item = this.$$('#list').itemForElement(element);
      if (this.selectedItems.indexOf(item) < 0) {
        this.push('selectedItems', item);
        this._clearInput();
      }
      var nextActiveItemIndex = this._nextActiveItemIndex(element)
      var index = nextActiveItemIndex >= 0
        ? nextActiveItemIndex
        : this._previousActiveItemIndex(element);
      this._focusItem(index);
      this._focusInput();
    }
  }

});