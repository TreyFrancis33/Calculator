const numberButtons = document.querySelectorAll("[data-btn-number]");
const operatorButtons = document.querySelectorAll("[data-btn-operation]");
const clearButton = document.querySelector(".clear-button");
const squareRootButton = document.querySelector(".square-root-button");
const squareButton = document.querySelector(".square-button");
const negateButton = document.querySelector(".negate-button");
const decimalButton = document.querySelector(".decimal-button");
const equalButton = document.querySelector(".equal-button");
const operationContainer = document.querySelector(".operation-container");
let currentOperation = [];
let operators = [];
let operands = [];
let negated = false;
let decimal = false;
let justOperated = false;
let errorOccured = false;
let operationStarted = false;
window.addEventListener("keydown", (e) => {
  const numButton = document.querySelector(`[data-btn-number="${e.key}"]`);
  const operatorButton = document.querySelector(`[data-operation="${e.key}"]`);
  if (e.key === "c")
    clearOperations();
  if (errorOccured)
    return;
  if (!isNaN(Number(e.key)))
    appendNumber(numButton);
  if (e.key === "/" || e.key === "*" || e.key === "+" || e.key === "-")
    startOperation(operatorButton);
  if (e.key === ".")
    decimate();
  if (e.key === "Enter") {
    if (operationStarted)
      endOperation();
  }
});
clearButton.addEventListener("click", clearOperations);
function clearOperations() {
  if (operationContainer.innerHTML === "")
    return;
  operationContainer.innerHTML = "";
  operators = [];
  operands = [];
  currentOperation = [];
  justOperated = false;
  errorOccured = false;
  disabledButtons(false);
  console.clear();
}
numberButtons.forEach((button) => {
  button.addEventListener("click", () => {
    appendNumber(button);
  });
});
function appendNumber(button) {
  if (operationContainer.innerHTML === "" && button.innerHTML === "0")
    return;
  if (checkCharacters())
    return;
  operationContainer.innerHTML += button.innerHTML;
  if (decimal) {
    operators = [];
    if (negated) {
      const getdecimal = operationContainer.innerHTML.substring(operationContainer.innerHTML.indexOf("???") + 1);
      operators.push(Number(getdecimal));
    } else
      operators.push(Number(operationContainer.innerHTML));
  } else {
    operators.push(Number(button.innerHTML));
  }
}
operatorButtons.forEach((button) => {
  button.addEventListener("click", () => {
    startOperation(button);
  });
});
function startOperation(button) {
  if (operationContainer.innerHTML === "")
    return;
  if (checkCharacters())
    return;
  if (justOperated) {
    operands.push(Number(operationContainer.innerHTML));
    operationContainer.innerHTML += chooseOperation(button.dataset.btnOperation);
  } else {
    operationContainer.innerHTML += chooseOperation(button.dataset.btnOperation);
    if (decimal) {
      if (negated)
        operands.push(operators[0] * -1);
      else
        operands.push(operators[0]);
      decimal = false;
    } else {
      if (operationContainer.innerHTML.includes("???"))
        negated = true;
      if (operators.length > 1) {
        if (negated)
          operands.push(Number(concatNums(operators, negated)));
        else
          operands.push(Number(concatNums(operators)));
      } else {
        if (negated)
          operands.push(-operators[0]);
        else
          operands.push(operators[0]);
      }
    }
    negated = false;
    operators = [];
  }
  operationStarted = true;
}
function chooseOperation(dataset) {
  switch (dataset) {
    case "divide": {
      currentOperation.push("div");
      currentOperation.push("/");
      return ` ${currentOperation[1]} `;
    }
    case "multiply": {
      currentOperation.push("mul");
      currentOperation.push("*");
      return ` ${currentOperation[1]} `;
    }
    case "plus": {
      currentOperation.push("add");
      currentOperation.push("+");
      return ` ${currentOperation[1]} `;
    }
    case "minus": {
      currentOperation.push("sub");
      currentOperation.push("-");
      return ` ${currentOperation[1]} `;
    }
  }
}
squareRootButton.addEventListener("click", () => {
  if (operationContainer.innerHTML === "")
    return;
  if (checkCharacters())
    return;
  const value = Number(operationContainer.innerHTML);
  if (Math.sqrt(value) % 1 > 0) {
    if (value < 0) {
      operationContainer.innerHTML = "Invalid";
      disabledButtons(true);
    } else
      operationContainer.innerHTML = Math.sqrt(value).toFixed(2).toString();
  } else {
    if (value < 0) {
      operationContainer.innerHTML = "Invalid";
      disabledButtons(true);
    } else
      operationContainer.innerHTML = Math.sqrt(value).toString();
  }
});
squareButton.addEventListener("click", () => {
  if (operationContainer.innerHTML === "")
    return;
  if (checkCharacters())
    return;
  if (operationContainer.innerHTML.substring(operationContainer.innerHTML.indexOf(".")) === ".")
    return;
  const value = Number(operationContainer.innerHTML);
  if (value * value % 1 > 0) {
    if (value < 0)
      operationContainer.innerHTML = (-value * -value).toFixed(2).toString();
    else
      operationContainer.innerHTML = (value * value).toFixed(2).toString();
  } else {
    if (value < 0)
      operationContainer.innerHTML = (-value * -value).toString();
    else
      operationContainer.innerHTML = (value * value).toString();
  }
});
negateButton.addEventListener("click", () => {
  const last = operationContainer.innerHTML.charAt(operationContainer.innerHTML.length - 1);
  if (last === "???")
    return;
  operationContainer.innerHTML += "???";
  negated = true;
});
decimalButton.addEventListener("click", () => {
  decimate();
});
function decimate() {
  if (operationContainer.innerHTML === "")
    return;
  const last = operationContainer.innerHTML.charAt(operationContainer.innerHTML.length - 1);
  if (last === ".")
    return;
  operationContainer.innerHTML += ".";
  decimal = true;
}
equalButton.addEventListener("click", () => {
  endOperation();
});
function endOperation() {
  if (operationContainer.innerHTML === "")
    return;
  if (checkCharacters())
    return;
  if (decimal) {
    if (negated) {
      const getdecimalButton = operationContainer.innerHTML.substring(operationContainer.innerHTML.indexOf(currentOperation[1]) + 3);
      operands.push(Number(getdecimalButton) * -1);
    } else {
      const getdecimalButton = operationContainer.innerHTML.substring(operationContainer.innerHTML.indexOf(currentOperation[1]) + 1);
      operands.push(Number(getdecimalButton));
    }
  } else {
    const splitOperation = operationContainer.innerHTML.substring(operationContainer.innerHTML.indexOf(currentOperation[1]));
    if (splitOperation.includes("???"))
      negated = true;
    if (operators.length > 1) {
      if (negated)
        operands.push(Number(concatNums(operators, negated)));
      else
        operands.push(Number(concatNums(operators)));
      operators = [];
    } else {
      if (negated)
        operands.push(-operators[0]);
      else
        operands.push(operators[0]);
    }
  }
  switch (currentOperation[0]) {
    case "div":
      completeOperation(operands[0] / operands[1]);
      break;
    case "mul":
      completeOperation(operands[0] * operands[1]);
      break;
    case "add":
      completeOperation(operands[0] + operands[1]);
      break;
    case "sub":
      completeOperation(operands[0] - operands[1]);
      break;
  }
  operands = [];
  operators = [];
  currentOperation = [];
  negated = false;
  decimal = false;
}
function completeOperation(operation) {
  if (checkOperationReturn(operation))
    return;
  if (operation.toString().includes(".")) {
    const behindDecimalButton = operation.toString().substring(operation.toString().indexOf(".") + 1);
    const firstTwo = behindDecimalButton.substring(0, 2);
    if (firstTwo === "00") {
      operationContainer.innerHTML = toFixed(operation, 4);
    } else {
      operationContainer.innerHTML = toFixed(operation, 2);
    }
  } else {
    operationContainer.innerHTML = operation.toString();
  }
  justOperated = true;
}
function concatNums(operators2, negated2, decimated) {
  let concat = "";
  for (let i = 0; i < operators2.length; i++)
    concat += operators2[i].toString();
  if (negated2)
    return `-${concat}`;
  if (decimated)
    return `${operators2[0]}.${operators2[1]}`;
  return concat;
}
function toFixed(num, fixed) {
  var re = new RegExp("^-?\\d+(?:.\\d{0," + (fixed || -1) + "})?");
  return num.toString().match(re)[0];
}
function checkCharacters() {
  if (operationContainer.scrollWidth > operationContainer.clientWidth) {
    operationContainer.innerHTML = "Too many numbers";
    disabledButtons(true);
    errorOccured = true;
    return true;
  } else {
    return false;
  }
}
function checkOperationReturn(operation) {
  if (isNaN(operation)) {
    operationContainer.innerHTML = "Invalid Operation";
    disabledButtons(true);
    errorOccured = true;
    return true;
  } else {
    return false;
  }
}
function disabledButtons(enableOrDisable) {
  numberButtons.forEach((button) => {
    button.disabled = enableOrDisable;
  });
  operatorButtons.forEach((button) => {
    button.disabled = enableOrDisable;
  });
  const btns = [squareRootButton, negateButton, squareButton, decimalButton, equalButton];
  for (let i = 0; i < 5; i++) {
    btns[i].disabled = enableOrDisable;
  }
}
