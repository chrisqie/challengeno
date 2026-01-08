"use client"

import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function PasswordResetSuccess() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-0 shadow-lg bg-card">
        <CardContent className="p-8 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <CheckCircle className="h-10 w-10 text-emerald-500" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-foreground">Password Reset Successful!</h2>
          <p className="mb-6 text-muted-foreground">
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <Link href="/login" className="block">
            <Button className="w-full bg-emerald-500 py-6 text-lg hover:bg-emerald-600">Go to Login</Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}
