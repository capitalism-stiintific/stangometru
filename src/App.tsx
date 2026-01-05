
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { MainPage } from "@/pages/main/main"
import { TestPage } from "@/pages/test/test"
import { ResultsPage } from "@/pages/results/results"

export function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="/test" element={<TestPage />} />
                <Route path="/results" element={<ResultsPage />} />
            </Routes>
        </BrowserRouter>
    )
}

export default App;