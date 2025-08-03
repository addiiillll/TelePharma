"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Calendar, Home, MessageSquare, Settings, Stethoscope, Users, Video, Search, User, Menu, X, Shield } from 'lucide-react'

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ModeToggle } from "./mode-toggle"

interface NavigationItem {
  title: string
  url: string
  icon: React.ComponentType<any>
  badge?: number
}

// Navigation items for the telemedicine app
const navigationItems: NavigationItem[] = [
  {
    title: "Home",
    url: "/",
    icon: Home,
  }
]

export function Navbar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Stethoscope className="h-4 w-4" />
          </div>
          <span className="text-lg font-semibold">TeleMed Pro</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-1">
          {navigationItems.map((item) => (
            <Link key={item.title} href={item.url}>
              <Button 
                variant={pathname === item.url ? "secondary" : "ghost"} 
                size="sm" 
                className="relative"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.title}
                {item.badge && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs">
                    {item.badge}
                  </Badge>
                )}
              </Button>
            </Link>
          ))}
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
         <ModeToggle/>

          {/* Admin Button */}
          <Link href="/admin/login">
            <Button variant="outline" size="sm">
              <Shield className="h-4 w-4 mr-2" />
              Admin
            </Button>
          </Link>

          {/* Mobile Menu */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                    <Stethoscope className="h-3 w-3" />
                  </div>
                  <span className="text-sm font-semibold">TeleMed Pro</span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search patients..." className="pl-8" />
              </div>

              {/* Mobile Navigation */}
              <div className="space-y-2">
                {navigationItems.map((item) => (
                  <Link key={item.title} href={item.url} onClick={() => setIsOpen(false)}>
                    <Button 
                      variant={pathname === item.url ? "secondary" : "ghost"} 
                      className="w-full justify-start relative"
                    >
                      <item.icon className="h-4 w-4 mr-3" />
                      {item.title}
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 px-1.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                ))}
              </div>

              {/* Mobile Admin Button */}
              <div className="mt-8 pt-6 border-t">
                <Link href="/admin/login" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-start">
                    <Shield className="mr-3 h-4 w-4" />
                    Admin
                  </Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
