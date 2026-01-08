const fs = require('fs');
const path = require('path');

// 读取schema文件
const schemaPath = path.join(__dirname, '../prisma/schema.prisma');
const schemaContent = fs.readFileSync(schemaPath, 'utf8');

// 检查重复的字段定义
function checkDuplicateFields() {
  const lines = schemaContent.split('\n');
  const models = {};
  let currentModel = null;
  let inModel = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 检测模型开始
    if (line.startsWith('model ')) {
      currentModel = line.split(' ')[1];
      models[currentModel] = {};
      inModel = true;
      continue;
    }
    
    // 检测模型结束
    if (line === '}' && inModel) {
      inModel = false;
      currentModel = null;
      continue;
    }
    
    // 在模型内部检查字段
    if (inModel && currentModel && line.includes(' ') && !line.startsWith('//') && !line.startsWith('@@')) {
      const fieldName = line.split(/\s+/)[0];
      if (fieldName && !fieldName.startsWith('//')) {
        if (models[currentModel][fieldName]) {
          console.error(`❌ 重复字段发现: 模型 "${currentModel}" 中的字段 "${fieldName}" 在第 ${i + 1} 行重复定义`);
          console.error(`   第一次定义: 第 ${models[currentModel][fieldName]} 行`);
          console.error(`   重复定义: 第 ${i + 1} 行`);
        } else {
          models[currentModel][fieldName] = i + 1;
        }
      }
    }
  }
}

// 检查关联关系
function checkRelations() {
  const relationPattern = /@relation\("([^"]+)"\)/g;
  const relations = {};
  
  let match;
  while ((match = relationPattern.exec(schemaContent)) !== null) {
    const relationName = match[1];
    if (relations[relationName]) {
      relations[relationName]++;
    } else {
      relations[relationName] = 1;
    }
  }
  
  console.log('\n📊 关联关系统计:');
  Object.entries(relations).forEach(([name, count]) => {
    if (count === 1) {
      console.log(`ℹ️  单向关联 "${name}": ${count} 次`);
    } else if (count === 2) {
      console.log(`✅ 双向关联 "${name}": ${count} 次`);
    } else {
      console.warn(`⚠️  异常关联 "${name}" 出现 ${count} 次`);
    }
  });
}

console.log('🔍 检查 Prisma Schema...\n');

checkDuplicateFields();
checkRelations();

console.log('\n✅ Schema 检查完成');
