"use client"

import { useState } from "react"
import { submitSupportMessage } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Send, LifeBuoy } from "lucide-react"
import { Link } from "react-router-dom"

export default function SupportPage() {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    async function handleSubmit(formData: FormData) {
        setIsSubmitting(true)

        const result = await submitSupportMessage(formData)

        if (result.error) {
            toast.error(result.error)
            setIsSubmitting(false)
        } else {
            toast.success("Message sent successfully")
            setIsSuccess(true)
            setIsSubmitting(false)
        }
    }

    return (
        <div className="container py-6 sm:py-8 max-w-7xl mx-auto px-4 md:px-6 flex justify-center items-center min-h-[calc(100vh-4rem)]">
            <div className="w-full max-w-2xl min-w-0">
                <div className="mb-6 sm:mb-8 flex flex-col gap-2">
                    <h1 className="inline-block text-2xl sm:text-4xl md:text-5xl font-black tracking-tight">
                        <span className="bg-yellow-300 border-4 border-black px-3 py-1.5 sm:px-4 sm:py-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] inline-block -rotate-1">
                            SUPPORT
                        </span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg font-bold mt-2 sm:mt-4">
                        Having issues? Send a message to our admin team and we&apos;ll help you out.
                    </p>
                    <div className="mt-3 sm:mt-4 flex flex-wrap gap-3 sm:gap-4">
                        <Link to="/support/tickets">
                            <Button className="font-bold border-2 border-black bg-cyan-200 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all text-sm sm:text-base w-full sm:w-auto">
                                View My Tickets
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none">
                    <CardHeader className="bg-cyan-50 border-b-4 border-black p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="bg-white p-2 border-2 border-black shrink-0">
                                <LifeBuoy className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                            <div className="min-w-0">
                                <CardTitle className="text-xl sm:text-2xl font-black uppercase">Submit a Request</CardTitle>
                                <CardDescription className="font-bold text-black text-sm sm:text-base">
                                    Fill out the form below to contact support.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6">
                        {isSuccess ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center bg-green-50 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                <div className="bg-green-400 p-4 border-4 border-black rounded-full mb-4">
                                    <Send className="w-8 h-8 text-black" />
                                </div>
                                <h3 className="text-2xl font-black mb-2">Message Sent!</h3>
                                <p className="font-bold text-muted-foreground mb-6 max-w-md">
                                    Your support request has been received. Our team will review it and get back to you shortly.
                                </p>
                                <Button 
                                    onClick={() => setIsSuccess(false)}
                                    className="font-bold border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                                >
                                    Send Another Message
                                </Button>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="subject" className="font-bold text-base">Subject</Label>
                                    <Input 
                                        id="subject" 
                                        name="subject" 
                                        placeholder="Briefly describe your issue..." 
                                        required
                                        className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium h-12"
                                    />
                                </div>
                                
                                <div className="space-y-2">
                                    <Label htmlFor="message" className="font-bold text-base">Message Details</Label>
                                    <Textarea 
                                        id="message" 
                                        name="message" 
                                        placeholder="Please provide as much detail as possible so we can best assist you..." 
                                        required
                                        className="border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-medium min-h-[200px] resize-y"
                                    />
                                </div>

                                <Button 
                                    type="submit" 
                                    disabled={isSubmitting}
                                    className="w-full h-12 text-lg font-black uppercase tracking-wider bg-pink-400 hover:bg-pink-500 text-black border-4 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 hover:translate-x-1 transition-all"
                                >
                                    {isSubmitting ? "Sending..." : "Submit Request"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
