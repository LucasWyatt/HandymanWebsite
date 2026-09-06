'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface HammerAnimationProps {
  isVisible: boolean;
  onClose?: () => void;
  message?: string;
  showOverlay?: boolean;
}

export const HammerAnimation: React.FC<HammerAnimationProps> = ({
  isVisible,
  onClose,
  message = 'Working...',
  showOverlay = true,
}) => {
  const [nailProgress, setNailProgress] = useState(0);
  const [hammerProgress, setHammerProgress] = useState(0);
  const [shouldHammerSwing, setShouldHammerSwing] = useState(true);
  const [boardOffset, setBoardOffset] = useState(0); // 0 = center, -200 = left, +200 = right
  const [disableTransition, setDisableTransition] = useState(false); // To disable smooth transition

  useEffect(() => {
    if (!isVisible) {
      setNailProgress(0);
      setHammerProgress(0);
      setShouldHammerSwing(true);
      setBoardOffset(0);
      setDisableTransition(false);
      return;
    }

    // Initialize: Start with board and nail off-screen to the right, then slide in
    setDisableTransition(true);
    setBoardOffset(200); // Start 200px to the right (off-screen)
    setShouldHammerSwing(false); // Don't start swinging immediately
    setHammerProgress(0); // Start hammer at top position immediately

    // After brief moment, slide the board and nail into center position
    setTimeout(() => {
      setDisableTransition(false);
      setBoardOffset(0); // Slide fresh board into center position
    }, 100);

    // Start hammer swinging animation after slide-in completes
    setTimeout(() => {
      setShouldHammerSwing(true);
    }, 600);

    let strikeCount = 0;

    // Simple strike handler - just moves nail down and handles board sliding
    const finishStrike = () => {
      strikeCount++;

      // After 3 strikes, let hammer complete its swing back up, then pause
      if (strikeCount === 3) {
        // Wait 800ms for hammer to swing back up, then pause
        setTimeout(() => {
          setShouldHammerSwing(false);

          // Resume swinging after 1 second pause
          setTimeout(() => {
            setShouldHammerSwing(true);
            strikeCount = 0; // Reset counter
          }, 1000);
        }, 800);
      }

      // Nail always moves down regardless of strike count
      setNailProgress(prev => {
        const newProgress = prev + 15;
        if (newProgress === 45) {
          // Add 1/2 second delay before sliding
          setTimeout(() => {
            setBoardOffset(-200); // Slide board 200px to the left
          }, 500);
        } else if (newProgress === 60) {
          // Sharp reset to 200px right (off-screen), then slide in
          setDisableTransition(true);
          setBoardOffset(200); // Position fresh board 200px to the right (off-screen)
          // Re-enable transition and slide to center
          setTimeout(() => {
            setDisableTransition(false);
            setBoardOffset(0); // Slide fresh board into center position
          }, 50);
        }
        return newProgress >= 60 ? 0 : newProgress; // Reset after 60px (4 cycles)
      });
    };

    // Simple strike starter - no logic needed
    const startStrike = () => {
      // Just let the CSS animation handle hammer swinging
    };

    let intervalRef: NodeJS.Timeout | null = null;

    // Strike starts after initial slide-in animation, finishes after 200ms
    const firstCycle = setTimeout(() => {
      startStrike();
      setTimeout(() => finishStrike(), 200); // Finish after 200ms

      intervalRef = setInterval(() => {
        startStrike();
        setTimeout(() => finishStrike(), 200); // Finish after 200ms
      }, 1000);
    }, 600); // Start after slide-in completes (100ms + 500ms buffer)

    // Cleanup function
    return () => {
      clearTimeout(firstCycle);
      if (intervalRef) {
        clearInterval(intervalRef);
      }
    };
  }, [isVisible]);

  // Sync hammer position with nail progress automatically
  useEffect(() => {
    // Hammer position directly follows nail progress (max 45px)
    const hammerPosition = Math.min(nailProgress, 45);
    setHammerProgress(hammerPosition);
  }, [nailProgress]);

  if (!isVisible) return null;

  const content = (
    <div className="relative">
      {/* Animation container */}
      <div
        className="relative overflow-hidden"
        style={{ width: '202px', height: '192px' }}
      >
        {/* Wood base - positioned higher to show nail sinking */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            bottom: '60px',
            zIndex: 2,
            transform: `translateX(calc(-50% + ${boardOffset}px))`, // Horizontal sliding
            transition: disableTransition
              ? 'none'
              : 'transform 500ms ease-in-out', // Conditional transition
          }}
        >
          <Image
            src="/animations/wood.png"
            alt="Wood surface"
            width={120}
            height={40}
            style={{ width: '120px', height: 'auto' }}
          />
        </div>

        {/* Nail - starts touching wood surface, gets driven deeper */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2"
          style={{
            bottom: `${60 - nailProgress}px`, // Sharp movement when hammered (no transition)
            transform: `translateX(calc(-50% + ${boardOffset}px))`, // Horizontal sliding
            zIndex: 1,
            transition: disableTransition
              ? 'none'
              : 'transform 500ms ease-in-out', // Conditional transition
          }}
        >
          <Image
            src="/animations/nail.svg"
            alt="Nail"
            width={20}
            height={60}
            style={{ width: '20px', height: 'auto' }}
          />
        </div>

        {/* Hammer - swings and strikes */}
        <div
          className="absolute left-1/2 transform -translate-x-1/2 transition-all duration-500"
          style={{
            marginLeft: '-36px',
            top: `${16 + hammerProgress}px`, // Moves down with hammer progress
          }}
        >
          <div
            style={{
              animation: shouldHammerSwing
                ? 'hammerStrike 1s ease-in-out infinite'
                : 'none',
              transformOrigin: '50% 75%',
              transform: shouldHammerSwing
                ? 'rotate(-30deg) translateY(-15px)' // Start in up position when swinging
                : 'rotate(-30deg) translateY(-15px)', // Hold in up position when not swinging
            }}
          >
            <Image
              src="/animations/hammer.svg"
              alt="Hammer"
              width={80}
              height={100}
              style={{
                width: '80px',
                height: 'auto',
                transform: 'rotate(45deg)',
              }}
            />
          </div>
        </div>

        {/* Impact sparks - small black lines radiating just above nail head - hide spark 1, show sparks 2-4 */}
        {nailProgress > 0 && (
          <div
            className="absolute left-1/2 transform -translate-x-1/2 animate-sparks"
            style={{
              bottom: `${60 - nailProgress + 69}px`, // Position relative to nail head (nail bottom + nail height + 15px higher)
              transform: `translateX(calc(-50% + ${boardOffset}px))`, // Follow board sliding
              transition: disableTransition
                ? 'none'
                : 'transform 500ms ease-in-out', // Conditional transition
            }}
          >
            <div className="relative">
              {/* 4 small spark lines spaced horizontally */}
              <div
                className="absolute w-px h-2 bg-black transform -rotate-[60deg] -translate-x-px origin-bottom"
                style={{ left: '-6px' }}
              ></div>
              <div
                className="absolute w-px h-2.5 bg-black transform -rotate-[15deg] -translate-x-px origin-bottom"
                style={{ left: '-2px' }}
              ></div>
              <div
                className="absolute w-px h-2.5 bg-black transform rotate-[15deg] -translate-x-px origin-bottom"
                style={{ left: '2px' }}
              ></div>
              <div
                className="absolute w-px h-2 bg-black transform rotate-[60deg] -translate-x-px origin-bottom"
                style={{ left: '6px' }}
              ></div>
            </div>
          </div>
        )}
      </div>

      {message && (
        <p className="text-center text-lg font-medium mt-4 text-gray-800">
          {message}
        </p>
      )}
    </div>
  );

  if (!showOverlay) {
    return content;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Animation container */}
      <div className="relative z-10 bg-white rounded-lg p-8 shadow-xl">
        {content}
      </div>

      <style jsx global>{`
        @keyframes hammerStrike {
          0% {
            transform: rotate(-30deg) translateY(-15px);
          }
          20% {
            transform: rotate(5deg) translateY(10px);
          }
          100% {
            transform: rotate(-30deg) translateY(-15px);
          }
        }

        @keyframes sparks {
          0% {
            opacity: 1;
            transform: scale(1.3);
          }
          10%,
          100% {
            opacity: 0;
            transform: scale(0.8);
          }
        }

        .animate-sparks {
          animation: sparks 1s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};
