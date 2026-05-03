import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const lines = [
  { text: '> Initializing portfolio...', delay: 0 },
  { text: '> Loading AI modules ████████ 100%', delay: 800 },
  { text: '> Connecting neural networks...', delay: 1600 },
  { text: '> System ready.', delay: 2400 },
];

export default function TerminalIntro({ onComplete }: { onComplete: () => void }) {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const [typedText, setTypedText] = useState<string[]>([]);
  const [isDismissing, setIsDismissing] = useState(false);

  useEffect(() => {
    if (visibleLines >= lines.length) {
      const timer = setTimeout(() => {
        setIsDismissing(true);
        setTimeout(onComplete, 600);
      }, 700);
      return () => clearTimeout(timer);
    }

    const currentLine = lines[visibleLines];
    const timer = setTimeout(() => {
      // Type character by character
      let charIndex = 0;
      const text = currentLine.text;
      const typeInterval = setInterval(() => {
        charIndex++;
        setTypedText(prev => {
          const updated = [...prev];
          updated[visibleLines] = text.slice(0, charIndex);
          return updated;
        });
        if (charIndex >= text.length) {
          clearInterval(typeInterval);
          setVisibleLines(prev => prev + 1);
        }
      }, 25);
      return () => clearInterval(typeInterval);
    }, visibleLines === 0 ? 300 : 400);

    return () => clearTimeout(timer);
  }, [visibleLines, onComplete]);

  return (
    <AnimatePresence>
      {!isDismissing && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex items-center justify-center"
          style={{ background: 'hsl(var(--background))' }}
        >
          <div className="w-full max-w-lg mx-auto px-6">
            {/* Terminal window */}
            <div className="rounded-xl overflow-hidden border border-border/30" style={{ background: 'rgba(255,255,255,0.02)' }}>
              {/* Title bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/20">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-gradient-yellow/60" style={{ background: 'hsl(50 100% 50% / 0.6)' }} />
                <div className="w-3 h-3 rounded-full bg-primary/40" />
                <span className="ml-3 text-xs text-muted-foreground/50 font-mono">terminal — portfolio</span>
              </div>

              {/* Terminal body */}
              <div className="p-6 font-mono text-sm space-y-2 min-h-[160px]">
                {typedText.map((line, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <span className={i === lines.length - 1 && visibleLines >= lines.length ? 'text-primary' : 'text-muted-foreground/80'}>
                      {line}
                    </span>
                    {i === visibleLines - 1 && visibleLines < lines.length && (
                      <span className="w-2 h-4 bg-primary/80 animate-pulse" />
                    )}
                  </div>
                ))}
                {visibleLines <= lines.length && typedText.length <= visibleLines && (
                  <span className="w-2 h-4 bg-primary/80 animate-pulse inline-block" />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
