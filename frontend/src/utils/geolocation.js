const DEFAULT_OPTIONS = {
  enableHighAccuracy: false,
  timeout: 20000,
  maximumAge: 120000,
};

const HIGH_ACCURACY_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 12000,
  maximumAge: 60000,
};

export const requestDeviceLocation = () =>
  new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported on this device."));
      return;
    }

    const onSuccess = (pos) => {
      resolve({
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
      });
    };

    const onFinalError = (err) => {
      if (err?.code === 1) {
        reject(
          new Error(
            "Location permission denied. Allow location in your browser, or enter coordinates below.",
          ),
        );
        return;
      }
      reject(
        new Error(
          "Could not get GPS location. Check your connection, allow location, or enter coordinates below.",
        ),
      );
    };

    navigator.geolocation.getCurrentPosition(
      onSuccess,
      () => {
        navigator.geolocation.getCurrentPosition(
          onSuccess,
          onFinalError,
          DEFAULT_OPTIONS,
        );
      },
      HIGH_ACCURACY_OPTIONS,
    );
  });

export const parseManualCoordinates = (latText, lngText) => {
  const latitude = Number.parseFloat(latText);
  const longitude = Number.parseFloat(lngText);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return { error: "Enter valid latitude and longitude numbers." };
  }
  if (latitude < -90 || latitude > 90) {
    return { error: "Latitude must be between -90 and 90." };
  }
  if (longitude < -180 || longitude > 180) {
    return { error: "Longitude must be between -180 and 180." };
  }

  return {
    location: { latitude, longitude, accuracy: null },
    error: null,
  };
};
