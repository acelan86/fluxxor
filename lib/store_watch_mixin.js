var _each = require("lodash-node/modern/collections/forEach");

var StoreWatchMixin = function() {
  var storeNames;
  return {
    componentDidMount: function() {
      var flux = this.props.flux || this.context.flux;
      var storeNames = this._getStoreNames();
      _each(storeNames, function(store) {
        flux.store(store).on("change", this._setStateFromFlux);
      }, this);
    },

    componentWillUnmount: function() {
      var flux = this.props.flux || this.context.flux;
      var storeNames = this._getStoreNames();
      _each(storeNames, function(store) {
        flux.store(store).removeListener("change", this._setStateFromFlux);
      }, this);
    },

    getStateFromFlux: function () {
      var flux = this.props.flux || this.contex.flux;
      var state = {};
      var storeNames = this._getStoreNames();
      _each(storeNames, function (store) {
        if ('function' !== typeof flux.store(store).getState) {
          throw new Error("Store [" + store + "] must have getState function to return state for view");
        } else {
          state[store] = flux.store(store).getState();
        }
      });
      return state;
    },

    _setStateFromFlux: function() {
      if(this.isMounted()) {
        this.setState(this.getStateFromFlux());
      }
    },

    _getStoreNames: function () {
      var stores,
          names;
      if (!storeNames) {
        stores = (this.props.flux || this.context.flux).stores;
        names = [];
        for (var name in stores) {
          if (stores.hasOwnProperty(name)) {
            names.push(name);
          }
        }
        storeNames = names;
      }
      return storeNames;
    },

    getInitialState: function() {
      return this.getStateFromFlux();
    }
  };
};

StoreWatchMixin.componentWillMount = function() {
  throw new Error("Fluxxor.StoreWatchMixin is a function that takes one or more " +
    "store names as parameters and returns the mixin, e.g.: " +
    "mixins[Fluxxor.StoreWatchMixin(\"Store1\", \"Store2\")]");
};

module.exports = StoreWatchMixin;
