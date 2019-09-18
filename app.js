

var BudgetController = (function(){

    

})();

var UIController = (function(){

    var DomStirng = {

        inputType : '.add__type',
        inputDescription : '.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn'
    };

    var operationObj = {

        getInput : function(){

            return{

                type : document.querySelector(DomStirng.inputType).value,
                description : document.querySelector(DomStirng.inputDescription).value,
                value : document.querySelector(DomStirng.inputValue).value
            }
        },

        getDomString : function(){

            return DomStirng;

        }

    }

    return operationObj;

})();

var controller = (function(budgetCtrl, UICtrl){

    var Dom = UICtrl.getDomString();
    var ctrlAddItem = function(){

        //1. get the field input data;

        var input = UICtrl.getInput();

        console.log(input);
        //2. add the item to the budget controller;
        //3. add the item to the UI;
        //4. calculate the budget;
        //5. display the budget on the UI;


    }

    document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress',function(event){
        
        if(event.keyCode === 13 || event.which === 13){

            ctrlAddItem();
        }
    
       
    });

    
})(BudgetController, UIController);