/**
 * shared.js
 * Central Spiritual Engine, Sound Synthesizer, Custom Modals & Real Firebase Auth Engine
 */
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInAnonymously,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
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

// Ranchi Benchmark Coordinates
export const RANCHI_CENTER = { lat: 23.3441, lng: 85.3096 };

// Vedic Services Catalog
export const DEFAULT_SERVICES = [
  {
    id: "griha_pravesh",
    name: "Griha Pravesh & Vastu Shanti",
    tagline: "Banish negative energies before entering your new home",
    baseFare: 3100,
    duration: "3-4 Hours",
    samagriFee: 850,
    benefits: "Purifies living spaces, invokes Lord Ganesha & Navgrah blessings.",
    icon: "fa-house-chimney-window"
  },
  {
    id: "satyanarayan_katha",
    name: "Shree Satyanarayan Maha Katha",
    tagline: "Brings peace, prosperity, and removes domestic disputes",
    baseFare: 1500,
    duration: "2 Hours",
    samagriFee: 450,
    benefits: "Attracts abundance, fulfills family wishes, brings harmony.",
    icon: "fa-book-open-reader"
  },
  {
    id: "rudrabhishek",
    name: "Maha Rudrabhishek (Shiva Puja)",
    tagline: "Destroys chronic illnesses, planetary afflictions & delays",
    baseFare: 2500,
    duration: "2.5 Hours",
    samagriFee: 750,
    benefits: "Protects against premature health issues and financial debts.",
    icon: "fa-om"
  },
  {
    id: "marriage",
    name: "Vedic Vivah Sanskar (Marriage)",
    tagline: "Holy Union conducted strictly per ancient Vedic Shastras",
    baseFare: 11000,
    duration: "Full Ceremony",
    samagriFee: 2500,
    benefits: "Complete 7 Phere, Kanyadaan, and Havan solemnized by Vedic scholars.",
    icon: "fa-ring"
  },
  {
    id: "navgrah_shanti",
    name: "Navgrah Dosh Nivaran Havan",
    tagline: "Calms Saturn (Shani), Rahu-Ketu, and planetary turbulence",
    baseFare: 2100,
    duration: "2 Hours",
    samagriFee: 650,
    benefits: "Removes sudden career roadblocks and business stagnation.",
    icon: "fa-sun"
  },
  {
    id: "mahamrityunjaya",
    name: "Mahamrityunjaya Jaap & Havan",
    tagline: "Powerful shield for health crises, surgery, and long life",
    baseFare: 3500,
    duration: "3 Hours",
    samagriFee: 950,
    benefits: "Supreme Vedic kavach for longevity and recovery.",
    icon: "fa-heart-pulse"
  }
];

/* ========================================================
   WEB AUDIO SOUND ENGINE
======================================================== */
class SoundEngine {
  constructor() {
    this.ctx = null;
  }
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }
  playNotification() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15);
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.4);
  }
  playSuccess() {
    this.init();
    const now = this.ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + i * 0.1);
      gain.gain.setValueAtTime(0.2, now + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.4);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now + i * 0.1);
      osc.stop(now + i * 0.1 + 0.4);
    });
  }
  playTempleBell() {
    this.init();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 1.2);
    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 1.2);
  }
}

export const sounds = new SoundEngine();

/* ========================================================
   CUSTOM TOAST & DIALOG ENGINE
======================================================== */
export function showToast(message, type = "info") {
  sounds.playNotification();
  let container = document.getElementById("vaidika-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "vaidika-toast-container";
    container.className = "fixed bottom-5 right-5 z-[9999] space-y-2 max-w-sm w-full px-4 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto p-4 rounded-2xl shadow-2xl border flex items-center gap-3 transform transition-all duration-300 translate-y-5 opacity-0 ${
    type === "success"
      ? "bg-emerald-900/95 text-emerald-100 border-emerald-500/50"
      : type === "error"
      ? "bg-rose-900/95 text-rose-100 border-rose-500/50"
      : "bg-slate-900/95 text-slate-100 border-amber-500/50"
  }`;

  const icon = type === "success" ? "fa-circle-check text-emerald-400" : type === "error" ? "fa-triangle-exclamation text-rose-400" : "fa-bell text-amber-400";
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-lg"></i>
    <div class="text-xs font-semibold leading-relaxed flex-1">${message}</div>
    <button class="text-slate-400 hover:text-white text-xs px-1">&times;</button>
  `;

  toast.querySelector("button").onclick = () => toast.remove();
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("translate-y-5", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "translate-y-5");
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

export function showCustomModal({ title, message, icon = "fa-om", confirmText = "Acknowledge", cancelText = null, onConfirm = null }) {
  sounds.playTempleBell();
  const existing = document.getElementById("vaidika-custom-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "vaidika-custom-modal";
  overlay.className = "fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4";
  
  overlay.innerHTML = `
    <div class="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/40 text-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl shadow-amber-500/10">
      <div class="w-14 h-14 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-2xl">
        <i class="fa-solid ${icon}"></i>
      </div>
      <h3 class="font-black text-lg text-amber-300 tracking-wide">${title}</h3>
      <p class="text-xs text-slate-300 leading-relaxed">${message}</p>
      <div class="flex gap-2 pt-2">
        ${cancelText ? `<button id="v-modal-cancel" class="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">${cancelText}</button>` : ""}
        <button id="v-modal-confirm" class="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black text-xs shadow-lg shadow-amber-500/20">${confirmText}</button>
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
  RecaptchaVerifier,
  signInWithPhoneNumber,
  sendPasswordResetEmail,
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
