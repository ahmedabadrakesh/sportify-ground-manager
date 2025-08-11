import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getPendingCartItems, loadPendingCartToLocal } from "@/utils/pendingCartUtils";
import { supabase } from "@/integrations/supabase/client";

const PendingCartPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pendingItemsCount, setPendingItemsCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const checkPendingCart = async () => {
      const pendingItems = await getPendingCartItems();
      if (pendingItems.length > 0) {
        setPendingItemsCount(pendingItems.length);
        setIsOpen(true);
      }
    };

    const handleAuthChange = (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Show popup 1 minute after login
        timeoutId = setTimeout(() => {
          checkPendingCart();
        }, 60000); // 1 minute
      }
    };

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      subscription.unsubscribe();
    };
  }, []);

  const handleContinueShopping = async () => {
    const loaded = await loadPendingCartToLocal();
    if (loaded) {
      navigate('/cart');
    }
    setIsOpen(false);
  };

  const handleDismiss = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5 text-primary" />
              <DialogTitle>Items in Your Cart</DialogTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={handleDismiss}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <DialogDescription>
            You have {pendingItemsCount} item{pendingItemsCount !== 1 ? 's' : ''} waiting in your cart. Would you like to complete your purchase?
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex gap-3 mt-4">
          <Button onClick={handleContinueShopping} className="flex-1">
            Complete Purchase
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="flex-1">
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PendingCartPopup;