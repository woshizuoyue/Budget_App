

var BudgetController = (function(){

    var x = 23;

    var add = function(a){

        return a + x;
    }

    // same as add() method. two ways to define function;
    // 1. function _name (...){};
    // 2. var x = function(...){};
    
    function minus (a){

        return x - a;
    }

    return{

        publicTest : function(b){

            return add(b);
        },

        publicMinusTest: function(b){

            return minus(b);
        }
    }

})();

var UIController = (function(){

})();

var controller = (function(budgetCtrl, UICtrl){

    var z = budgetCtrl.publicTest(5);

    var y = budgetCtrl.publicMinusTest(5);

    return{

        anotherPublic: function(){
            
            console.log(z);
        },

        anotherMinusPublic : function(){

            console.log(y);
        }
    }
})(BudgetController, UIController);