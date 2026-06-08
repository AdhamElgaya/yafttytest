import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

function getR2Client() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      'R2 is not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, and R2_SECRET_ACCESS_KEY in .env'
    );
  }

  return new S3Client({
    region: process.env.R2_REGION || 'auto',
    endpoint:
      process.env.R2_ENDPOINT ||
      `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

/** Banner photo bucket (public) */
export function getR2BannerImagesBucket() {
  return (
    process.env.R2_BUCKET_BANNER_IMAGES ||
    process.env.R2_BUCKET_NAME ||
    'banner-images'
  );
}

/** Legal documents bucket (private) */
export function getR2DocumentsBucket() {
  return (
    process.env.R2_BUCKET_DOCUMENTS ||
    process.env.R2_DOCUMENTS_BUCKET ||
    'banner-legal-documents'
  );
}

/** Public base URL for the banner images bucket (enable public access in R2) */
export function getR2BannerImagesPublicUrl() {
  const base = (
    process.env.R2_PUBLIC_URL_BANNER_IMAGES ||
    process.env.R2_PUBLIC_URL ||
    ''
  ).replace(/\/$/, '');
  return base || null;
}

/**
 * @param {Buffer} body
 * @param {string} key path inside bucket, e.g. {userId}/photo.jpg
 * @param {string} contentType
 * @param {'banner-image'|'document'} kind
 */
export async function uploadBufferToR2(body, key, contentType, kind) {
  const client = getR2Client();
  const isBannerImage = kind === 'banner-image';
  const bucket = isBannerImage
    ? getR2BannerImagesBucket()
    : getR2DocumentsBucket();

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType || 'application/octet-stream',
    })
  );

  if (isBannerImage) {
    const publicBase = getR2BannerImagesPublicUrl();
    const url = publicBase ? `${publicBase}/${key}` : null;
    return { key, bucket, url };
  }

  return { key, bucket, url: null };
}

export async function createR2SignedUrlForDocument(key, expiresIn = 3600) {
  const client = getR2Client();
  const command = new GetObjectCommand({
    Bucket: getR2DocumentsBucket(),
    Key: key,
  });
  return getSignedUrl(client, command, { expiresIn });
}

/** Verify user owns this document key (supports legacy documents/{userId}/... paths) */
export function assertDocumentKeyOwnedByUser(key, userId) {
  const parts = key.split('/');
  if (parts[0] === 'documents') {
    if (parts[1] !== userId) return false;
    return true;
  }
  return parts[0] === userId;
}

/** Normalize stored path to object key in the legal-docs bucket */
export function normalizeDocumentKey(key) {
  if (key.startsWith('documents/')) {
    return key.slice('documents/'.length);
  }
  return key;
}

export function isR2Configured() {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY
  );
}
