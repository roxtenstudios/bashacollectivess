import { IMAGES } from './images';

// We map out the store products or specific lookbook images as the gallery data.
// In a real production scenario, this could be fetched from Firebase or a CMS.
export const galleryData = [
  {
    id: 'g1',
    src: IMAGES.storeProducts[0].image,
    title: 'The Linen Suit',
    category: 'Editorial',
  },
  {
    id: 'g2',
    src: IMAGES.storeProducts[1].image,
    title: 'Avant Garde',
    category: 'Campaign',
  },
  {
    id: 'g3',
    src: IMAGES.storeProducts[2].image,
    title: 'Summer 24',
    category: 'Lookbook',
  },
  {
    id: 'g4',
    src: IMAGES.storeProducts[3].image,
    title: 'Craftsmanship',
    category: 'Behind The Scenes',
  },
  {
    id: 'g5',
    src: IMAGES.storeProducts[4].image,
    title: 'The Corset',
    category: 'Detail',
  },
  {
    id: 'g6',
    src: IMAGES.storeProducts[5].image,
    title: 'Tailored Edge',
    category: 'Editorial',
  },
  {
    id: 'g7',
    src: IMAGES.lookbook[1].src,
    title: 'Midnight Silk',
    category: 'Campaign',
  },
  {
    id: 'g8',
    src: IMAGES.lookbook[3].src,
    title: 'Structured Forms',
    category: 'Lookbook',
  }
];
