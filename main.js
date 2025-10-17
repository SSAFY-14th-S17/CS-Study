import docs from './docs.json';

let allDocs = {};

// 문서 목록 초기화
function initializeDocs() {
  // docs.json에서 자동 생성된 문서 목록 사용
  allDocs = docs;
  renderNavigation();
}

// 네비게이션 렌더링
function renderNavigation() {
  const nav = document.getElementById('navigation');
  nav.innerHTML = '';
  
  if (Object.keys(allDocs).length === 0) {
    nav.innerHTML = '<div class="loading">문서가 없습니다.</div>';
    return;
  }
  
  Object.entries(allDocs).forEach(([category, items]) => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';
    
    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category;
    
    const docList = document.createElement('ul');
    docList.className = 'doc-list';
    
    items.forEach(item => {
      const docItem = document.createElement('li');
      docItem.className = 'doc-item';
      docItem.textContent = item.title;
      docItem.onclick = () => loadDocument(item.path, docItem);
      docList.appendChild(docItem);
    });
    
    categoryDiv.appendChild(categoryTitle);
    categoryDiv.appendChild(docList);
    nav.appendChild(categoryDiv);
  });
}

// 마크다운 로드 및 렌더링
async function loadDocument(path, element) {
  const content = document.getElementById('content');
  
  // 활성 상태 업데이트
  document.querySelectorAll('.doc-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
  
  try {
    const response = await fetch(path);
    if (!response.ok) throw new Error('문서를 찾을 수 없습니다.');
    
    const markdown = await response.text();
    content.innerHTML = markdownToHTML(markdown);
  } catch (error) {
    content.innerHTML = `
      <div class="welcome">
        <h2>오류 발생</h2>
        <p>${error.message}</p>
      </div>
    `;
  }
}

// 마크다운을 HTML로 변환
function markdownToHTML(markdown) {
  let html = markdown;
  
  // 코드 블록 처리 (먼저 처리해야 다른 규칙과 충돌하지 않음)
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
    return `<pre><code class="language-${lang || 'plaintext'}">${escapeHtml(code.trim())}</code></pre>`;
  });
  
  // 헤더
  html = html.replace(/^#### (.*$)/gim, '<h4>$1</h4>');
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // 순서 있는 리스트
  html = html.replace(/^\d+\.\s+(.*)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');
  
  // 순서 없는 리스트
  html = html.replace(/^[-*]\s+(.*)$/gim, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    if (!match.includes('<ol>')) {
      return '<ul>' + match + '</ul>';
    }
    return match;
  });
  
  // 볼드
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // 이탤릭
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // 인라인 코드 (코드 블록 제외)
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  
  // 링크
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
  
  // 이미지
  html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;">');
  
  // 수평선
  html = html.replace(/^---$/gim, '<hr>');
  
  // 단락 처리
  html = html.split('\n\n').map(para => {
    para = para.trim();
    if (!para) return '';
    if (para.startsWith('<h') || para.startsWith('<ul') || 
        para.startsWith('<ol') || para.startsWith('<pre') ||
        para.startsWith('<hr')) {
      return para;
    }
    return '<p>' + para.replace(/\n/g, '<br>') + '</p>';
  }).join('\n');
  
  return html;
}

// HTML 이스케이프
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}

// 초기화
initializeDocs();