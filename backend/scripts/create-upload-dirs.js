const fs = require('fs');
const path = require('path');

// 创建上传目录
const uploadDirs = [
  'public/uploads',
  'public/uploads/avatars',
  'public/uploads/evidence',
  'public/uploads/temp'
];

uploadDirs.forEach(dir => {
  const fullPath = path.join(__dirname, '..', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created directory: ${dir}`);
  } else {
    console.log(`Directory already exists: ${dir}`);
  }
});

console.log('Upload directories setup complete!');
