'use client';

import { usePrivy } from '@privy-io/react-auth';
import { useCallback, useState } from 'react';
import { LiquidGlassButton } from '@/components/ui/liquid-glass-button';

type AuthPanelProps = {
  enabled: boolean;
};

type AuthStatus = 'idle' | 'logging-in' | 'logging-out';

export function AuthPanel({ enabled }: AuthPanelProps) {
  if (!enabled) {
    return (
      <div className="rounded-[1.25rem] border border-dashed border-slate-200 bg-white/70 p-5 text-sm text-slate-600">
        <p className="font-semibold text-slate-800">Privy disabled</p>
        <p className="mt-2 text-xs">
          Set{' '}
          <code className="font-mono text-[11px]">
            NEXT_PUBLIC_PRIVY_APP_ID
          </code>{' '}
          to enable authentication locally.
        </p>
      </div>
    );
  }

  return <PrivyBackedAuthPanel />;
}

function PrivyBackedAuthPanel() {
  const { ready, authenticated, login, logout } = usePrivy();
  const [authStatus, setAuthStatus] = useState<AuthStatus>('idle');

  const handleWalletLogin = useCallback(async () => {
    login({
      loginMethods: ['wallet'],
      walletChainType: 'ethereum-only',
    });
  }, [login]);

  const handleLogout = useCallback(async () => {
    setAuthStatus('logging-out');

    try {
      await logout();
    } finally {
      setAuthStatus('idle');
    }
  }, [logout]);

  return (
    <div className="flex h-full flex-col gap-6">
      <div className="mt-auto">
        {authenticated ? (
          <LiquidGlassButton
            type="button"
            onClick={handleLogout}
            disabled={!ready}
            status={authStatus === 'logging-out' ? 'loading' : 'idle'}
            className="w-full">
            Sign out
          </LiquidGlassButton>
        ) : (
          <LiquidGlassButton
            type="button"
            onClick={handleWalletLogin}
            disabled={!ready}
            status={'idle'}
            className="w-full">
            Sign in with wallet
          </LiquidGlassButton>
        )}
      </div>
    </div>
  );
}
