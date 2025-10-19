import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCUMENT_DIR = path.join(__dirname, '../document');
const OUTPUT_FILE = process.argv[2] || path.join(__dirname, '../docs.json');

// 디렉토리를 재귀적으로 탐색하여 모든 .md 파일 찾기
function findMarkdownFiles(dir, baseDir = dir, category = '') {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    console.warn(`Warning: Directory ${dir} does not exist`);
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // 하위 디렉토리 탐색 (카테고리로 사용)
      const subCategory = category || file;
      results.push(...findMarkdownFiles(filePath, baseDir, subCategory));
    } else if (file.endsWith('.md')) {
      // .md 파일 발견
      const relativePath = path.relative(path.join(__dirname, '..'), filePath);
      const title = path.basename(file, '.md')
        .replace(/_/g, '/')  // 언더스코어를 슬래시로 변환 (B-Tree_B+Tree -> B-Tree/B+Tree)
        .replace(/-/g, ' ');  // 하이픈을 공백으로 변환
      
      results.push({
        category: category,
        title: title,
        path: relativePath.replace(/\\/g, '/')  // Windows 경로를 웹 경로로 변환
      });
    }
  }
  
  return results;
}

// 문서를 카테고리별로 그룹화
function groupByCategory(files) {
  const grouped = {};
  
  for (const file of files) {
    const category = file.category || 'Uncategorized';
    
    if (!grouped[category]) {
      grouped[category] = [];
    }
    
    grouped[category].push({
      title: file.title,
      path: file.path
    });
  }
  
  // 각 카테고리 내에서 제목으로 정렬
  for (const category in grouped) {
    grouped[category].sort((a, b) => a.title.localeCompare(b.title));
  }
  
  return grouped;
}

// 메인 실행 함수
function generateDocs() {
  console.log('🔍 Scanning for markdown files...');
  
  const markdownFiles = findMarkdownFiles(DOCUMENT_DIR);
  console.log(`✅ Found ${markdownFiles.length} markdown file(s)`);
  
  const groupedDocs = groupByCategory(markdownFiles);
  console.log(`📁 Organized into ${Object.keys(groupedDocs).length} categories`);
  
  // JSON 파일로 저장
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(groupedDocs, null, 2));
  console.log(`💾 Generated ${OUTPUT_FILE}`);
  
  // 결과 출력
  console.log('\n📚 Document structure:');
  for (const [category, docs] of Object.entries(groupedDocs)) {
    console.log(`  ${category}:`);
    docs.forEach(doc => {
      console.log(`    - ${doc.title}`);
    });
  }
}

// 스크립트 실행
try {
  generateDocs();
} catch (error) {
  console.error('❌ Error generating docs:', error);
  process.exit(1);
}