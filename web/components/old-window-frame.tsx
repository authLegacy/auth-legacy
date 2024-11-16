"use client";

import { Minus, Square, X } from "lucide-react";
import React from "react";

interface OldWindowFrameProps {
  children: React.ReactNode;
  title?: string;
  onClose?: () => void;
}

export function OldWindowFrameComponent({
  children,
  title = "Untitled",
  onClose,
}: OldWindowFrameProps) {
  return (
    <div className="max-w-2xl mx-auto my-8">
      <div className="bg-gray-200 border-2 border-gray-400 shadow-md rounded">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white px-2 py-1 flex items-center justify-between">
          <div className="text-sm font-bold">{title?.substring(0, 20)}</div>
          <div className="flex items-center space-x-2">
            <button
              className="text-white hover:bg-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Minimize"
            >
              <Minus size={16} />
            </button>
            <button
              className="text-white hover:bg-blue-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              aria-label="Maximize"
            >
              <Square size={16} />
            </button>
            <button
              onClick={onClose}
              className="text-white hover:bg-red-500 rounded focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              aria-label="Close"
            >
              <X size={16} />
            </button>
          </div>
        </div>
        <div className="bg-white border-t-2 border-gray-400">
          <div className="bg-gray-100 border border-gray-300 shadow-inner p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
