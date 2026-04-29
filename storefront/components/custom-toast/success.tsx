'use client';

import { CheckCircle2 } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

/** I recommend abstracting the toast function
 *  so that you can call it without having to use toast.custom everytime. */
export function successToast(toast: Omit<ToastProps, 'id'>) {
  return sonnerToast.custom((id) => (
    <ToastSuccess
      id={id}
      title={toast.title}
      button={
        toast.button
          ? {
              label: toast.button.label,
              onClick: () => console.log('Button clicked')
            }
          : undefined
      }
    />
  ));
}

/** A fully custom toast that still maintains the animations and interactions. */
export function ToastSuccess(props: ToastProps) {
  const { title, button, id } = props;

  return (
    <div className="flex rounded-lg bg-white shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4">
      <div className="flex flex-1 items-center">
        <div className="w-full">
          <p className="text-sm font-medium text-gray-900">{title}</p>
        </div>
      </div>
      {button && (
        <div className="ml-5 shrink-0 rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-hidden">
          <button
            className="rounded bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-600 hover:bg-indigo-100"
            onClick={() => {
              button.onClick();
              sonnerToast.dismiss(id);
            }}
          >
            {button.label}
          </button>
        </div>
      )}
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title?: string;
  description?: string;
  button?: {
    label: string;
    onClick: () => void;
  };
}

export function test(message: string) {
  sonnerToast.success(message, {
    icon: <CheckCircle2 className="text-blue-ruin w-4 h-4" />,
    classNames: {
      toast: 'border-2 border-blue-ruin',
      title: 'font-medium font-poppins',
      description: 'font-medium font-poppins',
      actionButton: 'font-medium font-poppins',
      cancelButton: 'font-medium font-poppins',
      closeButton: 'font-medium font-poppins'
    }
  });
}
