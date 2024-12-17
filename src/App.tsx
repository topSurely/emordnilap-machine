import { useState } from "react"
import MachineStage from "./Stage"
import { Palindromes } from "./palindromes";

function App() {

  const [textValue, setTextValue] = useState<string>("PALINDROME");

  return (
    <>
      <div style={{ marginTop: "2rem" }}>
        <p style={{ textAlign: "center" }}>Simple drag at either end of the bar to rotate your word. Select a preset or type in your own!</p>
        <div style={{
          display: "flex",
          justifyContent: "center"
        }}>

          <input value={textValue} style={{ position: "absolute", fontSize: "2rem" }}
            onChange={(e) => {
              setTextValue(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
            }} />
          <MachineStage text={textValue} height={500} width={1000} />
        </div>
        <div style={{ textAlign: "center" }}>
          {Palindromes.map((v) => {
            return <button onClick={() => setTextValue(v)}>{v}</button>
          })}
        </div>
      </div>
    </>
  )
}

export default App