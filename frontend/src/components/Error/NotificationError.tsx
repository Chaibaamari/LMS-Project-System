import React from 'react';

type NotificationStatus = 'pending' | 'success' | 'failed' | string;
type NotificationProps = {
    status: NotificationStatus;
    message: string;
    isVisible: boolean;
};

export default function NotificationError({ status, message, isVisible }: NotificationProps) {
    const getNotificationStyle = (): string => {
        switch (status) {
            case 'pending':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'success':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'failed':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    const getStatusIcon = (): string => {
        switch (status) {
            case 'pending':
                return '⏳';
            case 'success':
                return '✓';
            case 'failed':
                return '⚠';
            default:
                return '';
        }
    };

    return (
        <>
            {isVisible && (
                <div
                    className={`fixed top-4 right-4 z-50 p-3 rounded-md shadow-lg border ${getNotificationStyle()} animate-fade-in`}
                >
                    <div className="flex items-center gap-2">
                        <span className="font-bold">{getStatusIcon()}</span>
                        <div>
                            <p className="font-medium capitalize">{status}</p>
                            <p>{message}</p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}