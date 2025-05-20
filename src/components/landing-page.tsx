import Link from "next/link"
import { ArrowRight, Compass, Github, Heart, Shield, Twitter, Wallet } from "lucide-react"
import { Button } from "~/components/ui/button"
import { AppShell } from "~/components/app-shell"

export function LandingPage() {
  return (
    <AppShell showNav={false}>
      <div className="flex flex-col min-h-screen">
        {/* Hero Section */}
        <section className="relative py-20 md:py-28 overflow-hidden">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 relative z-10">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-bold tracking-tighter">
                  Support Causes You Believe In, <br className="hidden sm:inline" />
                  Transparently on Solana
                </h1>
                <p className="text-xl text-muted-foreground md:w-3/4 mx-auto">
                  Donor Link connects passionate supporters with impactful projects through secure, transparent
                  blockchain technology.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 min-w-[176px] mt-4">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/browse-fundraisers">
                    Explore Fundraisers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Abstract background elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-7xl">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px]"></div>
          </div>
        </section>

        {/* Value Proposition Section */}
        <section className="py-16 md:py-24 bg-muted/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">What is Donor Link?</h2>
              <p className="text-muted-foreground md:w-3/4 mx-auto">
                Donor Link is a decentralized fundraising platform built on Solana that connects donors with impactful
                projects across various categories. Our platform ensures transparency, security, and direct impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50 hover:border-purple-500/20 transition-colors">
                <div className="p-3 rounded-full bg-purple-500/10 mb-4">
                  <Shield className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Secure & Transparent</h3>
                <p className="text-muted-foreground">
                  All transactions are recorded on the Solana blockchain, ensuring complete transparency and security
                  for both donors and fundraisers.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50 hover:border-purple-500/20 transition-colors">
                <div className="p-3 rounded-full bg-purple-500/10 mb-4">
                  <Heart className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Direct Impact</h3>
                <p className="text-muted-foreground">
                  Donations go directly to creators on the Solana blockchain, eliminating intermediaries and maximizing
                  your contribution's impact.
                </p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-lg border border-border/50 bg-card/50 hover:border-purple-500/20 transition-colors">
                <div className="p-3 rounded-full bg-purple-500/10 mb-4">
                  <Compass className="h-6 w-6 text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Diverse Causes</h3>
                <p className="text-muted-foreground">
                  From education and healthcare to technology and arts, find and support projects that align with your
                  values and interests.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">How It Works</h2>
              <p className="text-muted-foreground md:w-3/4 mx-auto">
                Supporting projects on Donor Link is simple, secure, and transparent.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-4">
                    <Wallet className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border/50"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">Connect Your Wallet</h3>
                <p className="text-muted-foreground">
                  Connect your Solana wallet to get started. No account creation needed.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="relative">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-4">
                    <Compass className="h-5 w-5 text-purple-500" />
                  </div>
                  <div className="hidden md:block absolute top-6 left-full w-full h-px bg-border/50"></div>
                </div>
                <h3 className="text-xl font-medium mb-2">Browse & Choose</h3>
                <p className="text-muted-foreground">
                  Explore fundraisers across various categories and find causes you're passionate about.
                </p>
              </div>

              <div className="flex flex-col items-center text-center">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-purple-500/10 mb-4">
                  <Heart className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="text-xl font-medium mb-2">Donate & Track</h3>
                <p className="text-muted-foreground">
                  Contribute using SOL or stablecoins and track the impact of your donation in real-time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Fundraisers Section */}
        <section className="py-16 md:py-24 bg-muted/5">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center mb-12">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4">Featured Fundraisers</h2>
              <p className="text-muted-foreground md:w-3/4 mx-auto">
                Discover some of the impactful projects currently raising funds on Donor Link.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Featured Fundraiser 1 */}
              <div className="group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm">
                <div className="space-y-3">
                  <div className="h-40 rounded-md bg-muted/30"></div>
                  <div className="inline-block bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Education
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">Coding Bootcamp for Underprivileged Youth</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Help provide coding education to underprivileged youth in urban areas, opening doors to tech
                      careers.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "64%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">64% Funded</span>
                      <span className="text-muted-foreground">3.2 SOL / 5 SOL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Fundraiser 2 */}
              <div className="group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm">
                <div className="space-y-3">
                  <div className="h-40 rounded-md bg-muted/30"></div>
                  <div className="inline-block bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Environment
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">Renewable Energy for Rural Schools</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Installing solar panels in rural schools to provide sustainable electricity for education.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "85%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">85% Funded</span>
                      <span className="text-muted-foreground">8.5 SOL / 10 SOL</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Featured Fundraiser 3 */}
              <div className="group rounded-lg border border-border/50 bg-card p-5 transition-all hover:border-purple-500/50 hover:shadow-sm">
                <div className="space-y-3">
                  <div className="h-40 rounded-md bg-muted/30"></div>
                  <div className="inline-block bg-purple-500/10 text-purple-500 px-2.5 py-0.5 rounded-full text-xs font-medium">
                    Technology & Open Source
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="font-semibold tracking-tight">Open Source Blockchain Development Tools</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      Building developer tools to make blockchain development more accessible to everyone.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <div className="h-2 w-full rounded-full bg-muted/50">
                      <div className="h-full rounded-full bg-purple-500" style={{ width: "35%" }}></div>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="font-medium">35% Funded</span>
                      <span className="text-muted-foreground">4.2 SOL / 12 SOL</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10">
              <Button asChild variant="outline" size="lg">
                <Link href="/browse-fundraisers">
                  View All Fundraisers
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Ready to Make a Difference?</h2>
              <p className="text-muted-foreground md:w-2/3 mx-auto">
                Join Donor Link today and be part of a community that's creating positive change through transparent,
                blockchain-powered fundraising.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Link href="/browse-fundraisers">
                    Explore Fundraisers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/create">Create a Fundraiser</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-10 border-t border-border/40">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <div className="h-6 w-6 rounded-full bg-purple-500"></div>
                  <span className="font-semibold text-lg">Donor Link</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Empowering change through transparent blockchain fundraising.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-4">Platform</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      href="/browse-fundraisers"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      Browse Fundraisers
                    </Link>
                  </li>
                  <li>
                    <Link href="/create" className="text-muted-foreground hover:text-foreground transition-colors">
                      Create a Fundraiser
                    </Link>
                  </li>
                  <li>
                    <Link href="/leaderboard" className="text-muted-foreground hover:text-foreground transition-colors">
                      Leaderboard
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Resources</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                      FAQ
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                      Blog
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-medium mb-4">Legal</h4>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>

                <div className="flex space-x-4 mt-6">
                  <Link
                    href="https://twitter.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="h-5 w-5" />
                    <span className="sr-only">Twitter</span>
                  </Link>
                  <Link
                    href="https://github.com"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Github className="h-5 w-5" />
                    <span className="sr-only">GitHub</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center mt-10 pt-6 border-t border-border/20">
              <p className="text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Donor Link. All rights reserved.
              </p>
              <p className="text-sm text-muted-foreground mt-4 md:mt-0">
                Built on <span className="text-purple-500">Solana</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </AppShell>
  )
}
