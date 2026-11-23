// Original website photographs already bundled for reliable local previews.
const documentation = {
  '1PUOOkf_OLutx7LItdz6_7U7cNRtd1XrB': '01-kebersamaan.jpg',
  '1FSPbsFV9dStzLQsxXRi3VdOj_FfE-BKJ': '02-muskerda.jpg',
  '1D26IYfzW_4GuBuTxbiELEyPbE8z6CGoV': '03-kajian.jpg',
  '12Hg2mUTC7wH-Tse3oAjONPAyRljJ87CJ': '04-kegiatan.jpg',
  '1HdH8cv2QHiUo8UByGHFFm3ASIDh5-2JU': '05-workshop.jpg',
  '1RBwhz_vc2aPWPjAIdGpKR8YnMXOVBDCA': '06-ketua-akhwat.jpg',
};

export function localDocumentationPhoto(source) {
  if (typeof source !== 'string') return null;
  const match = Object.keys(documentation).find(id => source.includes(id));
  return match ? `/documentation/${documentation[match]}` : null;
}
