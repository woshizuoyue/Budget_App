

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

    var calculateTotal = function(type){

        var sum = 0;

        data.allItem[type].forEach(function(cur){

            sum += cur.value;
        });

        data.totals[type] = sum;
    }

    var data = {

        allItem : {

            exp : [],
            inc : []
        },

        totals : {

            exp : 0,
            inc : 0
        }, 

        budget : 0,
        percentage : -1
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

        calculateBudget : function(){

            // calculate total income and expense;

            calculateTotal('inc');
            calculateTotal('exp');

            // calculate the budget : income - expense;

            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage;

            if(data.totals.inc > 0){

                data.percentage = Math.round((data.totals.exp/data.totals.inc) * 100);
            }

            else{
                data.percentage = -1;
            }

            
        },

        getBudget : function(){

            return {
                budget : data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            }
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
        inputBtn : '.add__btn',
        incomeContainer : '.income__list',
        expenseContainer : '.expenses__list'
    };

    var operationObj = {

        getInput : function(){

            return{

                type : document.querySelector(DomStirng.inputType).value,
                description : document.querySelector(DomStirng.inputDescription).value,
                value : parseFloat(document.querySelector(DomStirng.inputValue).value)
            }
        },

        addListItem : function(obj, type){

            var html, newHtml, element;

            // create html string with placeholder text;

            if(type === 'inc'){

                element = DomStirng.incomeContainer;

                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'+
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }else if(type === 'exp'){

                element = DomStirng.expenseContainer;

                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div>'+
                '<div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }

            //replace the placeholder text with some actual data;
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the html to the Dom;

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields : function (){

            var fields, fieldArr;

            fields = document.querySelectorAll(DomStirng.inputDescription + ', ' + DomStirng.inputValue);

            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function(current, index, array){

                current.value = "";

            });

            fieldArr[0].focus();
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

    var updateBudget = function(){

        //1. calculate the budget;

        BudgetController.calculateBudget();

        //2. return the budget;

        var budget = BudgetController.getBudget();

        //3. display the budget on th UI

        console.log(budget);
    }
    
    var ctrlAddItem = function(){

        var input, newItem;

        //1. get the field input data;

        input = UICtrl.getInput();
        //2. add the item to the budget controller;

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = BudgetController.addItem(input.type, input.description, input.value);
            //3. add the item to the UI;

            UIController.addListItem(newItem, input.type);

            //4. clear the fields

            UIController.clearFields();
            //4. calculate the budget and update the UI
        
            updateBudget();
        }

        


    }

    return {

        init : function(){

            setupEVentListener();
        }
    }

    

    
})(BudgetController, UIController);


controller.init();