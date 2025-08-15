import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Menu, X, Crown, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

const navigation = [
  { name: 'Tools', href: '/#tools' },
  { name: 'Features', href: '/#features' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Business', href: '/business' },
];

export function Header() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-2" data-testid="logo-link">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                <FileText className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold text-gradient">
                sPdfHub
              </span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-6">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "text-muted-foreground hover:text-primary transition-colors font-medium",
                    location === item.href && "text-primary"
                  )}
                  data-testid={`nav-link-${item.name.toLowerCase()}`}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* AdSense Display Area */}
            <div className="hidden md:block w-48 h-12 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <span className="text-xs text-gray-500">Ad Space</span>
            </div>
            
            {/* Premium Button */}
            <Button 
              className="hidden md:flex items-center space-x-2 bg-gradient-primary hover:shadow-glow"
              data-testid="premium-button"
            >
              <Crown className="w-4 h-4" />
              <span>Get Premium</span>
            </Button>
            
            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="lg:hidden"
                  data-testid="mobile-menu-trigger"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className="text-lg font-medium text-muted-foreground hover:text-primary transition-colors"
                      data-testid={`mobile-nav-link-${item.name.toLowerCase()}`}
                    >
                      {item.name}
                    </a>
                  ))}
                  <Button className="mt-6 bg-gradient-primary">
                    <Crown className="w-4 h-4 mr-2" />
                    Get Premium
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}
