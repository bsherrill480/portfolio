/**
 * Created by brian on 11/23/16.
 */
import angular from 'angular';

const bulk = require('bulk-require');
const componentsModule = angular.module('app.components', []);
const controllers = bulk(__dirname, ['./**/!(*index|*.spec).js']);

function declare(controllerMap) {
  Object.keys(controllerMap).forEach((key) => {
    console.log('componentItem');
    let item = controllerMap[key];

    if (!item) {
      return;
    }

    if (item.fn && typeof item.fn === 'function') {
      componentsModule.component(item.name, item.fn());
    } else {
      declare(item);
    }
  });
}

declare(controllers);

export default componentsModule;
