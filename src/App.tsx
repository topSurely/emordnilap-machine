import { useState } from "react"
import MachineStage from "./Stage"
import { Palindromes } from "./palindromes";

function App() {

  const [textValue, setTextValue] = useState<string>("PALINDROME");

  return (
    <>
      <div>
        <input value={textValue} style={{ position: "absolute" }}
          onChange={(e) => {
            setTextValue(e.target.value.replace(/[^a-zA-Z]/g, "").toUpperCase())
          }} />
        <MachineStage text={textValue} height={500} width={1000} />
      </div>
      <div>
        {Palindromes.map((v) => {
          return <button onClick={() => setTextValue(v)}>{v}</button>
        })}
      </div>
    </>
  )
}

export default App
