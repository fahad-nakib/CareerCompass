"use client"

import type React from "react"

import { useState } from "react"
import Layout from "@/components/Layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { CreditCard, Smartphone, CheckCircle, AlertCircle } from "lucide-react"

// Mock payment data
const mockPaymentHistory = [
  {
    id: "payment_1",
    amount: 500,
    currency: "BDT",
    description: "Application Fee - Master of Computer Science",
    status: "completed",
    date: "2023-10-15T14:30:00Z",
    paymentMethod: "bKash",
    transactionId: "TXN123456789",
  },
  {
    id: "payment_2",
    amount: 1000,
    currency: "BDT",
    description: "Registration Fee - Bachelor of Business Administration",
    status: "completed",
    date: "2023-09-22T10:15:00Z",
    paymentMethod: "bKash",
    transactionId: "TXN987654321",
  },
  {
    id: "payment_3",
    amount: 750,
    currency: "BDT",
    description: "Document Verification Fee",
    status: "pending",
    date: "2023-10-28T09:45:00Z",
    paymentMethod: "bKash",
    transactionId: "TXN567891234",
  },
]

const StudentPayment = () => {
  const { toast } = useToast()
  const [paymentMethod, setPaymentMethod] = useState("bkash")
  const [paymentAmount, setPaymentAmount] = useState("")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [transactionId, setTransactionId] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState(mockPaymentHistory)

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!paymentAmount || !phoneNumber || !transactionId) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      const newPayment = {
        id: `payment_${Date.now()}`,
        amount: Number.parseFloat(paymentAmount),
        currency: "BDT",
        description: "Manual Payment",
        status: "completed",
        date: new Date().toISOString(),
        paymentMethod: paymentMethod,
        transactionId: transactionId,
      }

      setPaymentHistory([newPayment, ...paymentHistory])

      toast({
        title: "Payment successful",
        description: "Your payment has been processed successfully.",
      })

      // Reset form
      setPaymentAmount("")
      setPhoneNumber("")
      setTransactionId("")
      setIsProcessing(false)
    }, 2000)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-studyportal-blue">Payments</h1>
            <p className="text-gray-600 mt-2">Manage your payments and view transaction history</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Make Payment */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Make a Payment
                </CardTitle>
                <CardDescription>Pay fees using bKash mobile payment</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePaymentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="payment-amount">Payment Amount (BDT)</Label>
                    <Input
                      id="payment-amount"
                      type="number"
                      placeholder="Enter amount"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Payment Method</Label>
                    <RadioGroup defaultValue="bkash" value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="bkash" id="bkash" />
                        <Label htmlFor="bkash" className="flex items-center">
                          <img src="/bkash-logo.png" alt="bKash" className="h-6 w-6 mr-2" />
                          bKash
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone-number">bKash Phone Number</Label>
                    <Input
                      id="phone-number"
                      placeholder="e.g. 01XXXXXXXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Transaction ID</Label>
                    <Input
                      id="transaction-id"
                      placeholder="Enter bKash transaction ID"
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value)}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-studyportal-blue hover:bg-blue-700"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Submit Payment"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Payment History */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>View your recent payment transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="all">
                  <TabsList className="mb-4">
                    <TabsTrigger value="all">All Transactions</TabsTrigger>
                    <TabsTrigger value="completed">Completed</TabsTrigger>
                    <TabsTrigger value="pending">Pending</TabsTrigger>
                  </TabsList>

                  <TabsContent value="all">
                    {paymentHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <CreditCard className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">No payment history</h3>
                        <p className="text-gray-500 mt-1">You haven't made any payments yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentHistory.map((payment) => (
                          <Card key={payment.id}>
                            <CardContent className="p-4">
                              <div className="flex justify-between items-start">
                                <div>
                                  <div className="flex items-center">
                                    <h3 className="font-medium">{payment.description}</h3>
                                    {payment.status === "completed" ? (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Completed
                                      </span>
                                    ) : (
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <AlertCircle className="mr-1 h-3 w-3" />
                                        Pending
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">{formatDate(payment.date)}</p>
                                  <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                                  <p className="text-sm text-gray-500">Method: {payment.paymentMethod}</p>
                                </div>
                                <div className="text-right">
                                  <p className="font-bold text-lg">
                                    {payment.amount} {payment.currency}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="completed">
                    {paymentHistory.filter((p) => p.status === "completed").length === 0 ? (
                      <div className="text-center py-8">
                        <CheckCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">No completed payments</h3>
                        <p className="text-gray-500 mt-1">You don't have any completed payments yet.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentHistory
                          .filter((payment) => payment.status === "completed")
                          .map((payment) => (
                            <Card key={payment.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{payment.description}</h3>
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                                        <CheckCircle className="mr-1 h-3 w-3" />
                                        Completed
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{formatDate(payment.date)}</p>
                                    <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                                    <p className="text-sm text-gray-500">Method: {payment.paymentMethod}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      {payment.amount} {payment.currency}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="pending">
                    {paymentHistory.filter((p) => p.status === "pending").length === 0 ? (
                      <div className="text-center py-8">
                        <AlertCircle className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <h3 className="text-lg font-medium text-gray-700">No pending payments</h3>
                        <p className="text-gray-500 mt-1">You don't have any pending payments.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {paymentHistory
                          .filter((payment) => payment.status === "pending")
                          .map((payment) => (
                            <Card key={payment.id}>
                              <CardContent className="p-4">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <div className="flex items-center">
                                      <h3 className="font-medium">{payment.description}</h3>
                                      <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        <AlertCircle className="mr-1 h-3 w-3" />
                                        Pending
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">{formatDate(payment.date)}</p>
                                    <p className="text-sm text-gray-500">Transaction ID: {payment.transactionId}</p>
                                    <p className="text-sm text-gray-500">Method: {payment.paymentMethod}</p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold text-lg">
                                      {payment.amount} {payment.currency}
                                    </p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default StudentPayment
