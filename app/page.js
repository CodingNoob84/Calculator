"use client";

import Image from "next/image";
import { TbPlusMinus, TbSquareRoot, TbDivide } from "react-icons/tb";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { useRef, useState } from "react";
import ReactDOMServer from "react-dom/server";
import ReactDOM from "react-dom";
const TbSquareRootIcon = <TbSquareRoot />;
const keyvalues = [
  "(",
  ")",
  "ans",
  "del",
  "clear",
  "7",
  "8",
  "9",
  "%",
  "^",
  "4",
  "5",
  "6",
  "x",
  "/",
  "1",
  "2",
  "3",
  "+",
  "-",
  ".",
  "0",
  "$",
  "Enter",
];

function evaluateExpression(expression) {
  expression = removeTrailingOperators(expression);
  const tokens = tokenizeExpression(expression);
  const precedence = {
    "+": 1,
    "-": 1,
    "*": 2,
    "/": 2,
    "%": 2,
    "^": 3,
    sqrt: 4, // Adding square root operator with higher precedence
  };
  const numberStack = [];
  const operatorStack = [];

  for (const token of tokens) {
    if (!isNaN(token)) {
      numberStack.push(parseFloat(token));
    } else if (token in precedence) {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "(" &&
        precedence[operatorStack[operatorStack.length - 1]] >= precedence[token]
      ) {
        const operator = operatorStack.pop();
        if (operator === "sqrt") {
          const operand = numberStack.pop();
          const result = applyOperator(operand, operator);
          numberStack.push(result);
        } else {
          const operand2 = numberStack.pop();
          const operand1 = numberStack.pop();
          const result = applyOperator(operand1, operand2, operator);
          numberStack.push(result);
        }
      }
      operatorStack.push(token);
    } else if (token === "(") {
      operatorStack.push(token);
    } else if (token === ")") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] !== "("
      ) {
        const operator = operatorStack.pop();
        if (operator === "sqrt") {
          const operand = numberStack.pop();
          const result = applySqrtOperator(operand);
          numberStack.push(result);
        } else {
          const operand2 = numberStack.pop();
          const operand1 = numberStack.pop();
          const result = applyOperator(operand1, operand2, operator);
          numberStack.push(result);
        }
      }
      if (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1] === "("
      ) {
        operatorStack.pop();
      }
    }
  }

  while (operatorStack.length > 0) {
    const operator = operatorStack.pop();
    if (operator === "sqrt") {
      const operand = numberStack.pop();
      const result = applySqrtOperator(operand);
      numberStack.push(result);
    } else {
      const operand2 = numberStack.pop();
      const operand1 = numberStack.pop();
      const result = applyOperator(operand1, operand2, operator);
      numberStack.push(result);
    }
  }

  return numberStack[0].toFixed(4);
}

function removeTrailingOperators(expression) {
  const operators = ["+", "-", "*", "/", "%", "^"];
  let i = expression.length - 1;

  while (i >= 0 && operators.includes(expression[i])) {
    i--;
  }

  return expression.substring(0, i + 1);
}

function applyOperator(operand1, operand2, operator) {
  switch (operator) {
    case "+":
      return operand1 + operand2;
    case "-":
      return operand1 - operand2;
    case "*":
      return operand1 * operand2;
    case "/":
      return operand1 / operand2;
    case "%":
      return operand1 % operand2;
    case "^":
      return Math.pow(operand1, operand2);
    case "sqrt":
      return Math.sqrt(operand2);
    default:
      throw new Error("Invalid operator");
  }
}

function applySqrtOperator(operand) {
  return Math.sqrt(operand);
}

function tokenizeExpression(expression) {
  const tokens = [];
  let currentToken = "";

  for (const char of expression) {
    if (isOperator(char) || isBracket(char)) {
      if (currentToken !== "") {
        tokens.push(currentToken);
      }
      tokens.push(char);
      currentToken = "";
    } else if (char !== " ") {
      currentToken += char;
    }
  }

  if (currentToken !== "") {
    tokens.push(currentToken);
  }

  return tokens;
}

function isOperator(char) {
  return ["+", "-", "*", "/", "%", "^", "sqrt"].includes(char);
}

function isBracket(char) {
  return ["(", ")"].includes(char);
}

function GetTotal(value1, value2, operator) {
  let total;

  switch (operator) {
    case "+":
      total = value1 + value2;
      break;
    case "-":
      total = value1 - value2;
      break;
    case "*":
      total = value1 * value2;
      break;
    case "/":
      total = value1 / value2;
      break;
    case "%":
      total = value1 % value2;
      break;
    default:
      console.log("Invalid operator");
      break;
  }

  return total;
}

function removeLastLetterIfMatch(str, letter) {
  if (str.slice(-1) === letter) {
    return str.slice(0, -1);
  }
  return str;
}

export default function Home() {
  const [total, setTotal] = useState(0);
  const [lastOperator, setLastOperator] = useState();
  const [gotResult, setGotResult] = useState(false);
  const inputref = useRef();
  const hiddeninputref = useRef();
  const displayref = useRef();

  const handleDelete = () => {
    const val = inputref.current.value.slice(0, -1);
    inputref.current.value = val;
  };

  const handleClear = () => {
    inputref.current.value = "";
    displayref.current.innerHTML = "";
    hiddeninputref.current.value = "";
    setTotal(0);
  };

  const handleAppend = (val) => {
    if (!gotResult) {
      const prevVal = inputref.current.value;
      inputref.current.value = `${prevVal}${val}`;
    } else {
      displayref.current.innerHTML = "";
      hiddeninputref.current.value = "";
      inputref.current.value = `${val}`;
      setGotResult(false);
    }
  };

  const handleOperations = (operations) => {
    setGotResult(false);
    const prevVal = inputref.current.value;
    console.log("value", prevVal);
    const hdnDisp = hiddeninputref.current.value;
    const disp = displayref.current.innerHTML;
    console.log(disp);
    if (operations === "sqrt") {
      const iconMarkup = ReactDOMServer.renderToString(<TbSquareRoot />);
      hiddeninputref.current.value = `${hdnDisp}${prevVal} sqrt(`;
      displayref.current.innerHTML = `${disp}${prevVal} ${iconMarkup}(`;
    } else {
      displayref.current.innerHTML = `${disp} ${prevVal} ${operations}`;
      hiddeninputref.current.value = `${hdnDisp} ${prevVal} ${operations}`;
    }
    inputref.current.value = "";
  };

  const handleResult = () => {
    setGotResult(true);
    const prevVal = inputref.current.value;
    const hdnDisp = hiddeninputref.current.value;
    console.log("hidnDisp", hdnDisp);
    const disp = displayref.current.innerHTML;
    if (prevVal === "") {
      displayref.current.innerHTML = `${removeLastLetterIfMatch(
        disp,
        lastOperator
      )}=`;
      const result = evaluateExpression(hdnDisp);
      console.log(result);
      inputref.current.value = `${result}`;
    } else {
      const result = evaluateExpression(`${hdnDisp}${prevVal}`);
      console.log(result);
      displayref.current.innerHTML = `${disp}${prevVal}=`;
      inputref.current.value = `${result}`;
    }
  };

  const appendIconToString = () => {
    const iconElement = <TbSquareRoot />;
    const existingContent = displayref.current.innerHTML;
    console.log(existingContent);
    const iconMarkup = ReactDOMServer.renderToString(iconElement);
    displayref.current.innerHTML = `${existingContent} ${iconMarkup}(`;
    console.log(`${existingContent} ${iconMarkup}(`);
    //displayref.current.innerHTML = `hi ${ReactDOM.render(iconElement)}`;
  };

  const handleExpression = () => {
    const result = evaluateExpression("sqrt(25)");
    console.log(result);
  };
  console.log(total);
  return (
    <main className="flex w-screen h-screen justify-center items-center">
      <div className="flex flex-col w-[340px] h-[390px] bg-blue-300 rounded-lg">
        <div className="border bg-blue-200 h-[80px] m-[20px]">
          <div
            ref={displayref}
            className="flex flex-row h-[30px] w-[300px] bg-blue-200 "
          ></div>
          <input ref={hiddeninputref} type="hidden" />
          <input
            type="text"
            ref={inputref}
            className="text-3xl text-right w-[300px] h-[50px] bg-blue-200"
          />
        </div>
        <div className="border bg-blue-200 h-[250px] mx-[20px]">
          <div className="grid grid-cols-5 gap-2 m-1">
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("(")}
            >
              {`(`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations(")")}
            >
              {`)`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("^")}
            >
              {`^`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleDelete()}
            >
              {`Del`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleClear()}
            >
              {`Clr`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("7")}
            >
              {`7`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("8")}
            >
              {`8`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("9")}
            >
              {`9`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("%")}
            >
              {`%`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("sqrt")}
              //onClick={() => appendIconToString()}
            >
              <TbSquareRoot />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("4")}
            >
              {`4`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("5")}
            >
              {`5`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("6")}
            >
              {`6`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("/")}
            >
              <TbDivide />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("*")}
            >
              <IoClose />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("1")}
            >
              {`1`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("2")}
            >
              {`2`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("3")}
            >
              {`3`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("-")}
            >
              {`-`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleOperations("+")}
            >
              {`+`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend(".")}
            >
              {`.`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-300 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleAppend("0")}
            >
              {`0`}
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-400 flex justify-center items-center cursor-pointer rounded-md w-[50px] h-[40px]"
              onClick={() => handleExpression()}
            >
              <TbPlusMinus />
            </motion.div>
            <motion.div
              whileTap={{ scale: 0.7 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
              className="bg-red-500 row-span-2 flex justify-center cursor-pointer items-center rounded-md w-[110px] h-[40px]"
              onClick={() => handleResult()}
            >
              {`Enter`}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
}
