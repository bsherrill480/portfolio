/**
 * Created by brian on 11/23/16.
 */
function ExampleCtrl() {
  var vm = this;
  vm.hero = 'spawn';
}

function exampleCmpnt() {
  return {
    templateUrl: 'components/example_cmpnt.html',
    controller: ExampleCtrl,
    bindings: {
      hero: '<'
    }
  }
}


export default {
  name: 'exampleCmpnt',
  fn: exampleCmpnt
};