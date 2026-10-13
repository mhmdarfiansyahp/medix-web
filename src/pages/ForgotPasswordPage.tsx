import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { Pill, Mail, Loader2, ArrowLeft, CheckCircle2, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { showSuccessToast } from '../utils/sweetalert';
import { authService } from '../services/authService';

export default function ForgotPasswordPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const tokenFromUrl = searchParams.get('token');

    const [step, setStep] = useState<'request' | 'sent' | 'reset'>(tokenFromUrl ? 'reset' : 'request');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // New password state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleRequestSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!email.trim() || !email.includes('@')) {
            setError('Please enter a valid registered email address');
            return;
        }

        setLoading(true);
        try {
            await authService.forgotPassword(email.trim());
            setStep('sent');
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to send reset instructions.');
        } finally {
            setLoading(false);
        }
    };

    const handleResetSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!newPassword || newPassword.length < 6) {
            setError('Password must be at least 6 characters long.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        try {
            const tokenToUse = tokenFromUrl || 'simulated-token';
            await authService.resetPasswordWithToken(tokenToUse, newPassword);
            showSuccessToast('Password reset successfully. All prior sessions invalidated.');
            navigate('/login', { replace: true });
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-slate-100 p-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-4 shadow-lg shadow-blue-500/25">
                        <Pill className="w-8 h-8" />
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Medix</h1>
                    <p className="text-sm text-slate-500 mt-1">Pharmacy Management System</p>
                </div>

                {step === 'request' && (
                    <form onSubmit={handleRequestSubmit} className="space-y-5">
                        <div className="text-center mb-2">
                            <h2 className="text-lg font-bold text-slate-900">Forgot Password?</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Enter your registered email and we'll send you a secure reset link (valid for 15-30 minutes).
                            </p>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Email Address
                            </label>
                            <div className="relative">
                                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
                                    <Mail className="w-5 h-5" />
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email address"
                                    className="w-full pl-11 pr-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Sending Link...
                                </>
                            ) : (
                                'Send Reset Link'
                            )}
                        </button>

                        <div className="text-center pt-2">
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                            >
                                <ArrowLeft className="w-4 h-4" />
                                Back to Sign In
                            </Link>
                        </div>
                    </form>
                )}

                {step === 'sent' && (
                    <div className="space-y-6 text-center">
                        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                            <CheckCircle2 className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Check Your Email</h2>
                            <p className="text-sm text-slate-500 mt-2">
                                We have sent a secure password reset link to your registered email address. The link is valid for 30 minutes.
                            </p>
                        </div>
                    </div>
                )}

                {step === 'reset' && (
                    <form onSubmit={handleResetSubmit} className="space-y-5">
                        <div className="text-center mb-2">
                            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h2 className="text-lg font-bold text-slate-900">Set New Password</h2>
                            <p className="text-xs text-slate-500 mt-1">
                                Please enter your new password below. All existing active sessions will be invalidated upon success.
                            </p>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    placeholder="Minimum 6 characters"
                                    className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all placeholder:text-slate-400 pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                Confirm New Password
                            </label>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Re-enter new password"
                                className="w-full px-4 py-3 text-base bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-600 transition-all placeholder:text-slate-400"
                            />
                        </div>

                        {error && (
                            <div className="bg-rose-50 text-rose-700 px-4 py-3 rounded-xl border border-rose-100 text-sm">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-base font-semibold text-white bg-blue-600 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-sm shadow-blue-500/20"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Updating Password...
                                </>
                            ) : (
                                'Reset Password'
                            )}
                        </button>
                    </form>
                )}

                <p className="text-center text-xs text-slate-400 mt-8">
                    Medix Pharmacy System
                </p>
            </div>
        </div>
    );
}
