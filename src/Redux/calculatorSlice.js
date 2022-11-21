import { createSlice } from "@reduxjs/toolkit";

const allOperants = /[\/\*\-\+\u221a\^]$/;
const endsWithOperant = /[\/\*\-\+\u221a\^]+$/;
const multiOperantsRegex = /([\/\*\-\+\u221a\^]{2,})([\/\*\-\+\u221a\^]+)/g;
const negativeIntRegex = /([\/\*\-\+]{1})(\-)(\d[\\.\d]*)/g;
const squereRegex = /(\u221a)(\d[\\.\d]*)/g;
const powerRegex = /(\d[\\.\d]*)(\^)(\d[\\.\d]*)/g;
const percentRegex1 = /(\d*[\\.\d]*||\(\d*[\\.\d]*\*\*\d*[\\.\d]*\)||\(\d*[\\.\d]*\*\*\(1\/2\)\))([\-\+]+)(\d+[\\.\d]*)(%)/g;
const percentRegex2 = /(\d*[\\.\d]*||\(\d*[\\.\d]*\*\*\d*[\\.\d]*\)||\(\d*[\\.\d]*\*\*\(1\/2\)\))([\/\*]+)(\d+[\\.\d]*)(%)/g;

const initialState = {
    formula: "0",
    lastInput: "",
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
            let replacedFormula = state.formula.replaceAll(squereRegex, "($2**(1/2))")
                .replaceAll(powerRegex, "($1**$3)")
                .replace(/^(\d[\\.\d]*)(%)$/, "$1/100")
                .replaceAll(percentRegex1, "$1$2($1*($3/100))")
                .replaceAll(percentRegex2, "($1$2($3/100))")
                .replaceAll(negativeIntRegex, "$1(0-$3)")
                .replaceAll(multiOperantsRegex, "$2");
                            
            try {
                let result = 1e10 * (new Function(`return ${replacedFormula}`))().toFixed(4) / 1e10;
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
            let value = action.payload
            let lastValue = state.lastInput
            if (lastValue === "0" && value === ".") {
                state.formula += value
                state.lastInput = value
            } else if (lastValue !== value && value === ".") {
                state.isDisabled = true;
                Number.isFinite(+lastValue) ? state.formula += value : state.formula += "0.";
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