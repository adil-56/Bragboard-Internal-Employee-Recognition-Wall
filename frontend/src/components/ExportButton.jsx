// frontend/components/ExportButton.jsx
import { exportCSV } from "../services/exportService"

export default function ExportButton() {
  return (
    <button onClick={exportCSV}>
      Export CSV
    </button>
  )
}