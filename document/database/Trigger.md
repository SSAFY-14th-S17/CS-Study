# Trigger vs Stored Procedure

## 1. 개요(Overview)

트리거(Trigger)는 테이블의 **데이터 변경 이벤트 INSERT, UPDATE, DELETE)**가 발생했을 때  
데이터베이스가 **자동으로 실행하는 객체**이다.

반면, 저장 프로시저(Stored Procedure)는 **개발자가 명시적으로 호출해야 실행**되는 DB 프로그램이다.

트리거는 **자동성**, 저장 프로시저는 **명시적 제어**가 핵심 차이이다.

---

## 2. 트리거(Trigger)의 특징

### 2.1 동작 방식

트리거는 특정 테이블에서 다음 이벤트가 발생할 때 자동으로 실행된다.

- `BEFORE INSERT`
- `AFTER INSERT`
- `BEFORE UPDATE`
- `AFTER UPDATE`
- `BEFORE DELETE`
- `AFTER DELETE`

### 2.2 목적

- 데이터 **무결성 보조**
- **입력 검증** 자동화
- 변경 이력 **감사 로그**
- 파생 컬럼 자동 생성(예: `updated_at`)

---

## 3. 트리거의 장단점

### 3.1 장점

- 애플리케이션이 몰라도 DB가 자동으로 규칙을 적용.
- 중복된 입력 검증/로그 로직을 DB 레벨에서 일관되게 처리.
- 다양한 클라이언트가 DB를 사용해도 동일한 정책 보장.

### 3.2 단점

- **보이지 않는 자동 실행 → 디버깅 어려움**
- **과도한 트리거는 DML 성능 저하**
- 순환 호출 또는 복잡한 로직 사용 시 트랜잭션 위험 증가
- DBMS마다 문법이 달라 이식성 낮음

---

## 4. 저장 프로시저(Stored Procedure)와의 비교

### 4.1 비교 표

| 구분        | 트리거                       | 저장 프로시저                |
| ----------- | ---------------------------- | ---------------------------- |
| 실행 방식   | 데이터 변경 시 **자동 실행** | 개발자가 **명시적 호출**     |
| 실행 위치   | 테이블 단위 이벤트 기반      | 앱·DB·스케줄러에서 직접 호출 |
| 대표 목적   | 무결성, 로그, 검증           | 복잡한 업무 로직, 배치 처리  |
| 트랜잭션    | 부모 DML과 같은 트랜잭션     | 트랜잭션을 선택적으로 구성   |
| 가독성      | 낮음 (숨겨진 실행)           | 높음 (명확한 호출 흐름)      |
| 성능 영향   | DML에 직접 영향              | 필요 시에만 실행             |
| 사용 난이도 | 유지보수 어려움              | 상대적으로 쉬움              |

### 4.2 핵심 기준

- **자동 규칙 적용 필요 → 트리거**
- **복잡한 비즈니스 로직 → 저장 프로시저**
- **대량 데이터 처리 → 저장 프로시저**

---

## 5. 예제

### 5.1 AFTER INSERT 트리거 (감사 로그 자동 기록)

```sql
CREATE TRIGGER trg_user_insert_log
AFTER INSERT ON users
FOR EACH ROW
BEGIN
  INSERT INTO user_log (user_id, action, logged_at)
  VALUES (NEW.id, 'INSERT', NOW());
END;
```

---

### 5.2 BEFORE UPDATE 트리거 (값 검증)

```sql
CREATE TRIGGER trg_user_validate
BEFORE UPDATE ON users
FOR EACH ROW
BEGIN
  IF NEW.email IS NULL OR NEW.email = '' THEN
    SIGNAL SQLSTATE '45000'
      SET MESSAGE_TEXT = 'Email cannot be empty';
  END IF;
END;
```

---

### 5.3 저장 프로시저 예시(명시적 호출)

```sql
CREATE PROCEDURE sp_update_balance(IN p_id INT, IN p_amount DECIMAL(10, 2))
BEGIN
  UPDATE account
  SET balance = balance + p_amount
  WHERE id = p_id;
END;
-- CALL sp_update_balance(1, 500.00);
```

---

## 6. 사용 시 고려사항

- 트리거는 가능한 간단한 로직만 담당하도록 설계

- 복잡한 업데이트/외부 연동은 프로시저나 애플리케이션으로 이동

- 트리거 명명 규칙 통일:
  `trg_<table>_<event>_<timing>` (예: trg_users_insert_after)
- 트리거 존재 여부와 기능을 문서화하여 디버깅 가능성 확보
- 순환 호출 방지 및 성능 영향 테스트 필수

---

## 7. 결론(Conclusion)

> 트리거는 **자동성**, 프로시저는 **명시적 제어**라는 차이를 기반으로 서로 다른 목적을 가진다.

트리거는 무결성·로그·검증과 같은 **“항상 실행되어야 하는 규칙”**에 적합하며, **복잡한 계산·대량 처리·업무 흐름**은 저장 프로시저가 훨씬 유리하다.

두 객체를 적절히 조합하면 안정성과 유지보수성이 높은 DB 구조를 설계할 수 있다.
