// Using the specific user-provided fashion images (generated locally)
const localImages = [
  '/new_look_1.png',
  '/new_look_2.png',
  '/new_look_3.png',
  '/new_look_4.png',
  '/new_look_5.png'
];

const getImg = (index) => localImages[index % localImages.length];

export const IMAGES = {
  hero: getImg(0), 
  philosophy: getImg(1), 
  floating: [
    getImg(2), 
    getImg(3), 
    getImg(4)
  ],
  collection: {
    main: getImg(0), 
    small1: getImg(1), 
    small2: getImg(2), 
    offset: getImg(3) 
  },
  lookbook: [
    { src: getImg(4), title: "Look 01" },
    { src: getImg(0), title: "Look 02" },
    { src: getImg(1), title: "Look 03" },
    { src: getImg(2), title: "Look 04" },
    { src: getImg(3), title: "Look 05" }
  ],
  featured: [
    {
      id: 1,
      image: getImg(0),
      title: "Beige Cropped Blazer Set",
      price: "₹15200.00",
      oldPrice: "₹20000.00",
      layout: "portrait"
    },
    {
      id: 2,
      image: getImg(1),
      title: "Mint Green Patterned Co-Ord",
      price: "₹11200.00",
      oldPrice: "₹15000.00",
      layout: "portrait"
    },
    {
      id: 3,
      image: getImg(2),
      title: "White Linen Trousers",
      price: "₹24500.00",
      oldPrice: "₹30000.00",
      layout: "portrait"
    }
  ],
  storeProducts: [
    { id: 1, category: 'banarasi', image: getImg(0), title: "Beige Cropped Blazer Set", price: "₹15200.00", oldPrice: "₹20000.00" },
    { id: 2, category: 'chiffon', image: getImg(1), title: "Mint Green Patterned Co-Ord", price: "₹11200.00", oldPrice: "₹15000.00" },
    { id: 3, category: 'kanjeevaram', image: getImg(2), title: "White Linen Trousers", price: "₹28000.00", oldPrice: "₹32000.00" },
    { id: 4, category: 'banarasi', image: getImg(3), title: "Tailored White Vest", price: "₹18500.00", oldPrice: "₹22000.00" },
    { id: 5, category: 'silk', image: getImg(4), title: "Brown Corset Top", price: "₹16000.00", oldPrice: null },
    { id: 6, category: 'georgette', image: getImg(0), title: "Cropped Linen Blazer", price: "₹14200.00", oldPrice: "₹18000.00" }
  ],
  craft: getImg(0),
  journal: [
    {
      id: 1,
      image: getImg(1),
      title: "The Winter Edit",
      description: "Heavy silks and deep tones for the colder months."
    },
    {
      id: 2,
      image: getImg(2),
      title: "Bridal Classics",
      description: "Timeless pieces for your special day."
    },
    {
      id: 3,
      image: getImg(3),
      title: "Everyday Edge",
      description: "Lightweight pieces for effortless daily wear."
    }
  ],
  materials: {
    linen: getImg(4),
    cotton: getImg(0),
    wool: getImg(1)
  },
  canvas: [
    { type: "image", src: getImg(1), width: 300, height: 400, x: 100, y: 150, z: 1, rotation: -2 },
    { type: "image", src: getImg(2), width: 250, height: 350, x: 500, y: 200, z: 2, rotation: 3 },
    { type: "image", src: getImg(3), width: 200, height: 280, x: 300, y: 600, z: 3, rotation: -5 },
    { type: "text", text: "Modern", width: 200, height: 100, x: 150, y: 800, z: 4, rotation: 1 },
    { type: "image", src: getImg(4), width: 400, height: 250, x: 700, y: 700, z: 1, rotation: -1 },
    { type: "text", text: "Avant Garde", width: 250, height: 150, x: 600, y: -50, z: 5, rotation: 4 },
    { type: "image", src: getImg(0), width: 280, height: 280, x: -100, y: 400, z: 2, rotation: 2 },
    { type: "image", src: getImg(1), width: 320, height: 420, x: 900, y: 300, z: 3, rotation: -3 },
    { type: "text", text: "Intentional.", width: 200, height: 80, x: 450, y: -100, z: 4, rotation: -2 },
    { type: "image", src: getImg(2), width: 250, height: 350, x: -50, y: -50, z: 1, rotation: -4 },
    { type: "text", text: "Crafted Slowly", width: 220, height: 100, x: 1050, y: 800, z: 2, rotation: 5 }
  ]
};
