"use client"

import Link from "next/link"
import { AppHeader } from "@/components/app-header"
import { BottomNav } from "@/components/bottom-nav"
import { AppFooter } from "@/components/app-footer"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Crown, Star, Zap, Shield, Check } from "lucide-react"

const plans = [
  {
    id: "basic",
    name: "Basic Member",
    price: "¥9.9",
    period: "/30 days",
    icon: Shield,
    color: "bg-blue-900",
    buttonColor: "bg-gray-700 hover:bg-gray-800",
    features: [
      "Daily game creation limit +5",
      "Daily game participation limit +10",
      "Exclusive member badge",
      "Priority customer support",
    ],
  },
  {
    id: "premium",
    name: "Premium Member",
    price: "¥19.9",
    period: "/30 days",
    icon: Star,
    color: "bg-gradient-to-br from-blue-500 to-purple-600",
    buttonColor: "bg-purple-500 hover:bg-purple-600",
    popular: true,
    features: [
      "Daily game creation limit +10",
      "Daily game participation limit +20",
      "Exclusive member badge",
      "Priority customer support",
      "Advanced data statistics",
      "Custom game templates",
    ],
  },
  {
    id: "elite",
    name: "Elite Member",
    price: "¥39.9",
    period: "/30 days",
    icon: Crown,
    color: "bg-gradient-to-br from-amber-400 to-amber-600",
    buttonColor: "bg-amber-500 hover:bg-amber-600",
    features: [
      "Unlimited game creation",
      "Unlimited game participation",
      "Exclusive member badge",
      "Dedicated customer support",
      "Advanced data statistics",
      "Custom game templates",
      "Private game rooms",
      "Featured game priority",
    ],
  },
]

const benefits = [
  { icon: Zap, title: "More Creation Opportunities", desc: "Significantly increase daily game creation limit" },
  { icon: Star, title: "Join More Challenges", desc: "Significantly increase daily game participation limit" },
  { icon: Crown, title: "Exclusive Member Badge", desc: "Show off your VIP status" },
  { icon: Shield, title: "Priority Customer Support", desc: "Enjoy exclusive customer service" },
]

const faqs = [
  {
    q: "How is VIP membership billed?",
    a: "VIP membership is billed monthly, takes effect immediately after purchase, and automatically reverts to regular user status after expiration.",
  },
  {
    q: "Can I cancel VIP anytime?",
    a: "VIP membership does not auto-renew after expiration. You can choose whether to continue purchasing.",
  },
  {
    q: "Do VIP privileges take effect immediately?",
    a: "Yes, all privileges take effect immediately after purchasing VIP, and you can enjoy VIP services right away.",
  },
]

export function VipScreen() {
  return (
    <div className="min-h-screen bg-muted">
      <AppHeader />

      <main className="container mx-auto px-4 py-6 pb-24 max-w-5xl">
        <div className="flex items-center gap-4 mb-6">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-xl font-bold text-foreground">VIP Membership</h1>
        </div>

        {/* Hero Section */}
        <div className="text-center mb-8 bg-gradient-to-b from-blue-100 to-transparent py-8 rounded-2xl">
          <h2 className="text-3xl font-bold text-foreground mb-2">Upgrade to VIP Membership</h2>
          <p className="text-muted-foreground">
            Unlock more features, enjoy exclusive privileges, and make your challenge experience even better
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`border-0 shadow-lg overflow-hidden ${plan.popular ? "ring-2 ring-purple-500" : ""}`}
            >
              {plan.popular && (
                <div className="bg-purple-500 text-white text-center text-sm py-1 font-medium">Most Popular</div>
              )}
              <div className={`${plan.color} text-white p-6 text-center`}>
                <plan.icon className="h-8 w-8 mx-auto mb-2" />
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  <span className="text-sm opacity-80">{plan.period}</span>
                </div>
              </div>
              <CardContent className="p-6">
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button className={`w-full ${plan.buttonColor}`}>Buy Now</Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits Section */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-center mb-8">VIP Membership Benefits</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center ${
                      index === 0
                        ? "bg-amber-100"
                        : index === 1
                          ? "bg-purple-100"
                          : index === 2
                            ? "bg-blue-100"
                            : "bg-emerald-100"
                    }`}
                  >
                    <benefit.icon
                      className={`h-8 w-8 ${
                        index === 0
                          ? "text-amber-500"
                          : index === 1
                            ? "text-purple-500"
                            : index === 2
                              ? "text-blue-500"
                              : "text-emerald-500"
                      }`}
                    />
                  </div>
                  <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* FAQ Section */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-8">
            <h3 className="text-xl font-bold text-center mb-6">Frequently Asked Questions</h3>
            <div className="space-y-6 max-w-2xl mx-auto">
              {faqs.map((faq, index) => (
                <div key={index}>
                  <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <footer className="pt-8 pb-4 text-center">
          <p className="text-xs text-muted-foreground">ChallengeNo. Challenge? No pressure!</p>
          <p className="text-xs text-muted-foreground">© 2025 onFuture Studio</p>
        </footer>
      </main>

      <AppFooter />
      <BottomNav />
    </div>
  )
}
