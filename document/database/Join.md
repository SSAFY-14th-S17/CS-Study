# JOIN

- [JOIN이란?](#join이란)
- [종류](#종류)
  - [1. INNER JOIN](#1-inner-join)
  - [2. OUTER JOIN](#2-outer-join)
    - [2.1 LEFT OUTER JOIN left-join](#21-left-outer-join-left-join)
    - [2.2 RIGHT OUTER JOIN right-join](#22-right-outer-join-right-join)
    - [2.3 FULL OUTER JOIN](#23-full-outer-join)
  - [3. CROSS JOIN](#3-cross-join)
  - [4. SELF JOIN](#4-self-join)

        
## JOIN이란?

JOIN은 하나 이상의 테이블에 있는 데이터를 공통된 키를 기준으로 연결하여 하나의 결과 테이블로 만드는 연산이다. 이 키는 일반적으로 **외래키(Foreign Key, FK)**를 기반으로 된다.
JOIN은 RDBMS(관계형 데이터베이스 관리 시스템)의 핵심 기능으로, 여러 곳에 분산 저장된 데이터를 통합하여 필요한 정보를 얻을 때 필요한 과정이다.

---

## 종류

### 1. INNER JOIN

두 테이블에서 조인 조건에 일치하는 행만을 반환한다. 일반적으로 SQL에서 JOIN이라고 하면 INNER JOIN을 의미한다.

**사용 시기**: 두 테이블 모두에 존재하는 데이터의 교집합이 필요할 때
ex) 고객 테이블과 주문 테이블에서 고객이 어떤 주문을 하였는지 확인하려고 할 때 두 테이블의 교집합을 찾는다.

![join_1](/document/images/db_join_1.png)


```sql
SELECT *
FROM A_테이블
INNER JOIN B_테이블
ON A_테이블.공통컬럼 = B_테이블.공통컬럼;
```



---

### 2. OUTER JOIN

외부 조인으로, 기준이 되는 테이블의 모든 행을 포함하고, 일치하는 데이터가 없는 경우에 NULL을 채워서 반환한다.

#### 2.1 LEFT OUTER JOIN (LEFT JOIN)

왼쪽 테이블의 모든 행을 포함하고, 오른쪽 테이블에서는 일치하는 행만 포함한다. 일치하는 행이 없으면 오른쪽 컬럼에는 NULL이 표시된다.

![join_2](/document/images/db_join_3.png)


왼쪽 테이블은 모두 포함, 오른쪽 테이블은 왼쪽에 맞춰서 표시



**기본 문법**:
```sql
SELECT *
FROM A_테이블  -- LEFT 테이블 (모든 행 포함)
LEFT OUTER JOIN B_테이블
ON A_테이블.공통컬럼 = B_테이블.공통컬럼;
```


#### 2.2 RIGHT OUTER JOIN (RIGHT JOIN)

LEFT와 반대의 JOIN으로, 오른쪽 테이블의 모든 행을 포함하고, 왼쪽 테이블에서는 일치하는 행만 포함한다.

![join_3](/document/images/db_join_3.png)


오른쪽 테이블은 모두 포함, 왼쪽 테이블은 오른쪽에 맞춰서 표시


**기본 문법**:
```sql
SELECT *
FROM A_테이블
RIGHT OUTER JOIN B_테이블  -- RIGHT 테이블 (모든 행 포함)
ON A_테이블.공통컬럼 = B_테이블.공통컬럼;
```


#### 2.3 FULL OUTER JOIN

왼쪽 테이블과 오른쪽 테이블의 모든 행을 포함한다. 일치하는 쌍이 있으면 합치고, 일치하는 행이 없으면 반대쪽 테이블의 컬럼에 NULL을 표시한다.

**사용 시기**: 두 테이블의 모든 데이터를 빠짐없이 확인하고 싶을 때

![join_4](/document/images/db_join_4.png)


```sql
SELECT *
FROM A_테이블
FULL OUTER JOIN B_테이블
ON A_테이블.공통컬럼 = B_테이블.공통컬럼;
```


---

### 3. CROSS JOIN

두 테이블의 모든 행을 조합하여 반환한다. 결과는 **A 테이블 행 수 × B 테이블 행 수** 만큼 생성된다.

**사용 시기**: 
- 모든 가능한 조합을 생성하려고할 때
- 테스트 데이터 생성 시
- 카르테시안 곱(Cartesian Product)이 필요한 경우

![join_5](/document/images/db_join_5.png)


```sql
SELECT *
FROM A_테이블
CROSS JOIN B_테이블;
```

---

### 4. SELF JOIN

하나의 테이블을 마치 두 개의 독립된 테이블처럼 사용하여 스스로 조인하며 참조하는 방식이다.
동일한 테이블을 참조해야하기 때문에 반드시 다른 별칭(alias)를 사용해야한다.

**사용 시기**:
- 동일한 테이블 내에서 계층적 관계를 표현할 때
- 특정 행과 다른 행을 비교해야 할 때
- 조직도, 추천인 관계 등을 조회할 때

**기본 문법**:
```sql
SELECT
    E1.이름 AS 직원,
    E2.이름 AS 상사
FROM
    직원_테이블 E1  -- 직원을 위한 테이블
INNER JOIN
    직원_테이블 E2  -- 상사를 위한 테이블
ON
    E1.상사ID = E2.직원ID;
```

---

REF

- https://github.com/gyoogle/tech-interview-for-developer/blob/master/Computer%20Science/Database/%5BDatabase%20SQL%5D%20JOIN.md
- https://hongong.hanbit.co.kr/sql-%EA%B8%B0%EB%B3%B8-%EB%AC%B8%EB%B2%95-joininner-outer-cross-self-join/