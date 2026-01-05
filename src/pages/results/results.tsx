import { useLocation, Link } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import testData from "../test/test.json"
import resultsData from "./results.json"

import Stangometru from "@/components/Stangometru"
import GenerateCertificate from "@/components/GenerateCertificate"

interface Response {
    text: string
    value: number
}

interface Question {
    type: string
    photo: string
    question: string
    explanation: string
    responses: Response[]
}

interface TestData {
    questions: Question[]
}

interface Result {
    threshold: number
    text: string
    image: string
}

interface ResultsData {
    results: Result[]
}

interface ResultsLocationState {
    score: number
    selectedAnswers: Record<number, number>
}

function getResultForScore(score: number, results: Result[]): Result | null {
    const sortedResults = [...results].sort();
    
    for(const result of sortedResults) {
        if(score < result.threshold) {
            return result
        }
    }
    
    return sortedResults.length > 0 ? sortedResults[sortedResults.length - 1] : null
}

export function ResultsPage() {
    const location = useLocation()
    const state = location.state as ResultsLocationState | null

    if (!state) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <Card className="max-w-2xl w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl font-bold">
                            Nu există rezultate
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-muted-foreground mb-4">
                            Nu s-au găsit rezultate. Te rugăm să completezi testul mai întâi.
                        </p>
                        <Button asChild>
                            <Link to="/test">Înapoi la Test</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    const { score, selectedAnswers } = state
    const testQuestions = (testData as TestData).questions
    const results = (resultsData as ResultsData).results
    const result = getResultForScore(score, results)
    
    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Score Card with Ruler */}
                <Card className="w-full">
                    <CardHeader className="text-center">
                        <CardTitle className="text-4xl font-bold mb-2">
                            Rezultatul Tău: <span className="font-bold text-pink-500">{score > 0 ? `+${(score / 10).toFixed(1)}` : (score / 10).toFixed(1)} cm</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Stangometru score={score} />
                        
                        {/* Result Display */}
                        {result && (
                            <div className="text-center space-y-4">
                                {result.image && (
                                    <div className="flex justify-center">
                                        <img 
                                            src={"/images/results/" + result.image} 
                                            alt={result.text}
                                            className="max-w-48 w-full h-auto object-contain"
                                        />
                                    </div>
                                )}
                                <p className="text-xl font-semibold">
                                    {result.text}
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Certificate Generation */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Generează Certificat
                        </CardTitle>
                        <CardDescription>
                            Completează numele și încarcă o imagine pentru a genera certificatul tău
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <GenerateCertificate score={score > 0 ? `+${(score / 10).toFixed(1)} cm` : `${(score / 10).toFixed(1)} cm`} />
                    </CardContent>
                </Card>

                {/* Questions Review */}
                <Card className="w-full">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold">
                            Răspunsurile tale
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
    {testQuestions.map((question, questionIndex) => {
        const selectedAnswer = selectedAnswers[questionIndex]

        return (
            <div key={questionIndex} className="space-y-6">
                <div className="flex gap-4 items-center">
                    {question.photo && (
                        <img 
                            src={"/images/" + question.photo} 
                            alt={question.question}
                            className="max-w-24 w-full h-auto object-contain rounded-lg shrink-0"
                        />
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">{question.question}</h3>
                        {question.explanation && (
                            <CardDescription className="text-md mt-2 text-pink-500">
                                EXPLICAȚIE: {question.explanation}
                            </CardDescription>
                        )}
                    </div>
                </div>

                                <div className="space-y-2">
                                    {question.responses.map((response, responseIndex) => {
                                        // Check if the response is selected
                                        const isSelected =
                                            question.type === "single-choice"
                                                ? selectedAnswer === responseIndex
                                                : Array.isArray(selectedAnswer) && selectedAnswer.includes(responseIndex)

                                        return (
                                            <div
                                                key={responseIndex}
                                                className={`flex items-center justify-between p-3 rounded-lg border ${
                                                    isSelected
                                                        ? "bg-primary/10 border-primary"
                                                        : "bg-card border-border"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {isSelected && (
                                                        <Badge variant="default" className="text-xs">
                                                            Selectat
                                                        </Badge>
                                                    )}
                                                    <span className={isSelected ? "font-medium" : ""}>
                                                        {response.text}
                                                    </span>
                                                </div>
                                                <Badge
                                                    variant={response.value >= 0 ? "default" : "destructive"}
                                                    className="text-xs"
                                                >
                                                    {response.value > 0 ? "+" : ""}{response.value}
                                                </Badge>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </CardContent>
                </Card>

                {/* Back to Home Button */}
                <div className="flex justify-center pt-4">
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link to="/">Înapoi la Pagina Principală</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
