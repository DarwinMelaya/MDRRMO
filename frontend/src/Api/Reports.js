import supabase, {
  REPORT_EVIDENCE_BUCKET,
  REPORTS_TABLE,
} from "../utils/supabaseClient";
import { compressImageFile } from "../utils/compressImage";

const evidencePath = (file) => {
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const safeExt = /^[a-z0-9]+$/i.test(ext) ? ext : "jpg";
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${id}.${safeExt}`;
};

export const uploadReportEvidence = async (file) => {
  const { file: compressed } = await compressImageFile(file);
  const path = evidencePath(compressed);
  const { error: uploadError } = await supabase.storage
    .from(REPORT_EVIDENCE_BUCKET)
    .upload(path, compressed, {
      cacheControl: "3600",
      upsert: false,
      contentType: compressed.type || "image/jpeg",
    });

  if (uploadError) {
    return { url: null, error: uploadError };
  }

  const { data } = supabase.storage
    .from(REPORT_EVIDENCE_BUCKET)
    .getPublicUrl(path);

  return { url: data.publicUrl, error: null };
};

const insertReport = async (payload) => {
  const { data, error } = await supabase
    .from(REPORTS_TABLE)
    .insert([payload])
    .select(
      "id, report_type, details, evidence_url, hide_identity, latitude, longitude, created_at",
    );

  if (error) {
    return { data: null, error };
  }

  return { data: data?.[0] ?? null, error: null };
};

export const submitCommunityReport = async ({
  reportType,
  details,
  hideIdentity,
  latitude,
  longitude,
  reporterId,
  evidenceFile,
}) => {
  let evidenceUrl = null;
  let evidenceWarning = null;

  if (evidenceFile) {
    const { url, error: uploadError } = await uploadReportEvidence(evidenceFile);
    if (uploadError) {
      evidenceWarning =
        uploadError.message ||
        "Evidence upload failed; report saved without image.";
    } else {
      evidenceUrl = url;
    }
  }

  const basePayload = {
    report_type: reportType,
    details: details.trim(),
    hide_identity: hideIdentity,
    latitude,
    longitude,
    evidence_url: evidenceUrl,
    // Keep ownership even when hidden, so users can manage their own reports.
    reporter_id: reporterId ?? null,
  };

  let { data, error } = await insertReport(basePayload);

  if (error?.code === "23503" && basePayload.reporter_id) {
    ({ data, error } = await insertReport({
      ...basePayload,
      reporter_id: null,
    }));
  }

  if (error) {
    return { data: null, error, evidenceWarning };
  }

  return { data, error: null, evidenceWarning };
};

export const fetchCommunityReports = async () => {
  const { data, error } = await supabase
    .from(REPORTS_TABLE)
    .select(
      `
      id,
      report_type,
      details,
      evidence_url,
      hide_identity,
      latitude,
      longitude,
      created_at,
      reporter_id,
      profiles:reporter_id ( name )
    `,
    )
    .order("created_at", { ascending: false });

  return { data: data ?? [], error };
};

const getEvidenceStoragePath = (evidenceUrl) => {
  if (!evidenceUrl) return null;
  const marker = `/storage/v1/object/public/${REPORT_EVIDENCE_BUCKET}/`;
  const markerIndex = evidenceUrl.indexOf(marker);
  if (markerIndex === -1) return null;
  return evidenceUrl.slice(markerIndex + marker.length);
};

export const deleteCommunityReport = async ({
  reportId,
  reporterId,
  evidenceUrl,
}) => {
  if (!reportId || !reporterId) {
    return { error: new Error("Missing report or user information.") };
  }

  const { error } = await supabase
    .from(REPORTS_TABLE)
    .delete()
    .eq("id", reportId)
    .eq("reporter_id", reporterId);

  if (error) {
    return { error };
  }

  const storagePath = getEvidenceStoragePath(evidenceUrl);
  if (storagePath) {
    await supabase.storage.from(REPORT_EVIDENCE_BUCKET).remove([storagePath]);
  }

  return { error: null };
};
