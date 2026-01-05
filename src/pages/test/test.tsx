import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import testData from "./test.json"

interface Response {
    text: string
    value: number
}

interface Question {
    type: "single-choice" | "multiple-choice"
    maxSelect?: number;
    photo: string
    question: string
    explanation: string
    responses: Response[]
}

interface TestData {
    questions: Question[]
}

export function TestPage() {
    const navigate = useNavigate()
    const [score, setScore] = useState(0)

    const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number | number[]>>({})

    const testQuestions = (testData as TestData).questions

    const handleSingleChoiceAnswer = (questionIndex: number, value: number, responseIndex: number) => {
        const oldIndex = selectedAnswers[questionIndex] as number | undefined
        if (oldIndex !== undefined) {
            const oldValue = testQuestions[questionIndex].responses[oldIndex].value
            setScore(score - oldValue + value)
        } else {
            setScore(score + value)
        }

        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: responseIndex
        })
    }

    const handleMultipleChoiceAnswer = (questionIndex: number, responseIndex: number) => {
        const question = testQuestions[questionIndex]
        const maxSelect = question.maxSelect ? question.maxSelect : null;

        const selectedIndexes: number[] = Array.isArray(selectedAnswers[questionIndex])
            ? selectedAnswers[questionIndex] as number[]
            : []

        const alreadySelected = selectedIndexes.includes(responseIndex)

        let newSelected: number[]
        let deltaScore = 0

        if (alreadySelected) {
            newSelected = selectedIndexes.filter(i => i !== responseIndex)
            deltaScore = -question.responses[responseIndex].value
        } else {
            if (maxSelect != null && selectedIndexes.length >= maxSelect) {
                return
            }
            newSelected = [...selectedIndexes, responseIndex]
            deltaScore = question.responses[responseIndex].value
        }

        setScore(score + deltaScore)
        setSelectedAnswers({
            ...selectedAnswers,
            [questionIndex]: newSelected
        })
    }

    const handleSubmit = () => {
        navigate('/results', {
            state: { score, selectedAnswers }
        })
    }

    const allQuestionsAnswered = testQuestions.every((q, index) => {
        const answer = selectedAnswers[index]
        if (q.type === "single-choice") return typeof answer === "number"
        if (q.type === "multiple-choice") return Array.isArray(answer) && answer.length > 0
        return false
    })

    return (
        <div className="min-h-screen py-8 px-4">
            <div className="max-w-3xl mx-auto space-y-8">
                {testQuestions.map((question, questionIndex) => {
                    const selectedAnswer = selectedAnswers[questionIndex]

                    return (
                        <Card key={questionIndex} className="w-full">
                            <CardHeader className="text-center space-y-4">
                                {question.photo && (
                                    <div className="flex justify-center">
                                        <img
                                            src={"/stangometru/images/questions/" + question.photo}
                                            alt={question.question}
                                            className="max-w-48 w-full h-auto object-contain rounded-lg"
                                        />
                                    </div>
                                )}
                                <CardTitle className="text-3xl font-bold"><span className="text-pink-500 mr-3">{questionIndex + 1}/{testQuestions.length}</span> {question.question}</CardTitle>
                                <p className="text-md text-pink-500 m-0">
                                    {question.type === "multiple-choice" ? `Răspunsuri multiple! Maxim ${question.maxSelect} răspunsuri.`  : "Un singur răspuns"}
                                </p>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {question.responses.map((response, responseIndex) => {
                                    const isSelected =
                                        question.type === "single-choice"
                                            ? selectedAnswer === responseIndex
                                            : Array.isArray(selectedAnswer) && selectedAnswer.includes(responseIndex)

                                    return (
                                        <Button
                                            key={responseIndex}
                                            variant={isSelected ? "default" : "outline"}
                                            className="w-full justify-start text-left h-auto py-4 px-4 whitespace-normal break-words"
                                            onClick={() =>
                                                question.type === "single-choice"
                                                    ? handleSingleChoiceAnswer(questionIndex, response.value, responseIndex)
                                                    : handleMultipleChoiceAnswer(questionIndex, responseIndex)
                                            }
                                        >
                                            {response.text}
                                        </Button>
                                    )
                                })}
                            </CardContent>
                        </Card>
                    )
                })}

                <div className="flex justify-center pb-8">
                    <Button
                        size="lg"
                        className="text-lg px-8 py-6"
                        onClick={handleSubmit}
                        disabled={!allQuestionsAnswered}
                    >
                        Finalizează Testul
                    </Button>
                </div>
            </div>
        </div>
    )
}