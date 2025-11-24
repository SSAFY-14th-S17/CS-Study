# HTTP와 HTTPS: 웹 통신의 구조 및 보안 프로토콜 분석

## HTTP (HyperText Transfer Protocol) 개요

HTTP는 웹 브라우저(클라이언트)와 서버가 데이터를 주고받기 위해 사용하는 가장 기본적인 통신 규약(Protocol)이다. 초기에는 HTML 문서 전송을 목적으로 설계되었으나, 현재는 이미지, 동영상, JSON 데이터 등 웹 상의 모든 리소스를 전달하는 근간이 된다.

### 주요 특징
HTTP는 웹의 확장성과 성능을 고려하여 다음과 같은 설계적 특징을 갖는다.

1.  **클라이언트-서버 아키텍처 (Client-Server Architecture):**  
데이터 통신의 주체가 요청을 보내는 '클라이언트'와 이에 응답하는 '서버'로 명확히 분리되어 있다. 이는 양쪽의 로직을 독립적으로 진화시킬 수 있게 한다.
2.  **무상태성 (Stateless):**  
서버는 클라이언트의 이전 요청에 대한 상태(Context)를 기억하지 않는다. 각 요청은 완전히 독립적인 트랜잭션으로 처리된다. 이로 인해 서버의 확장성(Scale-out)이 용이해지지만, 로그인 유지 등을 위해 쿠키나 세션 같은 별도의 기술이 요구된다.
3.  **비연결성 (Connectionless):**  
클라이언트가 요청을 보내고 응답을 받으면 즉시 TCP/IP 연결을 종료한다. 이는 불특정 다수의 클라이언트를 대상으로 하는 웹 환경에서 서버 자원을 효율적으로 사용하기 위함이다.  
(단, HTTP/1.1부터는 `Keep-Alive`를 통해 연결을 일정 시간 유지하여 성능을 최적화한다.)

---

## HTTP 메시지 구조

![HTTP 메시지 구조](/document/images/http&https_1.png)

HTTP 통신은 사람이 읽을 수 있는 텍스트 기반의 메시지로 이루어지며, 요청(Request)과 응답(Response) 모두 유사한 구조를 띤다.

### 구조 명세
1.  **시작 줄 (Start-Line):** 메시지의 성격을 정의한다.
    * *요청:* 메서드(GET 등), 경로(Path), HTTP 버전 (예: `GET /index.html HTTP/1.1`)
    * *응답:* HTTP 버전, 상태 코드, 상태 텍스트 (예: `HTTP/1.1 200 OK`)
2.  **HTTP 헤더 (Headers):** 메시지 본문, 전송 방식, 클라이언트/서버 정보 등 메타데이터를 담는 키-값(Key-Value) 쌍의 집합이다.
3.  **공백 라인 (Empty Line):** 헤더와 본문을 구분하는 `CRLF`(개행 문자)이다.
4.  **메시지 본문 (Message Body):** 실제 전송할 데이터(HTML, JSON, 이미지 등)가 담긴다.

---

## HTTP 메서드 (Method)

클라이언트는 서버에게 리소스에 대해 어떤 동작을 수행할지를 메서드를 통해 명시한다.

| 메서드 | 역할 | 데이터 전송 위치 | 멱등성(Idempotency) | 안전성(Safety) |
| :--- | :--- | :--- | :--- | :--- |
| **GET** | 리소스 **조회** | URL Query String | O | O |
| **POST** | 리소스 **생성** | Message Body | X | X |
| **PUT** | 리소스 **전체 수정** (덮어쓰기) | Message Body | O | X |
| **PATCH** | 리소스 **부분 수정** | Message Body | X | X |
| **DELETE** | 리소스 **삭제** | - | O | X |

> * **안전성(Safety):**  
> 호출해도 리소스를 변경하지 않는 성질. (GET은 조회만 하므로 안전하다.)
> * **멱등성(Idempotency):**  
> 동일한 요청을 여러 번 수행해도 결과(서버 상태)가 달라지지 않는 성질.  
> (예: DELETE를 1번 호출하나 100번 호출하나 해당 리소스가 없는 상태는 동일하다.)

---

## HTTP 상태 코드 (Status Code)

서버는 요청 처리 결과를 3자리 숫자로 된 상태 코드로 반환한다. (블로그 내용 보충)

* **2xx (성공):** 요청이 정상적으로 처리됨.  
(예: `200 OK`, `201 Created`)
* **3xx (리다이렉션):** 요청 완료를 위해 추가 동작이 필요함.  
(예: `301 Moved Permanently`)
* **4xx (클라이언트 오류):** 잘못된 문법 등으로 서버가 요청을 수행할 수 없음.  
(예: `400 Bad Request`, `401 Unauthorized`, `404 Not Found`)
* **5xx (서버 오류):** 서버가 정상 요청을 처리하지 못함.  
(예: `500 Internal Server Error`)

---

## HTTP 헤더 (Header) 분류

헤더는 용도에 따라 크게 4가지로 분류된다.

1.  **General Header:** 요청과 응답 모두에 적용되는 일반 정보  
(예: `Date`, `Connection`)
2.  **Request Header:** 요청 시 클라이언트의 정보  
(예: `Host`, `User-Agent`, `Authorization`)
3.  **Response Header:** 응답 시 서버의 정보  
(예: `Server`, `Set-Cookie`)
4.  **Entity Header:** 본문(Body) 데이터에 대한 정보  
(예: `Content-Type`, `Content-Length`)

---

## HTTP 버전의 진화

* **HTTP/1.1:** 가장 대중적인 버전. 한 번에 하나의 요청만 처리하므로 앞선 요청이 지연되면 뒤의 요청도 막히는 **Head-of-Line Blocking** 문제가 존재한다.
* **HTTP/2:** **멀티플렉싱(Multiplexing)** 기술을 도입하여 하나의 TCP 연결 내에서 여러 요청과 응답을 동시에 스트림 단위로 처리한다. 속도가 비약적으로 향상되었다.
* **HTTP/3:** TCP가 아닌 UDP 기반의 **QUIC** 프로토콜을 사용한다. TCP의 고질적인 지연 문제를 해결하고 연결 설정 속도와 안정성을 극대화했다.

---

## HTTPS (HyperText Transfer Protocol Secure)

### 개념 및 필요성
HTTP는 데이터를 암호화하지 않은 **평문(Plain Text)** 으로 전송한다. 따라서 네트워크 스니핑(Sniffing) 공격 시 비밀번호나 개인정보가 그대로 노출되는 보안 취약점을 가진다.
HTTPS는 HTTP에 **SSL/TLS (Secure Sockets Layer / Transport Layer Security)** 라는 보안 계층을 추가하여 이 문제를 해결한 프로토콜이다.

### 핵심 보안 요소
HTTPS는 다음 3가지를 보장한다.

1.  **기밀성 (Confidentiality):** 데이터를 암호화하여 제3자가 내용을 볼 수 없게 한다.
2.  **무결성 (Integrity):** 데이터가 전송 중에 위·변조되지 않았음을 보장한다 (MAC 사용).
3.  **인증 (Authentication):** 신뢰할 수 있는 인증 기관(CA)의 인증서를 통해 접속하려는 서버가 '진짜'임을 증명한다.

### 동작 원리
HTTPS는 속도와 보안을 모두 잡기 위해 두 가지 암호화 방식을 혼합하여 사용한다.
1.  **핸드셰이크 단계 (비대칭키):** 공개키/개인키 방식을 사용해 서버의 신원을 확인하고, 데이터를 암호화할 '대칭키'를 안전하게 교환한다.
2.  **데이터 전송 단계 (대칭키):** 교환된 대칭키를 이용해 실제 데이터를 빠르게 암호화/복호화하여 통신한다.

---

## HTTP vs HTTPS 비교 요약

| 구분 | HTTP | HTTPS |
| :--- | :--- | :--- |
| **보안 계층** | 없음 | SSL/TLS 위에서 동작 |
| **데이터 형태** | 평문 (Plain Text) | 암호화된 데이터 (Cipher Text) |
| **기본 포트** | 80 | 443 |
| **인증서** | 불필요 | CA 발급 인증서 필수 |
| **SEO** | 검색 엔진 노출에 불리 | 구글 등 검색 엔진에서 가산점 부여 |

참고
(Http 메시지 구조 이미지) : https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Messages