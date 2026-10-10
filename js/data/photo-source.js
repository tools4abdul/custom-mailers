import {
  CANDIDATE_PHOTO_THUMB_DIR,
  CANDIDATE_PHOTO_PRINT_DIR,
  candidatePhotos,
} from './candidate-photos.js';

export { candidatePhotos };

export function candidateThumbSrc(photoId) {
  return `${CANDIDATE_PHOTO_THUMB_DIR}/${photoId}.jpg`;
}

export function candidatePrintSrc(photoId) {
  return `${CANDIDATE_PHOTO_PRINT_DIR}/${photoId}.jpg`;
}

export function hasCandidatePhoto(photoId) {
  return candidatePhotos.some((photo) => photo.id === photoId);
}

const EDITORIAL_VERTICAL_POSITIONS = [
  44, 34, 49, 21, 45, 29, 40, 34, 21, 42, 29, 27, 33, 33, 33, 33, 25, 41, 27,
  37, 7, 34, 34, 40, 40, 21, 21, 21, 41, 6, 35, 35, 18, 41, 41, 41, 54, 31,
];

export function editorialObjectPosition(photoId) {
  const photoIndex = candidatePhotos.findIndex((photo) => photo.id === photoId);
  const verticalPosition = EDITORIAL_VERTICAL_POSITIONS[photoIndex] ?? 30;
  return `center ${verticalPosition}%`;
}
