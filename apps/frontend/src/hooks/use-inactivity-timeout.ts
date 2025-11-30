'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

interface UseInactivityTimeoutOptions {
    inactivityTimeout?: number;
    warningTimeout?: number;
    onLogout: () => void;
}

interface UseInactivityTimeoutReturn {
    showWarning: boolean;
    secondsRemaining: number;
    resetTimer: () => void;
}

export function useInactivityTimeout({
    inactivityTimeout = 30 * 60 * 1000, // 30 minutos
    warningTimeout = 60 * 1000, // 60 segundos
    onLogout,
}: UseInactivityTimeoutOptions): UseInactivityTimeoutReturn {
    const [showWarning, setShowWarning] = useState(false);
    const [secondsRemaining, setSecondsRemaining] = useState(60);

    const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
    const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
    const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const lastActivityTimeRef = useRef<number>(Date.now());
    const isPageVisibleRef = useRef<boolean>(true);

    const clearAllTimers = useCallback(() => {
        if (inactivityTimerRef.current) {
            clearTimeout(inactivityTimerRef.current);
            inactivityTimerRef.current = null;
        }
        if (warningTimerRef.current) {
            clearTimeout(warningTimerRef.current);
            warningTimerRef.current = null;
        }
        if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
        }
    }, []);

    const startWarningCountdown = useCallback(() => {
        setSecondsRemaining(Math.floor(warningTimeout / 1000));

        countdownIntervalRef.current = setInterval(() => {
            setSecondsRemaining((prev) => {
                if (prev <= 1) {
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        warningTimerRef.current = setTimeout(() => {
            if (countdownIntervalRef.current) {
                clearInterval(countdownIntervalRef.current);
                countdownIntervalRef.current = null;
            }
            onLogout();
        }, warningTimeout);
    }, [warningTimeout, onLogout, clearAllTimers]);

    const resetTimer = useCallback(() => {
        clearAllTimers();
        setShowWarning(false);
        lastActivityTimeRef.current = Date.now();

        if (isPageVisibleRef.current) {
            inactivityTimerRef.current = setTimeout(() => {
                setShowWarning(true);
                startWarningCountdown();
            }, inactivityTimeout);
        }
    }, [inactivityTimeout, clearAllTimers, startWarningCountdown]);

    // Visibility change handler
    useEffect(() => {
        const handleVisibilityChange = () => {
            const isVisible = !document.hidden;
            isPageVisibleRef.current = isVisible;

            if (isVisible) {
                const timeHidden = Date.now() - lastActivityTimeRef.current;

                if (timeHidden >= inactivityTimeout && !showWarning) {
                    setShowWarning(true);
                    startWarningCountdown();
                } else if (!showWarning) {
                    const remainingTime = inactivityTimeout - timeHidden;
                    if (remainingTime > 0) {
                        inactivityTimerRef.current = setTimeout(() => {
                            setShowWarning(true);
                            startWarningCountdown();
                        }, remainingTime);
                    }
                }
            } else {
                if (!showWarning && inactivityTimerRef.current) {
                    clearTimeout(inactivityTimerRef.current);
                    inactivityTimerRef.current = null;
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [showWarning, inactivityTimeout, startWarningCountdown]);

    // Activity listeners - ONLY ONCE
    useEffect(() => {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];

        const handleActivity = () => {
            if (showWarning) return;
            resetTimer();
        };

        events.forEach((event) => {
            window.addEventListener(event, handleActivity);
        });

        resetTimer();

        return () => {
            events.forEach((event) => {
                window.removeEventListener(event, handleActivity);
            });
            clearAllTimers();
        };
    }, []); // VAZIO - só monta uma vez

    return {
        showWarning,
        secondsRemaining,
        resetTimer,
    };
}
