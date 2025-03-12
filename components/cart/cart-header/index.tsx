'use client';

import { motion } from 'motion/react';

import { IconClose } from '@/components/icons';
import { SheetClose, SheetHeader, SheetTitle } from '@/components/ui/sheet';

export function CartHeader() {
  return (
    <SheetHeader className="flex items-center justify-between py-4 border-b-2 border-blue-ruin">
      <SheetTitle className="font-bomstad-display font-black text-4xl text-blue-ruin">
        Your Cart
      </SheetTitle>
      <motion.div
        whileHover={{ scale: 1.1 }}
        transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      >
        <SheetClose
          className="h-11 w-11 flex items-center justify-center cursor-pointer bg-blue-ruin rounded-full p-3"
          aria-label="Close cart"
        >
          <IconClose fill="var(--sugar-milk)" />
          <span className="sr-only">Close</span>
        </SheetClose>
      </motion.div>
    </SheetHeader>
  );
}
