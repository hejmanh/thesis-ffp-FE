"use client";

interface RegisterToastProps {
  message: string;
}

export default function RegisterToast({ message }: RegisterToastProps) {
  if (!message) {
    return null;
  }

  return (
    <div className="fixed right-6 top-6 z-50 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}
