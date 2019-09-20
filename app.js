

var BudgetController = (function(){

    var Expense = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
    }

    var Income = function(id, description, value){

        this.id = id;
        this.description = description;
        this.value = value;
    }

    var data = {

        allItem : {

            exp : [],
            inc : []
        },

        totals : {

            exp : 0,
            inc : 0
        }
    }

    return {

        addItem : function(type, des, val){

            var newItem, ID;

            //[1,2,3,4,5], next id = 6;
            //[1,2,4,6,7], next id = 7;
            // id = last id + 1;

            if(data.allItem[type].length > 0){

                ID = data.allItem[type][data.allItem[type].length - 1].id + 1;
            }else{

                ID = 0;
            }


            // create a new item based on the 'expense' or 'income' type;
            if(type === 'exp'){

                newItem = new Expense(ID, des, val);

            }else if(type === 'inc'){

                newItem = new Income(ID, des, val);
            }

            // push it into data structure;
            data.allItem[type].push(newItem);

            // return the new item;
            return newItem;
        },

        testing : function(){
            console.log(data);
        }
    }

    

    

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

    var setupEVentListener = function(){

        var Dom = UICtrl.getDomString();

        document.querySelector(Dom.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress',function(event){
        
            if(event.keyCode === 13 || event.which === 13){

                ctrlAddItem();
            }
    
       
        });

    }
    
    var ctrlAddItem = function(){

        var input, newItem;

        //1. get the field input data;

        input = UICtrl.getInput();
        //2. add the item to the budget controller;

        newItem = BudgetController.addItem(input.type, input.description, input.value);
        //3. add the item to the UI;
        //4. calculate the budget;
        //5. display the budget on the UI;


    }

    return {

        init : function(){

            setupEVentListener();
        }
    }

    

    
})(BudgetController, UIController);


controller.init();