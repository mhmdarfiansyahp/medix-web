import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

export const showConfirmDialog = async (options: {
    title: string;
    text: string;
    confirmButtonText?: string;
    cancelButtonText?: string;
    isDanger?: boolean;
}): Promise<boolean> => {
    const result = await MySwal.fire({
        title: options.title,
        text: options.text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: options.isDanger ? '#ef4444' : '#3b82f6',
        cancelButtonColor: '#64748b',
        confirmButtonText: options.confirmButtonText || 'Confirm',
        cancelButtonText: options.cancelButtonText || 'Cancel',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'px-4 py-2 text-sm font-semibold rounded-xl',
            cancelButton: 'px-4 py-2 text-sm font-semibold rounded-xl',
        },
    });
    return result.isConfirmed;
};

export const showDeleteConfirm = (onConfirm: () => void) => {
    MySwal.fire({
        title: 'Are you sure?',
        text: 'This data will be deleted and cannot be recovered!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#ef4444',
        cancelButtonColor: '#64748b',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
        customClass: {
            popup: 'rounded-2xl',
            confirmButton: 'px-4 py-2 text-sm font-semibold rounded-xl',
            cancelButton: 'px-4 py-2 text-sm font-semibold rounded-xl',
        },
    }).then((result) => {
        if (result.isConfirmed) {
            onConfirm();
        }
    });
};

export const showToast = (
    message: string,
    icon: 'success' | 'error' | 'info' | 'warning' = 'success'
) => {
    MySwal.fire({
        toast: true,
        position: 'top-end',
        icon,
        title: message,
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        customClass: {
            popup: 'rounded-xl',
        },
    });
};

export const showErrorToast = (message: string) => {
    showToast(message, 'error');
};

export const showSuccessToast = (message: string) => {
    showToast(message, 'success');
};