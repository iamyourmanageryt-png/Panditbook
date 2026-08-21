/**
 * shared.js
 * Central Firebase Engine, Role Management & System Configuration
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

export const RANCHI_CENTER = { lat: 23.3441, lng: 85.3096 };

// Clean Services Catalog (NO IMAGES, NO PREMATURE PRICES)
export const DEFAULT_SERVICES = [
  {
    id: "griha_pravesh",
    name: "Griha Pravesh & Vastu Shanti",
    hindiName: "गृह प्रवेश एवं वास्तु शांति",
    tagline: "Purify new living spaces and invoke Lord Ganesha & Navgrah blessings",
    duration: "3-4 Hours",
    samagriFee: 850,
    icon: "fa-house-chimney-window"
  },
  {
    id: "satyanarayan_katha",
    name: "Shree Satyanarayan Maha Katha",
    hindiName: "श्री सत्यनारायण महाकथा",
    tagline: "Brings peace, prosperity, and removes domestic obstacles",
    duration: "2 Hours",
    samagriFee: 450,
    icon: "fa-book-open-reader"
  },
  {
    id: "rudrabhishek",
    name: "Maha Rudrabhishek (Shiva Puja)",
    hindiName: "महा रुद्राभिषेक शिव पूजा",
    tagline: "Powerful shield against chronic health issues and planetary doshas",
    duration: "2.5 Hours",
    samagriFee: 750,
    icon: "fa-om"
  },
  {
    id: "marriage",
    name: "Vedic Vivah Sanskar (Marriage)",
    hindiName: "वैदिक विवाह संस्कार",
    tagline: "Holy 7 Phere and Kanyadaan conducted strictly per Vedic Shastras",
    duration: "Full Day Ceremony",
    samagriFee: 2500,
    icon: "fa-ring"
  },
  {
    id: "navgrah_shanti",
    name: "Navgrah Dosh Nivaran Havan",
    hindiName: "नवग्रह शांति महायज्ञ",
    tagline: "Calms Shani, Rahu-Ketu, and planetary turbulence",
    duration: "2 Hours",
    samagriFee: 650,
    icon: "fa-sun"
  },
  {
    id: "mahamrityunjaya",
    name: "Mahamrityunjaya Jaap & Havan",
    hindiName: "महामृत्युंजय जाप एवं हवन",
    tagline: "Supreme kavach for recovery, vitality, and longevity",
    duration: "3 Hours",
    samagriFee: 950,
    icon: "fa-heart-pulse"
  }
];

/* ========================================================
   TOAST & MODAL ENGINE
======================================================== */
export function showToast(message, type = "info") {
  let container = document.getElementById("vaidika-toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "vaidika-toast-container";
    container.className = "fixed top-5 left-1/2 -translate-x-1/2 z-[99999] space-y-2 max-w-xs w-full px-4 pointer-events-none";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = `pointer-events-auto p-3.5 rounded-2xl shadow-2xl border flex items-center gap-2.5 transform transition-all duration-300 -translate-y-5 opacity-0 text-xs font-bold ${
    type === "success"
      ? "bg-emerald-950 text-emerald-100 border-emerald-500/50"
      : type === "error"
      ? "bg-rose-950 text-rose-100 border-rose-500/50"
      : "bg-slate-900 text-slate-100 border-amber-500/50"
  }`;

  const icon = type === "success" ? "fa-circle-check text-emerald-400" : type === "error" ? "fa-triangle-exclamation text-rose-400" : "fa-bell text-amber-400";
  toast.innerHTML = `
    <i class="fa-solid ${icon} text-sm"></i>
    <div class="flex-1 leading-snug">${message}</div>
    <button class="text-slate-400 hover:text-white">&times;</button>
  `;

  toast.querySelector("button").onclick = () => toast.remove();
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove("-translate-y-5", "opacity-0");
  });

  setTimeout(() => {
    toast.classList.add("opacity-0", "-translate-y-5");
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

export function showCustomModal({ title, message, icon = "fa-om", confirmText = "Acknowledge", cancelText = null, onConfirm = null }) {
  const existing = document.getElementById("vaidika-custom-modal");
  if (existing) existing.remove();

  const overlay = document.createElement("div");
  overlay.id = "vaidika-custom-modal";
  overlay.className = "fixed inset-0 bg-slate-950/85 backdrop-blur-sm z-[99999] flex items-center justify-center p-4";
  
  overlay.innerHTML = `
    <div class="bg-slate-900 border border-amber-500/40 text-white rounded-3xl max-w-xs w-full p-6 text-center space-y-4 shadow-2xl">
      <div class="w-12 h-12 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 text-xl">
        <i class="fa-solid ${icon}"></i>
      </div>
      <h3 class="font-black text-base text-amber-300">${title}</h3>
      <p class="text-xs text-slate-300 leading-relaxed">${message}</p>
      <div class="flex gap-2 pt-2">
        ${cancelText ? `<button id="v-modal-cancel" class="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300">${cancelText}</button>` : ""}
        <button id="v-modal-confirm" class="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 text-slate-950 font-black text-xs">${confirmText}</button>
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
