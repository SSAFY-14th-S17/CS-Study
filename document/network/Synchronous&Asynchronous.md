# 동기(Synchronous)와 비동기(Asynchronous) 처리 방식

## 목차
- [동기(Synchronous)](#1-동기synchronous)
   - 동기란 무엇인가?
   - 동작 방식
   - 사용 예시
   - 장단점
- [비동기(Asynchronous)](#2-비동기asynchronous)
   - 비동기란 무엇인가?
   - 동작 방식
   - 사용 예시
   - 비동기의 성능 이점
   - 주의사항
- [다양한 환경에서의 비동기 코드](#3-다양한-환경에서의-비동기-코드)
   - Node.js 기반 비동기 처리
   - Spring 기반 비동기 처리
- [결론](#결론)

---

## 개요

프로그래밍에서 처리 효율을 최적화하는 방식으로 대표적으로 동기(Synchronous) 와 비동기(Asynchronous) 모델이 존재한다.
두 방식은 처리 순서·스레드 자원 활용·응답 방식이 다르며, 목적과 상황에 따라 전략적으로 선택되어야 한다.

## 1. 동기(Synchronous)

### 동기(Synchronous)란

말 그대로 **"동시에 일어나는 것"** 을 의미한다. **"요청과 그 결과가 동시에 일어난다는 약속이다"**


### 동작 방식

동기 방식에서는 현재 스레드가 작업 완료까지 해당 작업을 점유한다.
처리 흐름이 직렬화(Sequential)되어 있으며, 특정 작업이 완료되기 전에는 다음 로직으로 진행하지 않는다.

```
요청 → [대기] → 응답 → 다음 작업
```

따라서 호출자는 결과가 반환될 때까지 블로킹되며,
이 시간 동안 동일 스레드에서는 다른 작업이 수행되지 않는다.

### 사용 예시

- 파일을 모두 읽어야 다음 로직이 실행되는 동기 I/O
- DB 트랜잭션 처리와 같이 원자성을 보장해야 하는 연속 처리

### 특징 및 한계

동기 모델은 흐름이 직관적이고 디버깅도 단순하다.
하지만 특정 작업이 오래 걸리면 전체 응답이 지연되고, 서비스 처리량이 제한된다.
그래서 네트워크 지연 또는 I/O 비용이 큰 환경에서는 비효율적일 수 있다.

---

## 2. 비동기(Asynchronous)

### 비동기(Asynchronous)란

비동기는 결과가 호출 시점과 시간적으로 동기화될 필요가 없다는 방식이다.
요청을 보낸 후 결과를 기다리지 않고 호출자는 즉시 다음 작업을 수행할 수 있다.

즉, “작업을 맡긴 뒤, 완료되면 나중에 통보받는다”는 모델이다.

### 동작 방식

비동기 처리에서는 요청을 위임한 뒤 현재 스레드는 즉시 반환된다.
이후 결과가 도착하면 콜백(Callback), Future/Promise, 이벤트 루프 등을 통해 결과를 전달받는다.

대표적으로는 다음과 같은 식으로 사용된다.

- Node.js 이벤트 루프
- Java CompletableFuture, Reactive Streams
- Python async/await 코루틴

### 사용 예시

- 외부 API 호출
- 대용량 파일 처리
- 네트워크 I/O가 잦은 고부하 서버

이러한 작업은 대기 시간이 길기 때문에, 이 동안 스레드가 다른 작업을 처리하도록 하여 처리량을 극대화할 수 있다.

### 비동기의 성능 이점

- **자원 활용 극대화** : I/O 대기 시간 동안 다른 요청을 처리 가능
- **높은 동시성** : 수많은 요청을 병렬적으로 처리해 확장성 향상
- **지연 작업에 최적화** : 외부 API/네트워크 지연 환경에서 효과적

즉, 비동기 방식은 "응답을 언제 받을지"에 구애받지 않는 구조를 만들 수 있어
대규모 트래픽을 처리하는 서버나 실시간 데이터 처리 환경에서 매우 중요한 선택지가 된다.

### 주의사항

비동기는 언제나 “빠르다”는 뜻이 아니다.
컨텍스트 스위칭 비용, 비동기 상태 관리, 콜백 지옥, 예외 처리 난이도 등 운영 복잡도가 증가할 수 있다.
따라서 단순 흐름에서는 오히려 동기 방식이 더 안정적일 수도 있다.

---

## 3. 다양한 환경에서의 비동기 코드

### Node.js 기반 비동기 처리

Node.js는 단일 스레드 기반 런타임이지만, Event Loop + Callback Queue + Worker Pool으로 구성된 아키텍처를 기반으로 비동기를 원활하게 처리한다. 즉, **싱글스레드이지만 멀티스레드처럼 동작한다** .

즉, 하나의 스레드만 사용함에도 I/O 비용이 큰 작업을 별도의 워커 스레드로 위임하여
메인 실행 흐름이 멈추지 않는 구조를 갖는다.

- async/await 기반
```js
async function run() {
  console.log('Call API...');
  const user = await fetchUser(1); // 대기
  console.log('Result:', user);
}

run();
console.log('Main continues...');
```
주의할 점은 await는 코드 흐름만 ‘동기화’할 뿐 스레드를 블로킹하지 않는다는 것이다.
즉, 이벤트 루프는 정상적으로 계속 실행되며 다른 요청을 처리할 수 있다.

### Spring 기반 비동기 처리

Spring은 Thread Pool 기반 멀티스레드 모델을 활용한다.
즉, 메서드 호출을 별도의 스레드에서 실행해 HTTP 요청 처리 흐름과 분리한다.

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    
    private static final int CORE_POOL_SIZE   = 5;
    private static final int MAX_POOL_SIZE    = 10;
    private static final int QUEUE_CAPACITY   = 200;
    private static final long KEEP_ALIVE_TIME = 60_000L; // ms 

    @Bean(name = "threadPoolExecutor")
    public ThreadPoolExecutor threadPoolExecutor() {
        BlockingQueue<Runnable> workQueue = new LinkedBlockingQueue<>(QUEUE_CAPACITY);
        ThreadFactory threadFactory = new ThreadFactoryBuilder("app-jdk-exec-");
        RejectedExecutionHandler rejection = new ThreadPoolExecutor.CallerRunsPolicy();

        ThreadPoolExecutor executor = new ThreadPoolExecutor(
                CORE_POOL_SIZE,
                MAX_POOL_SIZE,
                KEEP_ALIVE_TIME,
                TimeUnit.MILLISECONDS,
                workQueue,
                threadFactory,
                rejection
        );
        executor.allowCoreThreadTimeOut(true);
        executor.prestartAllCoreThreads();
        return executor;
    }
}
```
```java
@Service
public class SampleService {

    @Async("threadPoolExecutor")
    public void doAsyncWithJdkPool() {
        // 비동기 실행
    }
}
```
`@Async` 메서드는 호출자와 다른 스레드에서 실행되므로, HTTP 요청 처리 스레드를 점유하지 않는다.
→ 서비스 전체 응답 지연을 줄이고 처리량을 높일 수 있다.

일반적으로 다음 케이스에서 유용하다:
- 외부 서비스 호출
- 로그 수집, 알림 발송
- 스케줄링, 백그라운드 작업

## 결론

- **동기 방식**: "순서를 보장하는 안정적 처리"에 강점이 있습니다
- **비동기 방식**: MSA 환경처럼 네트워크 지연과 대규모 동시 요청이 발생하는 구조에서 시스템 성능과 확장성을 유지하는 핵심 전략입니다

동기와 비동기는 명확한 장단점이 있다.

- 동기 : 흐름 단순, 유지보수 쉬움
→ 하지만 지연 누적으로 전체 성능 저하

- 비동기 : 자원 활용 극대화, 높은 처리량
→ 상태 관리·오류 처리 복잡, 오버엔지니어링 위험

“무조건 빠른 방식”을 선택하는 것이 아니라,
현재 시스템 구조(단일 서버 vs MSA vs 실시간 처리), 트래픽 특성, I/O 로드에 맞는 방식을 선택해야 한다.