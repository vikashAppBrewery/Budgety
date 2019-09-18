// TODO: 1st step
//  ADD EVENT HANDLER
//  GET INPUT VALUES
//  ADD THE NEW ITEM TO OUR DATA STRUCTURES
//  ADD THE NEW ITEM TO THE UI
//  CALCULATE BUDGET
//  UPDATE THE UI

/*
  TODO: 2nd step
  1. ADD EVENT HANDLER
  2. DELETE THE IEM FROM OUR DATA STRUCTURES
  3. DELETE THE ITEM TO THE UI
  4. RE-CALCULATE BUDGET
  5. UPDATE THE UI
*/

/*
  TODO:3rd step
  1. CALCULATE PERCENTAGE
  2. UPDATE PERCENTAGE IN UICtrl
  3. DISPLAY THE CURRENT MONTH AND YEAR
  4. NUMBER FORMATTING THE
  5. IMPROVE INPUT FIELD UX
*/

/* 
   UI MODULES                                       DATA MODULES      
   1. GET INPUT VALUES                              1.ADD THE NEW ITEM TO OUR DATA STRUCTURES 
   2. ADD NEW ITEM TO THE UI                        2.CALCULATE BUDGET
   3. UPDATE THE UI 
*/

// CONTROLLER MODULES - ADD EVENT HANDLER

// BUDGET CONTROLLER MODULES
var budgetController = (function() {
  //PRIVATE FUNCTIONS
  //SOME CODE BELOW

  //   expense function constructor
  var Expense = function(id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  //   income function constructor
  var Income = function(id, description, value, percentage) {
    this.id = id;
    this.description = description;
    this.value = value;
    this.percentage = -1;
  };

  // perecentage calculator for each entry in Array
  Expense.prototype.calcPercentage = function(totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  Expense.prototype.getPercentage = function() {
    return this.percentage;
  };

  var calculateTotal = function(type) {
    var sum = 0;
    data.allItems[type].forEach(function(cur) {
      sum += cur.value;
    });
    data.totals[type] = sum;
  };

  //   data structure
  var data = {
    allItems: {
      exp: [],
      inc: []
    },
    totals: {
      exp: 0,
      inc: 0
    },
    budget: 0,
    percentage: -1
  };
  return {
    addItem: function(type, des, val) {
      var newItem, ID;
      /*
      [1 2 3 4 5], next id = 6
      [1 2 4 6 8], next id =9
      id = last id + 1
      */
      //  create new ID
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      //   create new item based on inc or exp type
      if (type === "exp") {
        newItem = new Expense(ID, des, val);
      } else if (type === "inc") {
        newItem = new Income(ID, des, val);
      }

      //    push it into our data structure
      data.allItems[type].push(newItem);

      //   return the new element
      return newItem;
    },

    deleteItem: function(type, id) {
      // loop all over the elements to find the ndex which we want to delete
      var ids = data.allItems[type].map(function(current) {
        return current.id;
      });
      index = ids.indexOf(id);
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    calculateBudget: function() {
      //  calculate total income and expense
      calculateTotal("exp");
      calculateTotal("inc");
      // calculate the budget: income - expense
      data.budget = data.totals.inc - data.totals.exp;
      // calculate the percentage of income that we spent
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    calculatePercentage: function() {
      //  a= 20, b= 10, c= 50; income=80 a= 20/80 = 40;
      data.allItems.exp.forEach(function(cur) {
        cur.calcPercentage(data.totals.inc);
      });
    },

    getPercentage: function() {
      var allPerc = data.allItems.exp.map(function(cur) {
        return cur.getPercentage();
      });
      return allPerc;
    },

    getBudget: function() {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage
      };
    },
    testing: function() {
      console.log(data);
    }
  };
})();

// UI CONTROLLER MODULES
var UIController = (function() {
  // some code here
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    inputBtn: ".add__btn",
    incomeContainer: ".income__list",
    expensesContainer: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expensesLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
    container: ".container",
    expensesPercLabel: ".item__percentage",
    dateLables: ".budget__title--month"
  };

  var formatNumber = function(num, type) {
    var numSplit, int, dec, type;
    // + or - before the the number exactly 2 decimal points comma seprating the thousands separator
    num = Math.abs(num);
    num = num.toFixed(2);

    numSplit = num.split(".");
    int = numSplit[0];
    if (int.length > 3) {
      int =
        int.substr(0, int.length - 3) +
        "," +
        int.substr(int.length - 3, int.length);
    }

    dec = numSplit[1];

    return (type === "exp" ? (sign = "- ₹") : "+ ₹") + int + "." + dec;
  };
  var nodeListForEach = function(list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };
  return {
    getinput: function() {
      return {
        type: document.querySelector(DOMstrings.inputType).value, // will be either inc or expense
        description: document.querySelector(DOMstrings.inputDescription).value, // description input
        value: parseFloat(document.querySelector(DOMstrings.inputValue).value) //value input
      };
    },

    addListItem: function(obj, type) {
      var html, newHtml, element;
      // 1. Create html string with placeholder text
      if (type === "inc") {
        element = DOMstrings.incomeContainer;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === "exp") {
        element = DOMstrings.expensesContainer;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }
      // 2. replace the placeholder text with some actual DATA
      newHtml = html.replace("%id%", obj.id);
      newHtml = newHtml.replace("%description%", obj.description);
      newHtml = newHtml.replace("%value%", formatNumber(obj.value, type));
      // 3. insert the html into the DOM
      document.querySelector(element).insertAdjacentHTML("beforeend", newHtml);
    },

    deleteListItem: function(selectorID) {
      var el = document.getElementById(selectorID);
      el.parentNode.removeChild(el);
    },

    clearFields: function() {
      var fields, fieldsArr;
      fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );
      fieldsArr = Array.prototype.slice.call(fields);
      fieldsArr.forEach(function(current, index, array) {
        current.value = "";
      });
      fieldsArr[0].focus();
    },
    displayBudget: function(obj) {
      var type;
      obj.budget > 0 ? (type = "inc") : (type = "exp");
      document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(
        obj.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(
        obj.totalInc,
        "inc"
      );
      document.querySelector(
        DOMstrings.expensesLabel
      ).textContent = formatNumber(obj.totalExp, "exp");

      if (obj.percentage > 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          obj.percentage + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent = "---";
      }
    },

    displayPercentages: function(percentages) {
      var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);

      nodeListForEach(fields, function(current, index) {
        // do stuff
        if (percentages[index] > 0) {
          current.textContent = percentages[index] + "%";
        } else {
          current.textContent = "---";
        }
      });
    },

    displayMonth: function() {
      var now, months, month, year;
      now = new Date();
      months = [
        "january",
        "february",
        "march",
        "april",
        "may",
        "june",
        "july",
        "august",
        "september",
        "october",
        "november",
        "december"
      ];
      month = now.getMonth();
      year = now.getFullYear();
      document.querySelector(DOMstrings.dateLables).textContent =
        months[month] + " " + year;
    },
    changedType: function() {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          "," +
          DOMstrings.inputDescription +
          "," +
          DOMstrings.inputValue
      );
      nodeListForEach(fields, function(cur) {
        cur.classList.toggle("red-focus");
      });
      document.querySelector(DOMstrings.inputBtn).classList.toggle("red");
    },
    getDOMstrings: function() {
      return DOMstrings;
    }
  };
})();

//  GLOBAL APP CONTROLLER MODULES
var controller = (function(budgetCtrl, UICtrl) {
  // some code
  var setupEventListener = function() {
    // EVENT handlers click event on button
    document.querySelector(DOM.inputBtn).addEventListener("click", ctrlAddItem);
    document.addEventListener("keypress", function(event) {
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
    document
      .querySelector(DOM.container)
      .addEventListener("click", ctrlDeleteItem);

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", UICtrl.changedType);
  };

  var updatePercentages = function() {
    // 1. calculate percentage
    budgetCtrl.calculatePercentage();
    // 2. read percentages from the budget controller
    var percentage = budgetCtrl.getPercentage();
    // 3. update the ui the new percentages
    UICtrl.displayPercentages(percentage);
  };

  var DOM = UICtrl.getDOMstrings();
  var updateBudget = function() {
    // 1.calculate the budget
    budgetCtrl.calculateBudget();
    // 2.return the budget
    var budget = budgetCtrl.getBudget();
    // 3.display the budget on the UI
    UICtrl.displayBudget(budget);
  };
  var ctrlAddItem = function() {
    var input, newItem;
    //  TODO:1.Get the field input data
    input = UICtrl.getinput();

    if (input.description !== "" && !isNaN(input.value) && input.value > 0) {
      //  TODO:2.Add the item to the budget CONTROLLER
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      //  TODO:3.Add the item to the UI
      UICtrl.addListItem(newItem, input.type);
      //  TODO:4. CLEAR THE FIELDS_ARR
      UICtrl.clearFields();
      //  TODO:5.Calculate and update the budget
      updatePercentages();
      //  TODO:6. Display the budget on the UI
      updateBudget();
    }
  };

  var ctrlDeleteItem = function(event) {
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    if (itemID) {
      // inc-1 is
      splitID = itemID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      // 1.delete the item from the data structure
      budgetCtrl.deleteItem(type, ID);
      // 2. delete the item from the UI
      UICtrl.deleteListItem(itemID);
      // 3. update and show the new budget
      updateBudget();
      // 4.Calculate and update the budget
      updatePercentages();
    }
  };

  return {
    init: function() {
      console.log("init");
      UICtrl.displayMonth();
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1
      });
      setupEventListener();
    }
  };
})(budgetController, UIController);

controller.init();
