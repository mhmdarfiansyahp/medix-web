export function decodeToken(token: string): { exp?: number; iat?: number; sub?: string; role?: string; [key: string]: any } | null {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return null;
        
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        return JSON.parse(decoded);
    } catch (error) {
        return null;
    }
}

export function isTokenExpired(token: string): boolean {
    const storedExpiry = localStorage.getItem('medix_token_exp');
    if (storedExpiry) {
        return parseInt(storedExpiry) < Date.now();
    }
    
    try {
        const decoded = decodeToken(token);
        if (!decoded?.exp) return false;
        return decoded.exp * 1000 < Date.now();
    } catch {
        return true;
    }
}

export function isTokenValid(token: string): boolean {
    return !isTokenExpired(token);
}
