

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

        deleteItem : function(type, id){

            var ids, index;

            // id = 2;
            // data.allItems[type][id];
            // ids = [1,2,4,6,8];
            // index = 3;

            ids = data.allItem[type].map(function(current){

                return current.id;
            });

            index = ids.indexOf(id);

            if(index !== -1){

                // splice() is used to delete the item from array;

                data.allItem[type].splice(index, 1);
            }

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
        expenseContainer : '.expenses__list',
        budgetLabel : '.budget__value',
        incomeLabel : '.budget__income--value',
        expenseLabel : '.budget__expenses--value',
        percentageLabel : '.budget__expenses--percentage',
        container : '.container'
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

                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div>'+
                '<div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete">'+
                '<button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }else if(type === 'exp'){

                element = DomStirng.expenseContainer;

                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div>'+
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

        displayBudget : function(obj){

            document.querySelector(DomStirng.budgetLabel).textContent = obj.budget;
            document.querySelector(DomStirng.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DomStirng.expenseLabel).textContent = obj.totalExp;
            

            if(obj.percentage > 0){

                document.querySelector(DomStirng.percentageLabel).textContent = obj.percentage + '%';
            }else{

                document.querySelector(DomStirng.percentageLabel).textContent = '---';
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

        document.querySelector(Dom.container).addEventListener('click', ctrlDeleteItem);

    }

    var updateBudget = function(){

        //1. calculate the budget;

        budgetCtrl.calculateBudget();

        //2. return the budget;

        var budget = budgetCtrl.getBudget();

        //3. display the budget on th UI

        UIController.displayBudget(budget);
    }
    
    var ctrlAddItem = function(){

        var input, newItem;

        //1. get the field input data;

        input = UICtrl.getInput();
        //2. add the item to the budget controller;

        if(input.description !== "" && !isNaN(input.value) && input.value > 0){

            newItem = budgetCtrl.addItem(input.type, input.description, input.value);
            //3. add the item to the UI;

            UIController.addListItem(newItem, input.type);

            //4. clear the fields

            UIController.clearFields();
            //4. calculate the budget and update the UI
        
            updateBudget();
        }
    }

    var ctrlDeleteItem = function(event){

        var itemID, splitID, type, ID;

        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if(itemID){

            // split inc-ID;
            splitID = itemID.split('-');

            type = splitID[0];

            ID = parseInt(splitID[1]);
            // 1. delete the item from data structure;

            budgetCtrl.deleteItem(type, ID);

            // 2. delete the item from UI

            // 3. update and show the new Budget;
        }

    }

    return {

        init : function(){

            UICtrl.displayBudget({

                budget : 0,
                totalInc : 0,
                totalExp : 0,
                percentage : -1

            })

            setupEVentListener();
        }
    }

    

    
})(BudgetController, UIController);


controller.init();