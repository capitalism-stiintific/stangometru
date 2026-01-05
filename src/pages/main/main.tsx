import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export function MainPage() {
    return (
        <div className="min-h-screen flex items-center justify-center p-4">
            <Card className="max-w-2xl w-full">
                <CardHeader className="text-center space-y-4">
                    <div className="flex justify-center">
                        <img 
                            src={"images/Stangometru.png"} 
                            alt="Stangometru" 
                            className="max-w-md w-full h-auto object-contain"
                        />
                    </div>
                    <CardTitle className="text-3xl font-bold">
                        Bun venit la Testul Stangometrului
                    </CardTitle>
                    <CardDescription className="text-lg">
                    Toți suntem stângiști, dar nu toți stângiștii sunt creați egal. Demonstrează-ți superioritatea ideologică și fă-ți clubul de lectură să pară moderat cu testul Stângometrului.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center pt-6">
                    <Button asChild size="lg" className="text-lg px-8 py-6">
                        <Link to="/test">
                            Începe Testul
                        </Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}


