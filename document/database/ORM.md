# 1\. 💻 ORM의 등장 배경

개발자는 주로 파이썬, 자바, 자바스크립트 같은 **객체 지향 언어(OOP)** 로 코드를 작성한다. (예: `User`라는 Class를 만듦)

하지만 데이터는 MySQL, PostgreSQL 같은 **관계형 데이터베이스(RDB)** 에 저장된다. (예: `user`라는 Table에 저장)

* **개발자 코드 (객체):** `user.name = "홍길동"` / `user.save()`
* **데이터베이스 (SQL):** `UPDATE user SET name = '홍길동' WHERE id = 1;`

ORM이 없다면, 개발자는 이 모든 SQL 구문을 코드 안에 직접 작성해야 하는데 이는 매우 번거롭고 실수하기 쉬우며 데이터베이스 종류가 바뀌면 코드를 전부 고쳐야 하는 최악의 상황이 발생하게된다.

이 문제를 해결하기 위해 **"그냥 객체로 다룰게, SQL 번역은 네가(ORM) 알아서 해줘"** 라는 개념이 바로 ORM이다.

-----

# 2\. 🔄 ORM 동작 과정

ORM의 핵심은 **'매핑(Mapping)'** 이다. ERD에서 정의한 개념이 코드의 클래스와 1:1로 연결된다.

* **ERD의 개체 (Entity)** $\rightarrow$ **코드의 클래스 (Class)**
    * (예: `User` 테이블 $\rightarrow$ `User` 클래스)
* **개체의 속성 (Attribute)** $\rightarrow$ **클래스의 속성 (Property)**
    * (예: `username` 컬럼 $\rightarrow$ `user.username` 변수)
* **테이블의 한 줄 (Row)** $\rightarrow$ **클래스의 인스턴스 (Object)**
    * (예: 1번 회원 데이터 $\rightarrow$ `user1 = new User()` 객체)

#### 예시: "ID가 1인 유저 찾기"

* **Before: ORM이 없을 때 (순수 JDBC)**

```sql
SELECT * FROM user WHERE id = 1;
```
  
```java
// 2. 실제 자바 코드 (매우 복잡하고 김)
Connection conn = null;
PreparedStatement pstmt = null;
ResultSet rs = null;
User user = null;
String sql = "SELECT * FROM user WHERE id = ?"; // 오타 나기 쉬움

try {
conn = dataSource.getConnection(); // DB 연결
pstmt = conn.prepareStatement(sql);
pstmt.setInt(1, 1); // SQL ?에 값 바인딩

rs = pstmt.executeQuery(); // 쿼리 실행

  if (rs.next()) { // 결과가 있다면
      // 3. 데이터를 자바 객체(User)로 직접 옮겨 담아야 함
      user = new User();
      user.setId(rs.getLong("id"));
      user.setUsername(rs.getString("username"));
      user.setEmail(rs.getString("email"));
      // ... 모든 컬럼 반복 ...
  }
} catch (SQLException e) {
e.printStackTrace();
} finally {
// 4. 사용한 자원(Connection 등)을 반드시 닫아야 함
if (rs != null) rs.close();
if (pstmt != null) pstmt.close();
if (conn != null) conn.close();
}
```
이처럼 JDBC 코드는 매우 길고 반복적이며 예외 처리가 복잡하다.


* **After: ORM (JPA/Hibernate) 사용 시**

JPA를 사용하면, 개발자는 'SQL'이 아닌 '자바 객체'에만 집중할 수 있다.

A. 먼저, 'User' 클래스를 ERD의 'user' 테이블과 매핑한다. (@Entity 어노테이션을 붙여 이 클래스가 DB 테이블과 연결됨을 알림)

```java
import javax.persistence.*; // (또는 jakarta.persistence.*)

@Entity // 이 클래스는 DB 테이블과 매핑됩니다.
@Table(name = "user") // 'user' 테이블에 연결됩니다.
public class User {

    @Id // 이 필드가 Primary Key (PK) 입니다.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username") // 'username' 컬럼과 매핑됩니다.
    private String username;

    private String email; // (이름이 같으면 @Column 생략 가능)

    // ... Getters and Setters ...
}
```

B. 이제 SQL 없이 '메서드 호출'로 데이터를 가져온다.

JPA를 사용하는 방식은 크게 2가지이다.

### 방법 1: 순수 JPA (EntityManager 사용) JPA의 핵심 객체인 EntityManager를 사용

```java
// EntityManager가 주입(Inject)되었다고 가정
EntityManager em;

// "User 클래스(테이블)에서 PK가 1L(Long 타입 1)인 데이터를 찾아줘"
User user = em.find(User.class, 1L);

// 'user' 객체에는 이미 DB 데이터가 모두 담겨있음
System.out.println(user.getUsername());
```

`em.find()`라는 자바 메서드를 호출하면 Hibernate가 알아서 `SELECT * FROM user WHERE id = 1` SQL을 생성해서 실행하고 그 결과를 `User` 객체에 담아 돌려준다.

### 방법 2: Spring Data JPA (Repository 사용) - (가장 보편적) 실무에서 가장 많이 쓰는 방식
`Repository`라는 인터페이스만 정의하면 끝!

```java
// 1. Repository 인터페이스 정의 (이게 끝!)
public interface UserRepository extends JpaRepository<User, Long> {
    // findById(), save(), delete() 등 기본 메서드는
    // JpaRepository가 이미 다 가지고 있어서 작성할 필요조차 없음!
}

// 2. 실제 사용 (Service 로직 등에서)
@Autowired
UserRepository userRepository; // (스프링이 주입해줌)

public User findMyUser() {
    // "PK가 1L인 User를 찾아줘. 없으면 예외를 던져"
    User user = userRepository.findById(1L)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

    return user;
}
```

-----

# 3\. 👍 ORM의 장점

1.  **생산성 향상:**  
    `INSERT`, `UPDATE` 같은 지루하고 반복적인 SQL을 작성할 필요 없이 객체 메서드(`user.save()`, `user.delete()`) 호출로 모든 것이 해결된다.  
    개발자는 비즈니스 로직에만 집중할 수 있게된다.

2.  **데이터베이스 종속성 탈피:**  
    ORM이 중간에서 번역기 역할을 하므로 **데이터베이스를 교체하기 쉽다.**  
    (예: MySQL용 ORM 코드를 그대로 둔 채, 설정만 PostgreSQL로 바꾸면 ORM이 알아서 PostgreSQL 문법에 맞는 SQL로 번역해줌)

3.  **유지보수 용이:**  
    SQL이 코드에서 분리되어 코드가 더 깔끔하고 가독성이 높아진다. 객체지향적으로 데이터를 관리할 수 있다.

4.  **보안 향상 (일부):**  
    ORM은 SQL Injection 같은 일반적인 보안 공격을 내부적으로 방어해주는 경우가 많다.

-----