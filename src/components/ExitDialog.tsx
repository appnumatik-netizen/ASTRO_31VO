import { useState } from "react";
import { X, LogOut, AlertTriangle } from "lucide-react";
import { playPopSound } from "@/hooks/useAudio";
import { exitApp } from "@/lib/exitApp";

interface ExitDialogProps {
  className?: string;
}

const ExitDialog = ({ className = "" }: ExitDialogProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [showBrowserWarning, setShowBrowserWarning] = useState(false);

  const handleExit = () => {
    playPopSound();
    // Always show confirmation dialog first
    setShowDialog(true);
  };

  const confirmExit = () => {
    playPopSound();

    // Try to exit using native methods
    const ok = exitApp();
    
    if (!ok) {
      // If native exit failed, try browser methods
      try {
        // Try to close the window (works for popups/PWAs opened via window.open)
        window.close();
        
        // If window.close() didn't work (still here after a short delay)
        setTimeout(() => {
          // Show browser warning if we're still here
          setShowDialog(false);
          setShowBrowserWarning(true);
        }, 100);
      } catch {
        setShowDialog(false);
        setShowBrowserWarning(true);
      }
    }
  };

  const cancelExit = () => {
    playPopSound();
    setShowDialog(false);
  };

  const closeBrowserWarning = () => {
    playPopSound();
    setShowBrowserWarning(false);
  };

  return (
    <>
      <button
        onClick={handleExit}
        className={`w-10 h-10 rounded-full bg-card/80 backdrop-blur border border-border 
          flex items-center justify-center text-destructive hover:border-destructive/60 
          hover:bg-destructive/10 hover:scale-105 active:scale-95
          transition-all duration-300 cursor-pointer ${className}`}
        title="Keluar Aplikasi"
        aria-label="Keluar Aplikasi"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Confirmation Dialog */}
      {showDialog && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          onClick={cancelExit}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 max-w-sm w-[90vw] text-center animate-scale-in shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-destructive/20 flex items-center justify-center mx-auto mb-4 
              border-2 border-destructive/30">
              <LogOut className="w-8 h-8 text-destructive" />
            </div>
            
            {/* Title */}
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Keluar dari NUMATIK?
            </h2>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm font-body mb-6 leading-relaxed">
              Apakah kamu yakin ingin keluar dari aplikasi? Progres belajarmu akan tetap tersimpan.
            </p>
            
            {/* Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={cancelExit}
                className="font-display text-sm px-6 py-2.5 rounded-xl bg-muted text-foreground cursor-pointer 
                  hover:bg-muted/80 active:scale-95 transition-all duration-200 border border-border"
              >
                Tidak, Tetap di Sini
              </button>
              <button
                onClick={confirmExit}
                className="font-display text-sm px-6 py-2.5 rounded-xl bg-destructive text-destructive-foreground 
                  cursor-pointer hover:bg-destructive/90 active:scale-95 transition-all duration-200
                  shadow-lg shadow-destructive/20"
              >
                Ya, Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Browser Warning Dialog */}
      {showBrowserWarning && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-md"
          onClick={closeBrowserWarning}
        >
          <div 
            className="bg-card border border-border rounded-2xl p-6 max-w-sm w-[90vw] text-center animate-scale-in shadow-2xl"
            style={{
              background: "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.98) 100%)",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)"
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mx-auto mb-4
              border-2 border-accent/30">
              <AlertTriangle className="w-8 h-8 text-accent" />
            </div>
            
            {/* Title */}
            <h2 className="font-display text-xl font-bold text-foreground mb-2">
              Tidak Dapat Keluar Otomatis
            </h2>
            
            {/* Description */}
            <p className="text-muted-foreground text-sm font-body mb-4 leading-relaxed">
              Aplikasi berjalan di browser dan tidak dapat ditutup secara otomatis.
            </p>
            
            {/* Instructions */}
            <div className="bg-muted/50 rounded-xl p-4 mb-6 text-left">
              <p className="text-xs text-foreground/80 font-body leading-relaxed">
                <strong className="text-foreground">Untuk keluar:</strong>
                <br />
                - Tutup tab browser ini secara manual
                <br />
                - Atau tekan tombol kembali di browser
              </p>
            </div>
            
            <button
              onClick={closeBrowserWarning}
              className="font-display text-sm px-8 py-2.5 rounded-xl bg-primary text-primary-foreground 
                cursor-pointer hover:bg-primary/90 active:scale-95 transition-all duration-200
                shadow-lg shadow-primary/20"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ExitDialog;
