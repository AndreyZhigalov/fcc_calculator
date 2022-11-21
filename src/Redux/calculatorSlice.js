import { createSlice } from "@reduxjs/toolkit";

const basicOperants = /[\/\*\-\+]/;
const allOperants = /[\/\*\-\+\√\^\.]/
const endsWithOperant = /[\/\*\-\+\√\^\.]+$/
const multiOperants = /([\/\*\-\+\√\^\.])([\/\*\-\+\√\^\.]{1,})([\/\*\-\+\√\^\.])/g
const negativeIntRegex = /([\/\*\-\+]{1})(\-)(\d[\.\d]*)/g
const powerRegex = /(√)(\d[\.\d]*)/g
const percentRegex = /\d[\.\d]*[\/\*\-\+]*\d*[\.\d]*%/;
const intRegex = /\d[\.\d]*/

const initialState = {
    formula: "0",
    lastInput: "",
    isError: false,
    isInfinity: false,
    isDisabled: false,
    buttonsData: [
        { id: "percent", value: "%", text: "%" },
        { id: "powers", value: "^", text: "x^" },
        { id: "radix", value: "√", text: "√x" },
        { id: "divide", value: "/", text: "/" },
        { id: "seven", value: "7", text: "7" },
        { id: "eight", value: "8", text: "8" },
        { id: "nine", value: "9", text: "9" },
        { id: "multiply", value: "*", text: "X" },
        { id: "four", value: "4", text: "4" },
        { id: "five", value: "5", text: "5" },
        { id: "six", value: "6", text: "6" },
        { id: "subtract", value: "-", text: "-" },
        { id: "one", value: "1", text: "1" },
        { id: "two", value: "2", text: "2" },
        { id: "three", value: "3", text: "3" },
        { id: "add", value: "+", text: "+" },
        { id: "clear", value: "AC", text: "AC" },
        { id: "zero", value: "0", text: "0" },
        { id: "decimal", value: ".", text: "." },
        { id: "equals", value: "=", text: "=" },
    ]
}

const calculatorSlice = createSlice({
    name: "calculator",
    initialState,
    reducers: {
        evaluate(state) {
            let replacedFormula = state.formula.replaceAll(/\^/g, "**")
                .replaceAll(powerRegex, "$2**(1/2)")
                .replaceAll(multiOperants, "$3")
                .replaceAll(negativeIntRegex, "$1($2$3)")

            while (replacedFormula.match(percentRegex)) { // ПРОЦЕНТЫ
                let matches = replacedFormula.match(percentRegex);
                let firstInt = matches[0].match(intRegex)[0]
                let percentInt = matches[0].match(/\d[\.\d]*%/)[0].slice(0, -1)
                let operator = matches[0].match(basicOperants) && matches[0].match(basicOperants)[0]
                let startIndex = matches.index

                if (!operator && startIndex == 0) {
                    replacedFormula = `${percentInt / 100}` + replacedFormula.slice(matches[0].length);
                } else if (operator && operator.match(/[\+\-]+/)) {
                    replacedFormula = replacedFormula.slice(0, startIndex) + firstInt + operator + `${firstInt * (percentInt / 100)}` + replacedFormula.slice(startIndex + matches[0].length);
                } else {
                    replacedFormula = replacedFormula.slice(0, startIndex) + firstInt + operator + `${percentInt / 100}` + replacedFormula.slice(startIndex + matches[0].length);
                }
            }

            try {
                let result = 10000000000000 * (new Function(`return ${replacedFormula}`))() / 10000000000000
                if (result === Infinity) {
                    state.formula = "Бесконечность"
                } else if (isNaN(result)) {
                    state.formula = "ゴゴゴゴゴゴゴゴゴゴ"
                } else {
                    state.formula = result
                }
            } catch (error) {
                state.formula = "ゴゴゴゴゴゴゴゴゴゴ"
            }

        },
        getInput(state, action) {
            const value = action.payload
            const lastValue = state.lastInput
            if (lastValue === "0" && value === ".") {
                state.formula += value
                state.lastInput = value
            } else if (lastValue !== value && value === ".") {
                allOperants.test(lastValue) ? state.formula += "0." : state.formula += value
                state.isDisabled = true
                state.lastInput = value
            } else if (lastValue === "." && value === ".") {
                state.isDisabled = true
            } else if (state.formula === "0") {
                state.formula = value
                state.lastInput = value
            } else if (allOperants.test(value)) {
                state.isDisabled = false
                if (value === "-" && state.formula.match(endsWithOperant)?.[0].length < 2) {
                    state.formula += value
                    state.lastInput = value
                } else if (value === "+" && lastValue === "+") {

                } else {
                    state.formula += value
                    state.lastInput = value
                }
            } else {
                state.formula += value
                state.lastInput = value
            }

        },
        clear(state) {
            state.formula = "0"
            state.lastInput = ""
            state.isDisabled = false
        },

    }
})

export const { getInput, evaluate, clear } = calculatorSlice.actions
export default calculatorSlice.reducer