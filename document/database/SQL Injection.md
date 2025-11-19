# SQL Injection 

## 1. 개요

### SQL Injection이란?
SQL Injection은 웹 애플리케이션이 사용자 입력을 그대로 SQL 쿼리에 포함시키면서, 공격자가 악의적인 SQL 코드를 주입해 실행되도록 만드는 보안 취약점이다.  
입력값이 적절히 검증되지 않으면 공격자는 데이터베이스 구조를 변경하거나 민감한 정보를 조회할 수 있다.

---

## 2. 공격 원리

### 핵심 개념
사용자 입력이 SQL 쿼리에 영향을 줄 수 있는 방식으로 삽입되면, 공격자는 이를 악용해 쿼리의 논리를 변경할 수 있다.

### 예시
```sql
SELECT * FROM users WHERE username = 'user' AND password = 'password';
```

공격자가 `username` 값에 `'user' OR '1'='1'` 을 삽입하면 쿼리는 다음처럼 변형된다:

```sql
SELECT * FROM users WHERE username = 'user' OR '1'='1' AND password = 'password';
```

`'1'='1'` 조건은 항상 참이므로, 모든 사용자 정보가 노출될 가능성이 생긴다.

---

## 3. 공격 단계

### 1. 표적 식별
- 공격자는 데이터베이스와 통신하는 웹 애플리케이션을 탐색한다.
- 로그인 폼, 검색창, 문의 폼처럼 검증되지 않은 입력이 서버로 전달되는 지점을 확인한다.

### 2. 악성 SQL 주입
- 취약한 입력 필드를 발견하면 공격자는 여기에 악성 SQL 코드를 삽입한다.

### 3. 악성 코드 실행
- 서버가 입력 값을 검증하지 않으면, 주입된 SQL이 정상적인 SQL과 함께 실행된다.
- 이는 인증 우회, 데이터 조작 등 다양한 공격을 가능하게 한다.

### 4. 데이터 악용
- 공격자는 다음과 같은 행동을 할 수 있다:
  - 민감한 정보 조회
  - 데이터 삭제/수정
  - 권한 상승
  - 시스템 전체 권한 탈취

---

## 4. SQL Injection 방지 방법

### 1️⃣ Prepared Statements (준비된 쿼리)

Prepared Statement는 SQL 쿼리 구조와 사용자 입력을 분리해, 입력값이 쿼리 구조에 영향을 주지 못하도록 한다.

```javascript
const username = "user";
const query = "SELECT * FROM users WHERE username = ? AND password = 'password'";
```

Prepared Statements에서는 파라미터가 **문자열 그대로 처리**되기 때문에, 공격자가

`'user' OR '1'='1'`

을 입력해도 다음처럼 단순 문자열로 인식된다:

```sql
SELECT * FROM users WHERE username = 'user OR '1'='1' AND password = ?;
```

즉, SQL 로직이 조작되지 않는다.

---

### 2️⃣ ORM(Object-Relational Mapping) 사용

ORM은 SQL을 직접 작성하지 않고 객체로 DB를 다루기 때문에 기본적으로 **파라미터 바인딩 방식**을 사용하여 안전하다.

#### 안전한 예
```python
user = User.objects.filter(username=username).first()
```

#### 위험한 예
```python
sql = f"SELECT * FROM auth_user WHERE username = '{username}'"
cursor.execute(sql)
```

#### 안전한 Raw SQL 사용 예
```python
with connection.cursor() as cur:
    cur.execute("SELECT * FROM auth_user WHERE username = %s", [username])
```

#### ORM 안전 가이드
- 가능한 ORM의 filter, join, update 메서드를 사용해라.
- 문자열로 쿼리를 직접 만드는 방식은 절대 금지.
- LIKE/ILIKE 검색 시 특수문자는 반드시 escape 처리.
- ORM 보안 패치와 버전 업데이트 필수.
