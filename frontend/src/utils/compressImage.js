const DEFAULT_MAX_SIZE_KB = 500;
const DEFAULT_MAX_WIDTH = 1920;
const DEFAULT_MAX_HEIGHT = 1920;
const OUTPUT_MIME = "image/jpeg";

export const formatFileSize = (bytes) => {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

const loadImage = (file) =>
  new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image file."));
    };
    img.src = url;
  });

const canvasToBlob = (canvas, quality) =>
  new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), OUTPUT_MIME, quality);
  });

const drawToCanvas = (img, width, height) => {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not prepare image for compression.");
  }
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
};

const encodeUnderLimit = async (canvas, maxBytes, minQuality) => {
  let quality = 0.85;
  let blob = await canvasToBlob(canvas, quality);

  while (blob && blob.size > maxBytes && quality > minQuality) {
    quality -= 0.08;
    blob = await canvasToBlob(canvas, quality);
  }

  return blob;
};

/**
 * Resize and re-encode an image to JPEG, targeting a max file size (KB).
 * Typical phone photos (2–8 MB) are reduced to a few hundred KB.
 */
export const compressImageFile = async (
  file,
  {
    maxSizeKB = DEFAULT_MAX_SIZE_KB,
    maxWidth = DEFAULT_MAX_WIDTH,
    maxHeight = DEFAULT_MAX_HEIGHT,
    minQuality = 0.35,
  } = {},
) => {
  const originalSize = file.size;
  const maxBytes = maxSizeKB * 1024;

  if (originalSize <= maxBytes && file.type === OUTPUT_MIME) {
    const img = await loadImage(file);
    if (img.width <= maxWidth && img.height <= maxHeight) {
      return {
        file,
        originalSize,
        compressedSize: originalSize,
        skipped: true,
      };
    }
  }

  const img = await loadImage(file);
  let width = img.width;
  let height = img.height;

  const fitScale = Math.min(1, maxWidth / width, maxHeight / height);
  width = Math.max(1, Math.round(width * fitScale));
  height = Math.max(1, Math.round(height * fitScale));

  let canvas = drawToCanvas(img, width, height);
  let blob = await encodeUnderLimit(canvas, maxBytes, minQuality);

  let shrinkPasses = 0;
  while (blob && blob.size > maxBytes && width > 480 && shrinkPasses < 6) {
    shrinkPasses += 1;
    width = Math.round(width * 0.82);
    height = Math.round(height * 0.82);
    canvas = drawToCanvas(img, width, height);
    blob = await encodeUnderLimit(canvas, maxBytes, minQuality);
  }

  if (!blob) {
    throw new Error("Image compression failed.");
  }

  const baseName = (file.name || "evidence").replace(/\.[^.]+$/i, "") || "evidence";
  const compressedFile = new File([blob], `${baseName}.jpg`, {
    type: OUTPUT_MIME,
    lastModified: Date.now(),
  });

  return {
    file: compressedFile,
    originalSize,
    compressedSize: compressedFile.size,
    skipped: false,
  };
};
