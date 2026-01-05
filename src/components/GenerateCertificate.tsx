import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type GenerateCertificateProps = {
    score: string
}

export default function GenerateCertificate({ score }: GenerateCertificateProps) {
    const [name, setName] = useState("")
    const [userImage, setUserImage] = useState<string | null>(null)

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        const reader = new FileReader()
        reader.onloadend = () => {
            setUserImage(reader.result as string)
        }
        reader.readAsDataURL(file)
    }

    const generateCertificate = async () => {
        try {
            const canvas = document.createElement("canvas")
            const ctx = canvas.getContext("2d")

            if (!ctx) {
                throw new Error("Canvas indisponibil")
            }

            // High resolution for print-quality PNG
            canvas.width = 1200
            canvas.height = 850

            /* ---------------- Background ---------------- */
            ctx.fillStyle = "#f8f4ec"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Decorative border
            ctx.strokeStyle = "#8b0000"
            ctx.lineWidth = 12
            ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40)

            /* ---------------- Header ---------------- */
            ctx.fillStyle = "#8b0000"
            ctx.font = "bold 52px serif"
            ctx.textAlign = "center"
            ctx.fillText("CERTIFICAT OFICIAL", canvas.width / 2, 120)

            /* ---------------- Body text ---------------- */
            ctx.fillStyle = "#000"
            ctx.font = "26px serif"
            ctx.fillText("Se acordă prezentul certificat lui:", canvas.width / 2, 260)

            ctx.font = "bold 40px serif"
            ctx.fillText(name, canvas.width / 2, 320)

            ctx.font = "26px serif"
            ctx.fillText(
                "pentru finalizarea cu succes a testului",
                canvas.width / 2,
                380
            )

            ctx.font = "italic 30px serif"
            ctx.fillText(
                "„Stângometrului”",
                canvas.width / 2,
                420
            )

            ctx.font = "bold 34px serif"
            ctx.fillText(
                `Scor obținut: ${score}`,
                canvas.width / 2,
                490
            )

            /* ---------------- Date ---------------- */
            const issuedAt = new Date().toLocaleDateString("ro-RO", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })

            ctx.font = "22px serif"
            ctx.fillText(
                `Data emiterii: ${issuedAt}`,
                canvas.width / 2,
                560
            )

            /* ---------------- User Image ---------------- */
            if (userImage) {
                const img = new Image()
                img.src = userImage

                await new Promise<void>((resolve) => {
                    img.onload = () => {
                        const size = 160
                        const x = canvas.width / 2 - size / 2
                        const y = 610

                        ctx.save()
                        ctx.beginPath()
                        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                        ctx.closePath()
                        ctx.clip()

                        ctx.drawImage(img, x, y, size, size)
                        ctx.restore()

                        ctx.strokeStyle = "#8b0000"
                        ctx.lineWidth = 4
                        ctx.beginPath()
                        ctx.arc(x + size / 2, y + size / 2, size / 2, 0, Math.PI * 2)
                        ctx.stroke()

                        resolve()
                    }
                })
            }

            /* ---------------- Download ---------------- */
            const link = document.createElement("a")
            link.download = `certificat-stangometru-${name || "anonim"}.png`
            link.href = canvas.toDataURL("image/png")
            link.click()

        } catch (error) {
            console.error("Eroare la generarea certificatului:", error)
            alert("A apărut o eroare la generarea certificatului.")
        }
    }

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nume</Label>
                <Input
                    id="name"
                    type="text"
                    placeholder="Introdu numele tău"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="image">Imagine</Label>
                <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                />
                {userImage && (
                    <div className="mt-2">
                        <img
                            src={userImage}
                            alt="Preview"
                            className="max-w-32 h-32 object-cover rounded-lg"
                        />
                    </div>
                )}
            </div>

            <Button
                onClick={generateCertificate}
                disabled={!name.trim()}
                size="lg"
                className="w-full"
            >
                Generează și Descarcă Certificatul
            </Button>

            <p className="text-xs text-foreground text-center mt-2">
                Confidențialitate: numele și imaginea sunt procesate exclusiv în browserul tău.
                Nicio informație nu este transmisă, stocată sau salvată.
            </p>
        </div>
    )
}