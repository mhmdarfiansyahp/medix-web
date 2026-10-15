import { Save } from 'lucide-react';
import { cn } from '../../../utils/utils';

interface TransactionSubmitButtonProps {
    onSubmit: () => Promise<void>;
    disabled?: boolean;
    isLoading?: boolean;
    totalAmount?: number;
    className?: string;
}

export default function TransactionSubmitButton({
    onSubmit,
    disabled = false,
    isLoading = false,
    totalAmount,
    className,
}: TransactionSubmitButtonProps) {
    const handleSubmit = async () => {
        if (disabled || isLoading) return;
        await onSubmit();
    };

    return (
        <button
            onClick={handleSubmit}
            disabled={disabled || isLoading}
            className={cn(
                'btn-primary',
                'w-full',
                'inline-flex items-center justify-center gap-2',
                'px-6 py-3',
                'text-sm font-semibold',
                'rounded-xl',
                'transition-all duration-200',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                'shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0',
                className
            )}
            aria-label={
                totalAmount
                    ? `Create transaction for total amount`
                    : 'Create transaction'
            }
        >
            {isLoading ? (
                <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span className="hidden sm:inline">Processing...</span>
                </>
            ) : (
                <>
                    <Save className="w-4 h-4" />
                    <span>Pay Now</span>
                </>
            )}
        </button>
    );
}


