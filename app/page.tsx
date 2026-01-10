"use client";

import { useState } from "react";
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";
import { TransferForm } from "@/components/TransferForm";
import { USDCTransferForm } from "@/components/USDCTransferForm";
import { SignMessage } from "@/components/SignMessage";
import { ActivityLog } from "@/components/ActivityLog";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  const [activeTab, setActiveTab] = useState<
    "sol" | "usdc" | "sign" | "activity"
  >("sol");

  const tabs = [
    { id: "sol", label: "Send SOL", icon: "⏓" },
    { id: "usdc", label: "Send USDC", icon: "＄" },
    { id: "sign", label: "Sign Message", icon: "✎" },
    { id: "activity", label: "Activity", icon: "☵" },
  ] as const;

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Floating Navbar */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 bg-card/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 flex items-center justify-center rounded-lg bg-primary/10 border border-primary/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <span className="text-primary font-bold">L</span>
          </div>
          <span className="font-bold text-foreground tracking-tight">
            Lazorkit
          </span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          {["Features", "Demo"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="text-sm font-bold font-mono text-muted-foreground hover:text-primary transition-colors uppercase tracking-wider"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <ConnectButton />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 text-center relative">
        {/* Background Blur Elements */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse-soft"></div>
        <div
          className="absolute bottom-10 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-pulse-soft"
          style={{ animationDelay: "1s" }}
        ></div>

        <div className="animate-enter">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-primary text-xs font-mono font-bold uppercase tracking-wider mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Next-Gen Solana UX
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 tracking-tight leading-tight">
            The Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-indigo-500">
              Web3 Onboarding
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Forget seed phrases. Authenticate with{" "}
            <strong className="text-foreground">FaceID</strong> &{" "}
            <strong className="text-foreground">TouchID</strong>. Experience
            gasless transactions and instant onboarding on Solana.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            >
              Get Started Now
            </Button>
            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              View Documentation
            </Button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Features Cards */}
        <section id="features" className="grid md:grid-cols-3 gap-6">
          <Card
            variant="hover"
            className="border-l-4 border-l-blue-500 rounded-lg"
          >
            <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4 text-blue-500 font-mono text-xs border border-blue-500/20">
              BIO_AUTH
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
              Biometric Auth
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Login utilizing secure passkeys powered by your device's secure
              enclave. No mnemonics.
            </p>
          </Card>

          <Card
            variant="hover"
            className="border-l-4 border-l-indigo-500 rounded-lg"
          >
            <div className="w-12 h-12 bg-indigo-500/10 rounded-lg flex items-center justify-center mb-4 text-indigo-500 font-mono text-xs border border-indigo-500/20">
              GAS_LESS
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
              Gasless Txns
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Remove friction by sponsoring user gas fees. Paymaster
              infrastructure included.
            </p>
          </Card>

          <Card
            variant="hover"
            className="border-l-4 border-l-cyan-500 rounded-lg"
          >
            <div className="w-12 h-12 bg-cyan-500/10 rounded-lg flex items-center justify-center mb-4 text-cyan-500 font-mono text-xs border border-cyan-500/20">
              SMART_ACC
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2 font-mono">
              Smart Accounts
            </h3>
            <p className="text-muted-foreground leading-relaxed text-sm">
              Programmable wallets with account recovery, session keys, and
              automation capabilities.
            </p>
          </Card>
        </section>

        {/* Interactive Demo Section */}
        <section id="demo" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                Action Center
              </h2>
              <p className="text-muted-foreground font-mono text-sm">
                {"//"} Explore Lazorkit capabilities in real-time
              </p>
            </div>
            <div className="hidden sm:block">
              <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-full text-[10px] font-bold border border-amber-500/20 font-mono uppercase tracking-widest">
                Devnet Active
              </span>
            </div>
          </div>

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            {/* Command Sidebar: Persistent Wallet Info */}
            <div className="lg:col-span-4 sticky top-6">
              <div className="space-y-6">
                <WalletInfo />
                <Card className="bg-primary/5 border-primary/20 border-dashed">
                  <h4 className="text-xs font-mono font-bold text-primary uppercase mb-2 tracking-widest">
                    System Status
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">NETWORK</span>
                      <span className="text-foreground">SOLANA_DEVNET</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">GAS_MODE</span>
                      <span className="text-green-500">SPONSORED</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Action Console: Tabbed Forms */}
            <div className="lg:col-span-8">
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
                {/* Console Header / Tabs */}
                <div className="flex items-center p-1 bg-muted/30 border-b border-border">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTab(tab.id)}
                      className={`
                        flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-all
                        ${
                          activeTab === tab.id
                            ? "bg-card text-primary shadow-sm rounded-xl border border-border"
                            : "text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl"
                        }
                      `}
                    >
                      <span className="opacity-70" aria-hidden="true">
                        {tab.icon}
                      </span>
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Console Body */}
                <div className="p-8 min-h-[400px]">
                  <div className="animate-enter" key={activeTab}>
                    {activeTab === "sol" && <TransferForm />}
                    {activeTab === "usdc" && <USDCTransferForm />}
                    {activeTab === "sign" && <SignMessage />}
                    {activeTab === "activity" && <ActivityLog />}
                  </div>
                </div>

                {/* Console Footer */}
                <div className="px-8 py-3 bg-muted/10 border-t border-border/50 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"
                      aria-hidden="true"
                    ></div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase">
                      Console Ready
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground/50 italic">
                    v1.2.4-stable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border pt-10 pb-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <p className="text-foreground font-bold mb-1 font-mono uppercase tracking-tight">
                Lazorkit Ops
              </p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Autonomous Solana Infrastructure {"//"} 2026
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/lazor-kit/lazor-kit"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="GitHub Repository"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                >
                  <title>GitHub</title>
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-blue-500 transition-colors"
                aria-label="Twitter Profile"
              >
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  role="img"
                >
                  <title>Twitter</title>
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
