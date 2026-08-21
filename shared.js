/**
 * shared.js
 * Central Spiritual Engine, Wallet Management, Non-intrusive Alerts & Firebase Configuration
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  GeoPoint,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase App Config
export const firebaseConfig = {
  apiKey: "AIzaSyAZ_c3EaDxSZ6RrNrwQjR_TauJHrPfk_lk",
  authDomain: "designsnap-f3309.firebaseapp.com",
  databaseURL: "https://designsnap-f3309-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "designsnap-f3309",
  storageBucket: "designsnap-f3309.firebasestorage.app",
  messagingSenderId: "741888249963",
  appId: "1:741888249963:web:9540c9f68d6f0d5da9a12e",
  measurementId: "G-YC8TDQF1MM"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Ranchi Coordinates Benchmark
export const RANCHI_CENTER = { lat: 23.3441, lng: 85.3096 };

// Vedic Services Catalog (NO BASE PRICES - Prices come exclusively from Purohits)
export const DEFAULT_SERVICES = [
  {
    id: "griha_pravesh",
    name: "Griha Pravesh & Vastu Shanti",
    hindiName: "गृह प्रवेश एवं वास्तु शांति",
    tagline: "Banish negative energies and invite Mahalakshmi to your new home",
    duration: "3-4 Hours",
    samagriFee: 850,
    icon: "fa-house-chimney-window",
    image: "https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=600&q=80",
    benefits: ["Cleanses vastu dosha", "Navgrah & Ganesha invocation", "Family prosperity & peace"]
  },
  {
    id: "satyanarayan_katha",
    name: "Shree Satyanarayan Maha Katha",
    hindiName: "श्री सत्यनारायण महाकथा",
    tagline: "Brings family harmony, fulfills long-awaited wishes, and ensures abundance",
    duration: "2 Hours",
    samagriFee: 450,
    icon: "fa-book-open-reader",
    image: "https://images.unsplash.com/photo-1545232979-fbf68fe9b10d?auto=format&fit=crop&w=600&q=80",
    benefits: ["Dissolves domestic conflict", "Attracts financial stability", "Consecrated Panchamrit prasad"]
  },
  {
    id: "rudrabhishek",
    name: "Maha Rudrabhishek (Shiva Puja)",
    hindiName: "महा रुद्राभिषेक शिव पूजा",
    tagline: "Supreme Vedic shield against chronic illnesses, debts, and planetary delays",
    duration: "2.5 Hours",
    samagriFee: 750,
    icon: "fa-om",
    image: "https://images.unsplash.com/photo-1583083527882-4bee9aba2eea?auto=format&fit=crop&w=600&q=80",
    benefits: ["Neutralizes malefic planetary dosha", "Restores vitality and health", "Bholenath's divine protection"]
  },
  {
    id: "marriage",
    name: "Vedic Vivah Sanskar (Marriage)",
    hindiName: "वैदिक विवाह संस्कार",
    tagline: "Holy 7 Phere, Kanyadaan, and Havan strictly solemnized per ancient Shastras",
    duration: "Full Day",
    samagriFee: 2500,
    icon: "fa-ring",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=600&q=80",
    benefits: ["Complete 7 Phere ceremony", "Vedic Havan & Sindoor Daan", "Scholar-chanted Mangalashtak"]
  },
  {
    id: "navgrah_shanti",
    name: "Navgrah Dosh Nivaran Havan",
    hindiName: "नवग्रह शांति महायज्ञ",
    tagline: "Calms Saturn (Shani), Rahu-Ketu, and planetary turbulence",
    duration: "2 Hours",
    samagriFee: 650,
    icon: "fa-sun",
    image: "https://images.unsplash.com/photo-1608889825103-e5dfe9341829?auto=format&fit=crop&w=600&q=80",
    benefits: ["Soothes Sade Sati & Dhaiya", "Removes business stagnation", "Harmonizes all 9 cosmic planets"]
  },
  {
    id: "mahamrityunjaya",
    name: "Mahamrityunjaya Jaap & Havan",
    hindiName: "महामृत्युंजय जाप एवं हवन",
    tagline: "Immortal Shiva kavach for longevity, surgery recovery, and health crises",
    duration: "3 Hours",
    samagriFee: 950,
    icon: "fa-heart-pulse",
    image: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=600&q=80",
    benefits: ["Averts premature accidents", "Powerful healing vibrations", "Long and peaceful lifespan"]
  }
];

/* ========================================================
   NOTIFICATION & SOUND CONTROLLER
======================================================== */
class AlertEngine {
  constructor() {
    this.audioCtx = null;
    this.ringTimer = null;
  }

  initAudio() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioCtx.state === "suspended") {
      this.audioCtx.resume();
    }
  }

  async requestPermission() {
    if ("Notification" in window && Notification.permission !== "granted" && Notification.permission !== "denied") {
      await Notification.requestPermission();
    }
  }

  pushNotification(title, body) {
    if ("vibrate" in navigator) {
      navigator.vibrate([400, 150, 400]);
    }
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "https://cdn-icons-png.flaticon.com/512/3655/3655581.png"
        });
      } catch (e) {}
    }
  }

  startPanditRinger() {
    this.initAudio();
    this.stopPanditRinger();

    const ring = () => {
      if (!this.audioCtx) return;
      const now = this.audioCtx.currentTime;
      const osc = this.audioCtx.createOscillator();
      const gain = this.audioCtx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, now);
      osc.frequency.setValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      osc.connect(gain);
      gain.connect(this.audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.6);
    };

    ring();
    this.ringTimer = setInterval(ring, 2000);

    if ("vibrate" in navigator) {
      navigator.vibrate([400, 200, 400, 200, 400]);
    }
  }

  stopPanditRinger() {
    if (this.ringTimer) {
      clearInterval(this.ringTimer);
      this.ringTimer = null;
    }
  }
}

export const alertEngine = new AlertEngine();

/* ========================================================
   CUSTOM TOAST & MODAL ENGINE
======================================================== */
export function showToast(message, type = "info") {
  let container = document.getElementById("vaidika-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "vaidika-toast-container";
    container.className = "fixed top-6 left-1/2 -translate-x-1/2 z-[99999] space-y-2 max-w-sm w-full px-4 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transform transition-all duration-300 -translate-y-6 opacity-0 text-xs font-bold backdrop-blur-md ${
    type === "success"
      ? "bg-emerald-950/95 text-emerald-100 border-emerald-500/50 shadow-emerald-900/30"
      : type === "error"
      ? "bg-rose-950/95 text-rose-100 border-rose-500/50 shadow-rose-900/30"
      : "bg-slate-900/95 text-slate-100 border-amber-500/50 shadow-amber-900/30"
  }`;

  const icon = type === "success" ? "fa-circle-check text-emerald-400" : type === "error" ? "fa-triangle-exclamation text-rose-400" : "fa-bell text-amber-400";
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-base"></i>
    <div class="flex-1 leading-snug">${message}</div>
    <button class="text-slate-400 hover:text-white text-sm">&times;</button>
  `;

  toast.querySelector("button").onclick = () => toast.remove();
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("-translate-y-6", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-6");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function showCustomModal({ title, message, icon = "fa-om", confirmText = "Acknowledge", cancelText = null, onConfirm = null }) {
  const existing = document.getElementById("vaidika-custom-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "vaidika-custom-modal";
  overlay.className = "fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[99999] flex items-center justify-center p-4";
  
  overlay.innerHTML = `
    <div class="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 text-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl shadow-amber-500/10 animate-scale-up">
      <div class="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
        <i class="fa-solid ${icon}"></i>
      </div>
      <h3 class="font-black text-lg text-amber-300">${title}</h3>
      <p class="text-xs text-slate-300 leading-relaxed">${message}</p>
      <div class="flex gap-2 pt-2">
        ${cancelText ? `<button id="v-modal-cancel" class="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 transition">${cancelText}</button>` : ""}
        <button id="v-modal-confirm" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black text-xs shadow-lg transition">${confirmText}</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  if (cancelText) {
    overlay.querySelector("#v-modal-cancel").onclick = () => overlay.remove();
  }
  overlay.querySelector("#v-modal-confirm").onclick = () => {
    overlay.remove();
    if (onConfirm) onConfirm();
  };
}

export async function getPlatformSettings() {
  const settingsRef = doc(db, "settings", "platform");
  const snap = await getDoc(settingsRef);
  if (snap.exists()) {
    return snap.data();
  }
  const defaultSettings = {
    paymentMethod: "upi",
    upiId: "vaidika.ranchi@okaxis",
    upiPayeeName: "Vaidika Devasthan Seva Trust",
    paymentLinkUrl: "https://pages.razorpay.com/sample-dakshina-ranchi",
    whatsappNumber: "919123456780",
    platformCommissionPercent: 10,
    featuredAdPricePerDay: 99,
    updatedAt: serverTimestamp()
  };
  await setDoc(settingsRef, defaultSettings);
  return defaultSettings;
}

export {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  updateProfile,
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  GeoPoint,
  serverTimestamp
};
