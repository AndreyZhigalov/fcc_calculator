import React from "react"
import { useSelector, useDispatch } from "react-redux";

import { getInput, clear, evaluate } from "./Redux/calculatorSlice"

import styles from "./index.module.scss"

function App() {
  const { formula, buttonsData, isDisabled } = useSelector(state => state.calculatorSlice)
  const dispatch = useDispatch()
  const [clacStyle, setCalcStile] = React.useState()

  const onClickButton = (value) => {
    if (value === "AC") {
      dispatch(clear())
    } else if (value === "=") {
      dispatch(evaluate())
    } else {
      dispatch(getInput(value))
    }
  }

  const toggleCalcStyle = () => {
    setCalcStile(!clacStyle)
  }

  return (
    <div className={styles.App}>
      <div className={clacStyle ? styles.calculator : styles.calculator2} id="speedwagon" >
        <button className={clacStyle ? styles.toggler : `${styles.toggler} ${styles.off}`} onClick={toggleCalcStyle} />
        <div className={styles.keyboard}>
          <div className={styles.screen} id="display">{formula}</div>
          {buttonsData.map(({ text, value, id }) =>
            <button type="button"
              onClick={() => onClickButton(value)}
              key={id}
              className={styles.button}
              id={id}
              disabled={value === "." && isDisabled}
              value={value}>{text}
            </ button >)
          }
        </div >
      </div >
    </div >
  );
}

export default App;
