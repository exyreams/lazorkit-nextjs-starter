/**
 * @fileoverview Main Landing Page Component
 *
 * This is the primary landing page that showcases Lazorkit's capabilities
 * through an interactive demo interface. The page features:
 *
 * - Hero section with animated elements
 * - Feature cards highlighting key benefits
 * - Interactive demo console with tabbed interface
 * - Real-time wallet information display
 * - Code examples for each feature
 * - Responsive design with smooth animations
 *
 * The page demonstrates core Lazorkit features:
 * - Passkey-based authentication (biometric login)
 * - Gasless SOL transfers
 * - USDC transactions with fee sponsorship
 * - Message signing capabilities
 * - Transaction history and activity logs
 *
 * @author exyreams
 * @version 1.0.0
 */

"use client";

import {
  Activity,
  Bot,
  Check,
  CircleDollarSign,
  Code,
  Copy,
  Fingerprint,
  MonitorPlay,
  PenTool,
  Send,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ActivityLog } from "@/components/ActivityLog";
import { ConnectButton } from "@/components/ConnectButton";
import { SignMessage } from "@/components/SignMessage";
import { TransferForm } from "@/components/TransferForm";
import { USDCTransferForm } from "@/components/USDCTransferForm";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { WalletInfo } from "@/components/WalletInfo";

/**
 * Tab types for the interactive demo console
 * Each tab represents a different Lazorkit feature demonstration
 */
type TabType = "sol" | "usdc" | "sign" | "activity";

/**
 * Home Component - Main Landing Page
 *
 * This component renders the complete landing page experience with:
 * - Animated hero section
 * - Feature showcase cards
 * - Interactive demo console with multiple tabs
 * - Code examples and live demonstrations
 * - Responsive layout with smooth transitions
 *
 * State Management:
 * - activeTab: Controls which demo is currently displayed
 * - showCode: Toggles between demo view and code view
 * - Tab positioning: Manages animated tab indicators
 * - Copy functionality: Handles code snippet copying
 *
 * @returns Complete landing page JSX structure
 */
export default function Home() {
  /** Current active tab in the demo console */
  const [activeTab, setActiveTab] = useState<TabType>("sol");

  // Refs for sliding tab indicator animation
  const tabsRef = useRef<HTMLDivElement>(null);
  const solTabRef = useRef<HTMLButtonElement>(null);
  const usdcTabRef = useRef<HTMLButtonElement>(null);
  const signTabRef = useRef<HTMLButtonElement>(null);
  const activityTabRef = useRef<HTMLButtonElement>(null);

  /** Map of tab types to their corresponding refs for easy access */
  const tabRefs = {
    sol: solTabRef,
    usdc: usdcTabRef,
    sign: signTabRef,
    activity: activityTabRef,
  };

  // Refs and state for Mode Toggle sliding indicator
  const modeTabsRef = useRef<HTMLDivElement>(null);
  const demoTabRef = useRef<HTMLButtonElement>(null);
  const codeTabRef = useRef<HTMLButtonElement>(null);

  /** Position state for mode toggle indicator animation */
  const [modeTabPosition, setModeTabPosition] = useState({ left: 0, width: 0 });

  /** Position state for main tab indicator animation */
  const [tabPosition, setTabPosition] = useState({ left: 0, width: 0 });

  /** Flag to prevent animation glitches on initial render */
  const [hasInitialized, setHasInitialized] = useState(false);

  /**
   * Initialize tab position on component mount
   * Sets up the initial position for the animated tab indicator
   */
  useEffect(() => {
    const initializeTabPosition = () => {
      const currentTab = solTabRef.current;
      if (currentTab && tabsRef.current) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeRect = currentTab.getBoundingClientRect();
        setTabPosition({
          left: activeRect.left - tabsRect.left,
          width: activeRect.width,
        });
        setHasInitialized(true);
      }
    };

    // Run immediately and also after a short delay to ensure DOM is ready
    initializeTabPosition();
    const timer = setTimeout(initializeTabPosition, 50);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Update tab indicator position when active tab changes
   * Handles smooth animation between different tabs
   */
  useEffect(() => {
    const updateTabPosition = () => {
      const currentTab = tabRefs[activeTab]?.current;
      if (currentTab && tabsRef.current) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeRect = currentTab.getBoundingClientRect();
        setTabPosition({
          left: activeRect.left - tabsRect.left,
          width: activeRect.width,
        });
      }
    };

    const timer1 = setTimeout(updateTabPosition, 50);
    const timer2 = setTimeout(updateTabPosition, 100);

    let resizeTimeout: NodeJS.Timeout;
    const debouncedResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(updateTabPosition, 150);
    };

    window.addEventListener("resize", debouncedResize);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", debouncedResize);
    };
  }, [activeTab, tabRefs[activeTab]?.current]);

  /** Toggle between demo view and code view */
  const [showCode, setShowCode] = useState(false);

  /** State for copy button feedback */
  const [copiedCode, setCopiedCode] = useState(false);

  /**
   * Update mode toggle indicator position
   * Handles animation for demo/code view switcher
   */
  useEffect(() => {
    const updateModePosition = () => {
      const currentTab = showCode ? codeTabRef.current : demoTabRef.current;
      if (currentTab && modeTabsRef.current) {
        const tabsRect = modeTabsRef.current.getBoundingClientRect();
        const activeRect = currentTab.getBoundingClientRect();
        setModeTabPosition({
          left: activeRect.left - tabsRect.left,
          width: activeRect.width,
        });
      }
    };

    updateModePosition();
    const timer = setTimeout(updateModePosition, 50);

    window.addEventListener("resize", updateModePosition);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateModePosition);
    };
  }, [showCode]);

  /**
   * Code snippets for each demo tab
   * Contains real implementation examples that developers can copy and use
   * Each snippet demonstrates the core Lazorkit functionality for that feature
   */
  const snippets: Record<TabType, string> = {
    // SOL Transfer: Basic gasless Solana transfer using system program
    sol: `import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

const { signAndSendTransaction, smartWalletPubkey } = useWallet();

const handleSend = async () => {
  const instruction = SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,
    toPubkey: new PublicKey(recipient),
    lamports: amount * LAMPORTS_PER_SOL,
  });

  const sig = await signAndSendTransaction({
    instructions: [instruction],
  });
};

// Usage in Component
<button onClick={handleSend}>
  Send Gasless SOL
</button>`,
    usdc: `import { useWallet } from "@lazorkit/wallet";

const { signAndSendTransaction } = useWallet();

const handleUSDC = async () => {
  const sig = await signAndSendTransaction({
    instructions: [tokenTransferInstruction],
    transactionOptions: {
      feeToken: "USDC", // Sponsoring gas with USDC
    },
  });
};

// Usage in Component
<button onClick={handleUSDC}>
  Send USDC (Fee in USDC)
</button>`,
    sign: `import { useWallet } from "@lazorkit/wallet";

const { signMessage } = useWallet();

const handleSign = async () => {
  const { signature } = await signMessage(
    "Authenticating with Lazorkit"
  );
};

// Usage in Component
<button onClick={handleSign}>
  Sign Message
</button>`,
    activity: `import { useWallet } from "@lazorkit/wallet";
import { Connection, PublicKey } from "@solana/web3.js";

const { wallet } = useWallet();

const fetchHistory = async () => {
  const conn = new Connection(RPC_URL);
  const history = await conn.getSignaturesForAddress(
    new PublicKey(wallet.smartWallet),
    { limit: 10 }
  );
};

// Usage in Effect or Handler
useEffect(() => {
  fetchHistory();
}, [wallet.smartWallet]);`,
  };

  /**
   * Handle copying code snippets to clipboard
   * Provides user feedback with temporary state change
   */
  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippets[activeTab]);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="min-h-screen pb-20 relative overflow-hidden">
      {/* Floating Navbar */}
      <nav className="absolute top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 bg-card/80 backdrop-blur-xl border border-border rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-black/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 relative rounded-lg overflow-hidden shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <Image
              src="/logo.png"
              alt="Lazorkit Logo"
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-foreground tracking-tight">
            Lazorkit
          </span>
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
          </div>
        </div>
      </section>

      {/* Main Dashboard Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
        {/* Features Cards */}
        <section id="features" className="grid md:grid-cols-3 gap-6">
          {/* Card 1: Biometric Auth */}
          <div className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-blue-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(59,130,246,0.3)] hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4 text-blue-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_-3px_rgba(59,130,246,0.3)]">
                <Fingerprint className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-blue-500 transition-colors tracking-tight font-mono">
                Biometric Auth
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Login utilizing secure passkeys powered by your device's secure
                enclave. No mnemonics required.
              </p>
            </div>
          </div>

          {/* Card 2: Gasless Txns */}
          <div className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-indigo-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4 text-indigo-500 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 shadow-[0_0_15px_-3px_rgba(99,102,241,0.3)]">
                <Zap className="w-6 h-6 fill-current" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-indigo-500 transition-colors tracking-tight font-mono">
                Gasless Txns
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Remove friction entirely by sponsoring user gas fees. Built-in
                Paymaster infrastructure included.
              </p>
            </div>
          </div>

          {/* Card 3: Smart Accounts */}
          <div className="group relative p-6 rounded-2xl bg-card border border-border shadow-sm hover:border-cyan-500/50 transition-all duration-500 hover:shadow-[0_0_40px_-10px_rgba(6,182,212,0.3)] hover:-translate-y-1 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mb-4 text-cyan-500 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-[0_0_15px_-3px_rgba(6,182,212,0.3)]">
                <Bot className="w-6 h-6" />
              </div>

              <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-cyan-500 transition-colors tracking-tight font-mono">
                Smart Accounts
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-medium">
                Programmable wallets with account recovery, session keys, and
                powerful automation capabilities.
              </p>
            </div>
          </div>
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
              <div className="bg-card border border-border rounded-2xl shadow-2xl shadow-black/40 relative">
                {/* Console Header / Tabs */}
                <div
                  ref={tabsRef}
                  className="relative flex items-center p-1 bg-muted/30 border-b border-border rounded-t-2xl"
                >
                  {/* Sliding Tab Indicator */}
                  {hasInitialized && (
                    <motion.div
                      className="absolute rounded-xl bg-card border border-border shadow-sm"
                      style={{
                        top: 4,
                        bottom: 4,
                      }}
                      initial={false}
                      animate={{
                        left: tabPosition.left,
                        width: tabPosition.width,
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <button
                    ref={solTabRef}
                    type="button"
                    onClick={() => setActiveTab("sol")}
                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-xl cursor-pointer
                      ${
                        activeTab === "sol"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Send className="w-4 h-4 opacity-70" aria-hidden="true" />
                    <span className="hidden sm:inline">Send SOL</span>
                  </button>

                  <button
                    ref={usdcTabRef}
                    type="button"
                    onClick={() => setActiveTab("usdc")}
                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-xl cursor-pointer
                      ${
                        activeTab === "usdc"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <CircleDollarSign
                      className="w-4 h-4 opacity-70"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Send USDC</span>
                  </button>

                  <button
                    ref={signTabRef}
                    type="button"
                    onClick={() => setActiveTab("sign")}
                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-xl cursor-pointer
                      ${
                        activeTab === "sign"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <PenTool
                      className="w-4 h-4 opacity-70"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Sign Message</span>
                  </button>

                  <button
                    ref={activityTabRef}
                    type="button"
                    onClick={() => setActiveTab("activity")}
                    className={`
                      relative z-10 flex-1 flex items-center justify-center gap-2 py-3 px-4 text-xs font-mono font-bold uppercase tracking-wider transition-colors rounded-xl cursor-pointer
                      ${
                        activeTab === "activity"
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }
                    `}
                  >
                    <Activity
                      className="w-4 h-4 opacity-70"
                      aria-hidden="true"
                    />
                    <span className="hidden sm:inline">Activity</span>
                  </button>
                </div>

                {/* Sub-header: Mode Selection */}
                <div className="flex items-center justify-end px-6 py-4 bg-muted/5 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-mono font-bold text-muted-foreground uppercase tracking-widest">
                      View Mode:
                    </span>
                    <div
                      ref={modeTabsRef}
                      className="relative bg-muted/30 border border-border/50 rounded-full p-1 flex items-center gap-1"
                    >
                      {/* Sliding Mode Indicator */}
                      {hasInitialized && (
                        <motion.div
                          className="absolute rounded-full bg-card border border-border shadow-sm"
                          style={{
                            top: 4,
                            bottom: 4,
                          }}
                          initial={false}
                          animate={{
                            left: modeTabPosition.left,
                            width: modeTabPosition.width,
                          }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                          }}
                        />
                      )}

                      <button
                        ref={demoTabRef}
                        type="button"
                        onClick={() => setShowCode(false)}
                        className={`
                          relative z-10 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors
                          ${
                            !showCode
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        <MonitorPlay className="w-3.5 h-3.5 opacity-70" />
                        <span>Demo</span>
                      </button>

                      <button
                        ref={codeTabRef}
                        type="button"
                        onClick={() => setShowCode(true)}
                        className={`
                          relative z-10 px-4 py-1.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors
                          ${
                            showCode
                              ? "text-primary"
                              : "text-muted-foreground hover:text-foreground"
                          }
                        `}
                      >
                        <Code className="w-3.5 h-3.5 opacity-70" />
                        <span>Code</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Console Body */}
                <div className="p-8 min-h-[420px] relative overflow-hidden">
                  <AnimatePresence mode="wait">
                    {!showCode ? (
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                      >
                        {activeTab === "sol" && <TransferForm />}
                        {activeTab === "usdc" && <USDCTransferForm />}
                        {activeTab === "sign" && <SignMessage />}
                        {activeTab === "activity" && <ActivityLog />}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="code-view"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-sm font-bold text-foreground font-mono uppercase tracking-widest flex items-center gap-2">
                            <Code className="w-4 h-4 text-primary" />
                            Implementation
                          </h3>
                          <button
                            type="button"
                            onClick={handleCopyCode}
                            className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-muted/30 border border-border text-[10px] font-mono font-bold uppercase text-muted-foreground hover:text-foreground transition-all"
                          >
                            {copiedCode ? (
                              <>
                                <Check className="w-3 h-3 text-green-500" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                Copy Code
                              </>
                            )}
                          </button>
                        </div>
                        <div className="relative group/code">
                          <pre className="p-6 rounded-xl bg-black/40 border border-border overflow-x-auto font-mono text-sm leading-relaxed custom-scrollbar max-h-[300px]">
                            <code className="text-blue-400">
                              {snippets[activeTab]}
                            </code>
                          </pre>
                        </div>
                        <p className="mt-4 text-xs text-muted-foreground font-mono leading-relaxed italic opacity-70">
                          {"//"} This is the core logic. Lazorkit handles the
                          heavy lifting of account abstraction and sponsorship.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
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
                Lazorkit
              </p>
              <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-widest">
                Solana Starter Kit {"//"} 2026
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="https://github.com/exyreams"
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
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
