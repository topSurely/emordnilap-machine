import { useState } from "react"
import MachineStage from "./Stage"

function App() {

  const [textValue, setTextValue] = useState<string>("");

  return (
    <>
      <MachineStage text={textValue} height={500} width={1000} />
      <input value={textValue} onChange={(e) => {
        setTextValue(e.target.value.toUpperCase())
      }} />
    </>
  )
}

export default App
