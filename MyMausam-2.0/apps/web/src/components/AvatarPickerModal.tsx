"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  X,
  Upload,
  Camera,
  Check,
  Sparkles,
  Image as ImageIcon,
  Trash2,
  Smile,
  ShieldCheck,
  RefreshCw,
  SwitchCamera,
  AlertCircle,
  Video,
  VideoOff,
  Lock,
  Smartphone,
  HelpCircle,
} from "lucide-react";
import { AVATAR_PRESETS, AvatarPreset } from "@/lib/avatars";
import { useAuth } from "@/context/AuthContext";
import { UserAvatar } from "@/components/UserAvatar";

export interface AvatarPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "presets" | "camera" | "upload";
  currentAvatarId?: string;
  currentAvatarUrl?: string;
  onSave?: (selected: { avatarId?: string; avatarUrl?: string }) => void;
}

export const AvatarPickerModal: React.FC<AvatarPickerModalProps> = ({
  isOpen,
  onClose,
  initialTab = "presets",
  currentAvatarId,
  currentAvatarUrl,
  onSave,
}) => {
  const { user, updateProfile } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nativeCameraInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [activeTab, setActiveTab] = useState<"presets" | "camera" | "upload">(initialTab);
  const [selectedPresetId, setSelectedPresetId] = useState<string | undefined>(
    currentAvatarId || user?.avatarId || "farmer_sun"
  );
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(
    currentAvatarUrl !== undefined ? currentAvatarUrl : user?.avatarUrl
  );
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [isUploading, setIsUploading] = useState(false);

  // Camera state
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraPermissionDismissed, setCameraPermissionDismissed] = useState(false);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  const [flashEffect, setFlashEffect] = useState(false);
  const [showPermissionGuide, setShowPermissionGuide] = useState(false);

  // Stop camera helper
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  }, [stream]);

  // Start camera helper with resilient permission handling
  const startCamera = useCallback(async (mode: "user" | "environment") => {
    setCameraError(null);
    setCameraPermissionDismissed(false);
    setIsCameraStarting(true);
    setCapturedPhoto(null);

    // Stop existing stream first
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }

    try {
      if (!navigator?.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported in this browser. Please use native camera or upload.");
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 640 },
          height: { ideal: 640 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn("Camera access result:", err);
      let msg = "Could not start camera feed.";

      if (
        err.name === "NotAllowedError" ||
        err.name === "PermissionDeniedError" ||
        err.message?.toLowerCase().includes("permission dismissed") ||
        err.message?.toLowerCase().includes("dismissed")
      ) {
        setCameraPermissionDismissed(true);
        msg = "Camera permission was dismissed or blocked by the browser.";
      } else if (err.name === "NotFoundError" || err.name === "DevicesNotFoundError") {
        msg = "No physical camera detected on this device.";
      } else if (err.name === "NotReadableError" || err.name === "TrackStartError") {
        msg = "Camera is currently in use by another application or tab.";
      } else {
        msg = err.message || "Unable to access live camera.";
      }

      setCameraError(msg);
    } finally {
      setIsCameraStarting(false);
    }
  }, [stream]);

  // Handle modal open/close & sync state
  useEffect(() => {
    if (isOpen) {
      setSelectedPresetId(currentAvatarId || user?.avatarId || "farmer_sun");
      setPreviewUrl(currentAvatarUrl !== undefined ? currentAvatarUrl : user?.avatarUrl);
      setActiveTab(initialTab);
      setCapturedPhoto(null);
      setCameraError(null);
      setCameraPermissionDismissed(false);
    } else {
      stopCamera();
    }
  }, [isOpen, initialTab, currentAvatarId, currentAvatarUrl, user]);

  // Start or stop camera based on active tab
  useEffect(() => {
    if (isOpen && activeTab === "camera") {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [activeTab, isOpen, facingMode]);

  // Attach stream to video tag whenever stream or videoRef changes
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play().catch(() => {});
    }
  }, [stream]);

  if (!isOpen) return null;

  const categories = [
    { id: "all", label: "All Avatars" },
    { id: "persona", label: "Personas" },
    { id: "weather", label: "Weather" },
    { id: "official", label: "Official" },
    { id: "citizen", label: "Citizens" },
  ];

  const filteredPresets =
    activeCategory === "all"
      ? AVATAR_PRESETS
      : AVATAR_PRESETS.filter((p) => p.category === activeCategory);

  const handleSelectPreset = (preset: AvatarPreset) => {
    setSelectedPresetId(preset.id);
    setPreviewUrl(undefined);
    setCapturedPhoto(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert("Image size should be less than 4MB.");
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewUrl(dataUrl);
      setCapturedPhoto(dataUrl);
      setSelectedPresetId(undefined);
      setIsUploading(false);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleCapturePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement("canvas");

    const size = Math.min(video.videoWidth || 480, video.videoHeight || 480);
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Trigger visual shutter flash
    setFlashEffect(true);
    setTimeout(() => setFlashEffect(false), 200);

    const startX = ((video.videoWidth || size) - size) / 2;
    const startY = ((video.videoHeight || size) - size) / 2;

    if (facingMode === "user") {
      ctx.translate(size, 0);
      ctx.scale(-1, 1);
    }

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
    setCapturedPhoto(dataUrl);
    setPreviewUrl(dataUrl);
    setSelectedPresetId(undefined);
    stopCamera();
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    setPreviewUrl(user?.avatarUrl);
    startCamera(facingMode);
  };

  const handleFlipCamera = () => {
    const nextMode = facingMode === "user" ? "environment" : "user";
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleRemoveCustomPhoto = () => {
    setPreviewUrl(undefined);
    setCapturedPhoto(null);
    setSelectedPresetId("farmer_sun");
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (nativeCameraInputRef.current) nativeCameraInputRef.current.value = "";
  };

  const handleApply = async () => {
    stopCamera();
    if (onSave) {
      onSave({ avatarId: selectedPresetId, avatarUrl: previewUrl });
    } else if (user) {
      await updateProfile({
        avatarId: selectedPresetId,
        avatarUrl: previewUrl || undefined,
      });
    }
    onClose();
  };

  const handleModalClose = () => {
    stopCamera();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm select-none">
      {/* Hidden canvas for photo capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Hidden native device camera capture input */}
      <input
        type="file"
        ref={nativeCameraInputRef}
        accept="image/*"
        capture="user"
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="bg-[#032442] border border-white/20 text-white w-full max-w-[440px] rounded-3xl p-5 shadow-2xl relative max-h-[92vh] flex flex-col animate-scale-up">
        {/* Close Button */}
        <button
          onClick={handleModalClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/80 transition z-10"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center pt-2 pb-2">
          <h2 className="text-base font-black text-white flex items-center justify-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#FFBE00]" />
            Choose Your Avatar & PFP
          </h2>
          <p className="text-[11px] text-white/70">Pick an avatar preset, click a live photo, or upload an image</p>
        </div>

        {/* Live Preview Card */}
        <div className="bg-white/10 rounded-2xl p-3 mb-3 flex items-center gap-3 border border-white/15 shrink-0">
          <UserAvatar
            avatarId={selectedPresetId}
            avatarUrl={previewUrl}
            name={user?.name || "Mausam User"}
            size="xl"
            ringColor="ring-[#00DDE5]"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-white text-sm truncate">
                {user?.name || "Citizen Profile Preview"}
              </h3>
              <ShieldCheck className="w-3.5 h-3.5 text-[#00DDE5] shrink-0" />
            </div>
            <p className="text-[11px] text-[#00DDE5] font-semibold truncate">
              {capturedPhoto
                ? "Live Camera Photo Captured 📸"
                : previewUrl
                ? "Custom Uploaded Photo"
                : AVATAR_PRESETS.find((p) => p.id === selectedPresetId)?.name || "Preset Avatar"}
            </p>
            <p className="text-[10px] text-white/50 truncate">
              {previewUrl
                ? "Photo will be saved as your official PFP"
                : AVATAR_PRESETS.find((p) => p.id === selectedPresetId)?.description || ""}
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Presets | Camera Live | Upload File) */}
        <div className="flex bg-white/10 p-1 rounded-2xl mb-3 text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab("presets")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === "presets"
                ? "bg-[#0055A6] text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Smile className="w-3.5 h-3.5" />
            Presets
          </button>
          <button
            onClick={() => setActiveTab("camera")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === "camera"
                ? "bg-[#0055A6] text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-[#00DDE5]" />
            Live Camera
          </button>
          <button
            onClick={() => setActiveTab("upload")}
            className={`flex-1 py-1.5 rounded-xl transition flex items-center justify-center gap-1 ${
              activeTab === "upload"
                ? "bg-[#0055A6] text-white shadow-md"
                : "text-white/70 hover:text-white"
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            Upload File
          </button>
        </div>

        {/* TAB 1: PRESETS */}
        {activeTab === "presets" && (
          <div className="flex-1 flex flex-col min-h-0">
            {/* Category Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none shrink-0">
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveCategory(c.id)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-bold whitespace-nowrap transition border ${
                    activeCategory === c.id
                      ? "bg-white text-[#0055A6] border-white shadow-xs"
                      : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Presets Grid */}
            <div className="grid grid-cols-4 gap-2 overflow-y-auto pr-1 flex-1 max-h-[220px]">
              {filteredPresets.map((preset) => {
                const isSelected = selectedPresetId === preset.id && !previewUrl;
                return (
                  <button
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset)}
                    className={`flex flex-col items-center p-2 rounded-2xl border transition relative group ${
                      isSelected
                        ? "bg-white/20 border-[#00DDE5] ring-2 ring-[#00DDE5] scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/15"
                    }`}
                  >
                    <div
                      className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${preset.bgGradient} flex items-center justify-center shadow-md text-xl`}
                    >
                      <span>{preset.emoji}</span>
                    </div>
                    <span className="text-[10px] font-bold text-white/90 mt-1 truncate w-full text-center">
                      {preset.name}
                    </span>
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#00DDE5] text-[#06345C] flex items-center justify-center shadow">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: LIVE CAMERA CAPTURE */}
        {activeTab === "camera" && (
          <div className="flex-1 flex flex-col items-center justify-center min-h-0 relative">
            {cameraError ? (
              /* Permission Dismissed / Blocked / Error UI with Instant Fallbacks */
              <div className="text-center p-4 bg-white/5 border border-white/20 rounded-3xl space-y-3 w-full animate-fade-in">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-300">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white">
                    {cameraPermissionDismissed ? "Camera Access Blocked or Dismissed" : "Camera Access Notice"}
                  </h4>
                  <p className="text-[11px] text-white/70 mt-1">
                    {cameraError}
                  </p>
                </div>

                {/* Direct 1-Tap Options */}
                <div className="space-y-2 pt-1">
                  {/* Primary Fallback: Native Camera Capture (bypasses browser WebRTC permission block) */}
                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-[#00DDE5] to-[#0055A6] text-white font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-2"
                  >
                    <Smartphone className="w-4 h-4 text-[#FFBE00]" />
                    Take Photo with Device Camera 📸
                  </button>

                  <div className="flex gap-2">
                    {/* User-Gesture Direct Permission Re-request */}
                    <button
                      type="button"
                      onClick={() => startCamera(facingMode)}
                      className="flex-1 py-2 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/15"
                    >
                      <RefreshCw className="w-3.5 h-3.5" /> Retry Permission
                    </button>

                    {/* File Upload Fallback */}
                    <button
                      type="button"
                      onClick={() => setActiveTab("upload")}
                      className="flex-1 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/80 text-xs font-bold transition flex items-center justify-center gap-1.5 border border-white/10"
                    >
                      <Upload className="w-3.5 h-3.5" /> Upload File
                    </button>
                  </div>
                </div>

                {/* How to enable instructions toggle */}
                <div className="pt-1 text-left bg-black/30 p-2.5 rounded-xl border border-white/10 text-[10px] space-y-1">
                  <div className="font-bold text-[#00DDE5] flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    How to enable in browser:
                  </div>
                  <p className="text-white/60">
                    Click the 🔒 icon next to <b>localhost:3000</b> in your browser URL bar → Set <b>Camera</b> to <b>Allow</b> → Click Retry.
                  </p>
                </div>
              </div>
            ) : capturedPhoto ? (
              /* Freeze Frame Captured State */
              <div className="flex flex-col items-center justify-center space-y-3 w-full py-2">
                <div className="relative w-48 h-48 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#00DDE5] bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={capturedPhoto} alt="Captured Selfie" className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-[#8ED329] text-[#06345C] text-[10px] font-black flex items-center gap-1 shadow">
                    <Check className="w-3 h-3 stroke-[3]" /> Photo Ready
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleRetake}
                    className="px-3.5 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Retake Photo
                  </button>
                  <button
                    type="button"
                    onClick={handleApply}
                    className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] text-[#06345C] text-xs font-bold shadow transition flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Use as PFP
                  </button>
                </div>
              </div>
            ) : (
              /* Live Camera Viewfinder */
              <div className="flex flex-col items-center justify-center space-y-3 w-full py-1">
                <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-[#00DDE5]/60 bg-black flex items-center justify-center">
                  {/* Shutter Flash Animation */}
                  {flashEffect && (
                    <div className="absolute inset-0 bg-white z-20 animate-fade-in pointer-events-none" />
                  )}

                  {/* Live Video Feed */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className={`w-full h-full object-cover ${
                      facingMode === "user" ? "scale-x-[-1]" : ""
                    }`}
                  />

                  {/* Circular Face framing guide */}
                  <div className="absolute inset-2 border-2 border-dashed border-white/40 rounded-full pointer-events-none flex items-center justify-center">
                    <div className="w-2 h-2 rounded-full bg-[#00DDE5]/60" />
                  </div>

                  {isCameraStarting && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-xs text-white gap-2">
                      <RefreshCw className="w-6 h-6 animate-spin text-[#00DDE5]" />
                      <span>Requesting Camera...</span>
                    </div>
                  )}

                  {/* Switch camera button */}
                  <button
                    type="button"
                    onClick={handleFlipCamera}
                    title="Switch Camera (Front / Back)"
                    className="absolute top-2.5 right-2.5 p-2 rounded-full bg-black/60 hover:bg-black/80 text-white transition backdrop-blur-sm border border-white/20 z-10 active:scale-95"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>

                {/* Shutter Capture Button + Native Shutter Fallback Button */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCapturePhoto}
                    disabled={isCameraStarting || !stream}
                    className="group px-5 py-2.5 rounded-full bg-gradient-to-r from-[#00DDE5] via-white to-[#00DDE5] text-[#06345C] font-black text-xs shadow-[0_0_20px_rgba(0,221,229,0.5)] hover:scale-105 active:scale-95 transition flex items-center gap-2 disabled:opacity-50"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#0055A6] flex items-center justify-center p-0.5">
                      <div className="w-full h-full rounded-full bg-white group-hover:scale-110 transition" />
                    </div>
                    <span>Click Photo 📸</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => nativeCameraInputRef.current?.click()}
                    title="Open device camera directly"
                    className="p-2.5 rounded-full bg-white/15 hover:bg-white/25 text-white transition border border-white/20"
                  >
                    <Smartphone className="w-4 h-4 text-[#FFBE00]" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: UPLOAD PHOTO FROM DEVICE */}
        {activeTab === "upload" && (
          <div className="flex-1 flex flex-col justify-center items-center p-4 border border-dashed border-white/30 rounded-2xl bg-white/5 text-center space-y-3">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {previewUrl && !capturedPhoto ? (
              <div className="space-y-2">
                <div className="w-20 h-20 rounded-3xl overflow-hidden shadow-xl ring-4 ring-[#00DDE5] mx-auto">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-2 justify-center pt-1">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3 py-1.5 rounded-xl bg-white/20 text-white text-xs font-bold hover:bg-white/30 transition flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Change File
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveCustomPhoto}
                    className="px-3 py-1.5 rounded-xl bg-red-500/20 text-red-300 text-xs font-bold hover:bg-red-500/30 transition flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="w-14 h-14 rounded-2xl bg-[#00DDE5]/20 border border-[#00DDE5]/40 flex items-center justify-center text-[#00DDE5] shadow-lg">
                  <ImageIcon className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-white">Upload Custom Profile Picture</h4>
                  <p className="text-[10px] text-white/60 mt-0.5">
                    Supports JPG, PNG, WEBP or GIF from device gallery (Max 4MB)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-[#0055A6] to-[#00DDE5] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {isUploading ? "Uploading..." : "Select Image from Device"}
                </button>
              </>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex gap-2 pt-3 border-t border-white/10 mt-2 shrink-0">
          <button
            type="button"
            onClick={handleModalClose}
            className="flex-1 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 py-2.5 rounded-2xl bg-gradient-to-r from-[#8ED329] to-[#00DDE5] text-[#06345C] font-bold text-xs shadow-lg hover:brightness-110 active:scale-95 transition flex items-center justify-center gap-1.5"
          >
            <Check className="w-4 h-4 stroke-[2.5]" />
            Apply Avatar & PFP
          </button>
        </div>
      </div>
    </div>
  );
};
