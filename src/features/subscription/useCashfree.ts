"use client";

import { useEffect, useState } from "react";

// Types for Cashfree SDK
declare global {
  interface Window {
    Cashfree: any;
  }
}

export function useCashfree() {
  const [cashfree, setCashfree] = useState<any>(null);

  useEffect(() => {
    // Check if already loaded
    if (window.Cashfree) {
      setCashfree(window.Cashfree({ mode: "sandbox" })); // "production" for PROD
      return;
    }

    // Load script
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    script.onload = () => {
      if (window.Cashfree) {
        setCashfree(window.Cashfree({ mode: "sandbox" })); // Change to "production" in PROD
      }
    };
    document.body.appendChild(script);

    return () => {
      // Cleanup not strictly necessary for script tag
    };
  }, []);

  const openCheckout = async (paymentSessionId: string, returnUrl?: string) => {
    if (!cashfree) {
      console.error("Cashfree SDK not loaded yet.");
      return;
    }
    
    let checkoutOptions: any = {
      paymentSessionId: paymentSessionId,
    };
    
    if (returnUrl) {
        checkoutOptions.returnUrl = returnUrl;
    }

    try {
      await cashfree.checkout(checkoutOptions);
    } catch (err) {
      console.error("Cashfree checkout error:", err);
    }
  };

  return { cashfree, openCheckout, isLoaded: !!cashfree };
}
