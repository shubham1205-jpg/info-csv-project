import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read CSV
const csv = fs.readFileSync(path.join(__dirname, 'info.csv'), 'utf8').trim().split('\n');
const headers = csv[0].split(',');

const originalData = [];
const anonymizedData = [];

function randomLetter() {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
}

function randomEmail() {
  return randomLetter().toLowerCase() + '@example.com';
}

for (let i = 1; i < csv.length; i++) {
  const row = csv[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g).map(field =>
    field.replace(/^"|"$/g, '').trim()
  );

  const obj = {};
  headers.forEach((key, index) => {
    obj[key] = row[index];
  });

  originalData.push(obj);

  const anonymized = {
    CustomerID: obj.CustomerID,
    FullName: randomLetter(),
    Email: randomEmail(),
    PhoneNumber: String(i).padStart(2, '0'),
    City: "abc",
    FeedbackText: obj.FeedbackText,
    PurchaseAmount: parseFloat(obj.PurchaseAmount),
    ProductCategory: obj.ProductCategory
  };

  anonymizedData.push(anonymized);
}

// Write to JSON files
fs.writeFileSync('originalData.json', JSON.stringify(originalData, null, 2));
fs.writeFileSync('anonymizedData.json', JSON.stringify(anonymizedData, null, 2));

console.log('✅ JSON files written successfully!');

