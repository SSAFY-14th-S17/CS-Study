// marked 라이브러리 import
import { marked } from 'marked';

// marked 설정
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: true,
  mangle: false
});

let docsData = {};
let currentDocPath = null;

// docs.json 로드 및 네비게이션 렌더링
async function loadDocs() {
  try {
    // dist 폴더 내의 docs.json을 상대경로로 로드
    const response = await fetch('./docs.json');
    if (!response.ok) {
      throw new Error('Failed to load docs.json');
    }
    docsData = await response.json();
    renderNavigation();

    // URL 해시가 있으면 해당 문서 로드
    const hash = window.location.hash.slice(1);
    if (hash) {
      const decodedPath = decodeURIComponent(hash);
      await loadDocument(decodedPath);
    } else {
      showWelcome();
    }
  } catch (error) {
    console.error('Error loading docs:', error);
    document.getElementById('navigation').innerHTML =
        '<div class="loading">문서 목록을 불러올 수 없습니다.</div>';
  }
}

// 네비게이션 렌더링
function renderNavigation() {
  const nav = document.getElementById('navigation');
  nav.innerHTML = '';

  // 카테고리를 알파벳 순으로 정렬
  const sortedCategories = Object.keys(docsData).sort((a, b) =>
      a.localeCompare(b, 'ko')
  );

  sortedCategories.forEach(category => {
    const categoryDiv = document.createElement('div');
    categoryDiv.className = 'category';

    const categoryTitle = document.createElement('div');
    categoryTitle.className = 'category-title';
    categoryTitle.textContent = category;

    categoryTitle.addEventListener('click', () => {
      docList.style.display = docList.style.display === 'none' ? 'block' : 'none';
    });

    const docList = document.createElement('ul');
    docList.className = 'doc-list';

    docsData[category].forEach(doc => {
      const docItem = document.createElement('li');
      docItem.className = 'doc-item';
      docItem.textContent = doc.title;
      docItem.dataset.path = doc.path;

      docItem.addEventListener('click', () => {
        loadDocument(doc.path);
      });

      docList.appendChild(docItem);
    });

    categoryDiv.appendChild(categoryTitle);
    categoryDiv.appendChild(docList);
    nav.appendChild(categoryDiv);
  });
}

// 문서 로드
async function loadDocument(docPath) {
  try {
    // 활성 상태 업데이트
    document.querySelectorAll('.doc-item').forEach(item => {
      item.classList.remove('active');
      if (item.dataset.path === docPath) {
        item.classList.add('active');
      }
    });

    // URL 해시 업데이트
    window.location.hash = encodeURIComponent(docPath);
    currentDocPath = docPath;

    // 경로 정규화 (앞의 슬래시 제거)
    const normalizedPath = docPath.startsWith('/') ? docPath.slice(1) : docPath;

    // dist -> 상위 폴더 -> document 폴더로 이동하는 상대경로
    const relativePath = `../${normalizedPath}`;

    console.log('Loading document from:', relativePath); // 디버깅용

    // 마크다운 파일 가져오기
    const response = await fetch(relativePath);
    if (!response.ok) {
      throw new Error(`Failed to load document: ${docPath} (${response.status})`);
    }

    const markdown = await response.text();
    const html = marked.parse(markdown);

    // 콘텐츠 영역에 렌더링
    const content = document.getElementById('content');
    content.innerHTML = html;

    // 페이지 상단으로 스크롤
    content.scrollTop = 0;

  } catch (error) {
    console.error('Error loading document:', error);
    const content = document.getElementById('content');
    content.innerHTML = `
      <div style="padding: 2rem; text-align: center; color: #5c5962;">
        <h2>문서를 불러올 수 없습니다</h2>
        <p>${error.message}</p>
        <p style="font-size: 0.9em; margin-top: 1rem;">
          요청 경로: ${docPath}<br>
          상대 경로: ../${normalizedPath}
        </p>
      </div>
    `;
  }
}

function showWelcome() {
  const content = document.getElementById('content');
  content.innerHTML = `
    <div class="welcome">
      <h1>CS-Study</h1>
      <p>왼쪽 메뉴에서 주제를 선택해주세요.</p>
      <blockquote>
        <p>2025.09.01 ~ ing</p>
      </blockquote>
      <ul>
        <p>알고리즘부터 컴퓨터 과학 기초까지, 개발자로 성장하기 위해 반드시 알아야 할 핵심 개념들을 이론과 구현을 통해 학습하고 기록하는 공간입니다.</p>
        <p>이 저장소에는 스터디 과정에서 작성된 발표 자료들이 주차별로 정리되어 있으며, 점진적으로 더 깊이 있는 문서와 질의응답 자료로 확장해 나갈 예정입니다.</p>
      </ul>
      <br><br><br>
      <table style="text-align: center;">
        <thead>
          <tr>
            <th style="text-align: center;"><img src="https://github.com/KoalaJimin.png" width="100"></th>
            <th style="text-align: center;"><img src="https://github.com/9imDohee.png" width="100"></th>
            <th style="text-align: center;"><img src="https://github.com/Hyun00505.png" width="100"></th>
            <th style="text-align: center;"><img src="https://github.com/PNoahKR.png" width="100"></th>
            <th style="text-align: center;"><img src="https://github.com/youyeon11.png" width="100"></th>
            <th style="text-align: center;"><img src="https://github.com/mingeung.png" width="100"></th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="text-align: center;"><a href="https://github.com/KoalaJimin">@KoalaJimin</a></td>
            <td style="text-align: center;"><a href="https://github.com/9imDohee">@9imDohee</a></td>
            <td style="text-align: center;"><a href="https://github.com/Hyun00505">@Hyun00505</a></td>
            <td style="text-align: center;"><a href="https://github.com/PNoahKR">@PNoahKR</a></td>
            <td style="text-align: center;"><a href="https://github.com/youyeon11">@youyeon11</a></td>
            <td style="text-align: center;"><a href="https://github.com/mingeung">@mingeung</a></td>
          </tr>
        </tbody>
        <tbody>
          <tr>
            <td style="text-align: center;"><a href="https://velog.io/@kgmline2/posts">Velog</a></td>
            <td style="text-align: center;"><a href="https://velog.io/@do_e/posts">Velog</a></td>
            <td style="text-align: center;"><a href="https://velog.io/@bunhine0452">Velog</a></td>
            <td style="text-align: center;"><a href="https://noah0818.tistory.com">Tistory</a></td>
            <td style="text-align: center;"><a href="https://kite-u.tistory.com">Tistory</a></td>
            <td style="text-align: center;"><a href="https://velog.io/@mingeung/posts">Velog</a></td>
          </tr>
        </tbody>
      </table>
    </div>
  `;

  // 모든 문서 아이템의 활성 상태 제거
  document.querySelectorAll('.doc-item').forEach(item => {
    item.classList.remove('active');
  });

  // URL 해시 제거
  history.pushState(null, null, window.location.pathname);
}

// 브라우저 뒤로가기/앞으로가기 지원
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.slice(1);
  if (hash) {
    const decodedPath = decodeURIComponent(hash);
    if (decodedPath !== currentDocPath) {
      loadDocument(decodedPath);
    }
  } else {
    showWelcome();
  }
});

// 전역 함수로 등록 (HTML에서 사용)
window.showWelcome = showWelcome;

// 초기화
loadDocs();