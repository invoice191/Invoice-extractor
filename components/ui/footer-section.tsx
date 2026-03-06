
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Facebook, Instagram, Linkedin, Moon, Send, Sun, Twitter, PieChart } from "lucide-react"

interface FooterdemoProps {
  address?: string;
  email?: string;
  phone?: string;
  primaryColor?: string;
}

function Footerdemo({ address, email, phone, primaryColor }: FooterdemoProps) {
  const [isDarkMode, setIsDarkMode] = React.useState(true)

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  return (
    <footer className="relative border-t bg-background text-foreground transition-colors duration-300">
      <div className="container mx-auto px-4 py-16 md:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
                <div className="p-2.5 rounded-xl shadow-lg" style={{ backgroundColor: primaryColor || '#2563eb' }}>
                  <PieChart className="text-white h-6 w-6" />
                </div>
                <span className="text-2xl font-black tracking-tighter">Vyaparmitra</span>
            </div>
            <h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Connected</h2>
            <p className="mb-6 text-muted-foreground text-sm leading-relaxed">
              Join our newsletter for the latest retail intelligence and platform updates.
            </p>
            <form className="relative" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder="Enter your email"
                className="pr-12 backdrop-blur-sm rounded-xl py-6"
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1.5 top-1.5 h-9 w-9 rounded-full transition-transform hover:scale-105"
                style={{ backgroundColor: primaryColor || '#2563eb' }}
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">Subscribe</span>
              </Button>
            </form>
            <div className="absolute -right-4 top-0 h-24 w-24 rounded-full opacity-10 blur-2xl" style={{ backgroundColor: primaryColor || '#2563eb' }} />
          </div>
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Quick Navigation</h3>
            <nav className="space-y-3 text-sm font-bold">
              <a href="#home" onClick={(e) => { e.preventDefault(); scrollToSection('home'); }} className="block transition-colors hover:text-primary">
                Home
              </a>
              <a href="#features" onClick={(e) => { e.preventDefault(); scrollToSection('features'); }} className="block transition-colors hover:text-primary">
                Features
              </a>
              <a href="#solutions" onClick={(e) => { e.preventDefault(); scrollToSection('solutions'); }} className="block transition-colors hover:text-primary">
                Solutions
              </a>
              <a href="#contact" onClick={(e) => { e.preventDefault(); scrollToSection('contact'); }} className="block transition-colors hover:text-primary">
                Contact
              </a>
            </nav>
          </div>
          <div>
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Contact Hub</h3>
            <address className="space-y-4 text-sm not-italic font-medium text-muted-foreground leading-relaxed">
              <p className="flex items-start gap-2">
                {address || "Suite 402, Innovate Plaza, Bengaluru, KA 560001"}
              </p>
              <p>Phone: {phone || "+91 80 4567 8901"}</p>
              <p>Email: {email || "hello@vyaparmitra.in"}</p>
            </address>
          </div>
          <div className="relative">
            <h3 className="mb-6 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Follow Growth</h3>
            <div className="mb-8 flex space-x-4">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-muted hover:bg-accent transition-all">
                      <Facebook className="h-5 w-5" />
                      <span className="sr-only">Facebook</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Facebook</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-muted hover:bg-accent transition-all">
                      <Twitter className="h-5 w-5" />
                      <span className="sr-only">Twitter</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Twitter</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-muted hover:bg-accent transition-all">
                      <Instagram className="h-5 w-5" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Follow us on Instagram</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon" className="rounded-xl h-12 w-12 border-muted hover:bg-accent transition-all">
                      <Linkedin className="h-5 w-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Connect with us on LinkedIn</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center space-x-3 bg-accent/50 p-3 rounded-2xl w-fit">
              <Sun className="h-4 w-4 text-amber-500" />
              <Switch
                id="dark-mode"
                checked={isDarkMode}
                onCheckedChange={setIsDarkMode}
              />
              <Moon className="h-4 w-4 text-blue-400" />
              <Label htmlFor="dark-mode" className="sr-only">
                Toggle dark mode
              </Label>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t pt-10 text-center md:flex-row">
          <p className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            © 2025 Vyaparmitra Analytics. Built for the Indian retailer.
          </p>
          <nav className="flex gap-8 text-xs font-black uppercase tracking-widest text-muted-foreground">
            <a href="#" className="transition-colors hover:text-primary">
              Privacy Protocol
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              User Terms
            </a>
            <a href="#" className="transition-colors hover:text-primary">
              Data Security
            </a>
          </nav>
        </div>
      </div>
    </footer>
  )
}

export { Footerdemo }
