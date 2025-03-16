const fs = require('fs');
const path = require('path');

const brands = [
  'toyota',
  'honda',
  'tesla',
  'bmw',
  'mercedes',
  'audi'
];

const placeholderDir = path.join(process.cwd(), 'public', 'car-placeholders');

// Create the placeholder directory if it doesn't exist
if (!fs.existsSync(placeholderDir)) {
  fs.mkdirSync(placeholderDir, { recursive: true });
}

// Create a list of missing placeholder images
const missingPlaceholders = brands.map(brand => {
  const placeholderPath = path.join(placeholderDir, `${brand}.jpg`);
  if (!fs.existsSync(placeholderPath)) {
    return brand;
  }
  return null;
}).filter(Boolean);

if (missingPlaceholders.length > 0) {
  console.log('Please create placeholder images for the following brands:');
  missingPlaceholders.forEach(brand => {
    console.log(`- ${placeholderDir}/${brand}.jpg`);
  });
  console.log('\nPlaceholder images should be:');
  console.log('1. High quality brand representative images');
  console.log('2. 16:9 aspect ratio recommended');
  console.log('3. At least 800x450 pixels');
  console.log('4. JPG format');
} else {
  console.log('All placeholder images are present!');
} 