import * as ImagePicker from 'expo-image-picker';
import { apiRequests } from './apiRequest';
import { store } from '../store';

/**
 * Full 3-step profile picture upload flow:
 *   1. Presign  → POST /uploads/presign
 *   2. Upload   → PUT <upload_url> (direct to S3, no auth header)
 *   3. Save URL → PATCH /provider/:provider_id/profile/picture
 *
 * Returns the public URL on success.
 * Throws Error('cancelled') if the user dismisses the picker.
 */
export async function pickAndUploadProfilePicture(): Promise<string> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled || !result.assets[0]) {
    throw new Error('cancelled');
  }

  const asset = result.assets[0];
  const fileName = asset.fileName ?? `photo_${Date.now()}.jpg`;
  const contentType = asset.mimeType ?? 'image/jpeg';

  // Step 1 – get presigned upload URL
  const presignRes = await apiRequests.post('/uploads/presign', {
    upload_type: 'profile_picture',
    file_name: fileName,
    content_type: contentType,
  });
  const payload = presignRes.data?.data ?? presignRes.data;
  const uploadUrl: string = payload.upload_url;
  const publicUrl: string = payload.public_url;

  // Step 2 – PUT raw bytes directly to S3
  const imageRes = await fetch(asset.uri);
  const blob = await imageRes.blob();
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': contentType },
    body: blob,
  });

  // Step 3 – save public URL in DB
  const userId = store.getState().user.user?.id;
  await apiRequests.patch(`/provider/${userId}/profile/picture`, {
    profile_picture_url: publicUrl,
  });

  return publicUrl;
}
