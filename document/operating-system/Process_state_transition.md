## 1. 프로세스의 상태(Process States)

실행되고 있는 프로세스는 고유의 상태를 가지고 있고, 프로세스가 생성되고 종료될 때까지 상태는 변화한다.

프로세스의 상태 종류에는 아래와 같이 5가지가 있다.

![Process_state_transition.png](/document/images/Process_state_transition.png)

### 1) New(새로운 상태)

- **프로세스가 생성**되고 준비 상태로 이동하기 이전의 상태이다.

### 2) Ready(준비 상태)

- CPU가 할당되기 전까지 **대기하고 있는 상태**이다.
- 준비 상태에 있는 프로세스는 언제든지 CPU를 할당받을 수 있다.

### 3) Running(실행 상태)

- 프로세스가 CPU를 할당받아 **실제로 실행되고 있는 상태**이다.
- 실행 상태에서 프로세스는 연산 작업, 명령어 실행, 데이터 처리 등을 실행한다.
- 실행 상태는 프로세스의 주요 작업이 이루어지는 단계로, 프로세스는 CPU를 완전히 독점하여 작업을 처리하게 된다.

### 4) Waiting(대기 상태)

- 프로세스가 실행 중에 **I/O 작업이나 다른 이벤트를 기다릴 때의 상태**이다.
- 예를 들어 파일 읽기/쓰기, 사용자 입력 등을 기다리는 경우가 잇다.

### 5) Terminated(종료 상태)

- 프로세스가 **실행을 완료하고 종료된 상태**이다.
- 프로세스가 종료 상태에 도달하게 되면 더 이상 실행되지 않는다.

## 2. 프로세스 상태 전이(Process State Transition)

프로세스가 시스템 내에 존재하는 동안 프로세스의 상태는 변화하게 된다.

### 1) Admit : New -> Ready

- 프로세스가 생성되면 준비가 끝난 후 Ready 큐에 들어간다.
- Ready 큐에서 CPU가 할당되기를 기다린다.

### 2) Dispatch : Ready -> Running

- 운영체제의 스케줄러가 Ready 큐에서 프로세스를 선택하여 CPU를 할당하면 Running 상태로 전이된다.

### 3) Block : Running -> Waiting

- 실행 중인 프로세스가 I/O 작업 또는 다른 이벤트를 기다릴 때 Waiting 상태로 전이된다.

### 4) Wake-Up : Waiting -> Ready

- I/O 작업이나 이벤트가 완료되면 Ready 상태로 돌아간다.

### 5) Interrupt(Time runout) : Running -> Ready

- **선점형(Preemptive) 스케줄링** 시스템에서 발생하며, 주로 다음 두 가지 상황에서 발생한다:
  - **시간 할당량 (Time Slice) 초과**: 프로세스가 정해진 시간을 다 사용하여 **CPU를 반납**하고 Ready 큐로 돌아간다.
  - **더 높은 우선순위의 프로세스 등장**: 다른 중요한 인터럽트 발생으로 CPU를 빼앗기고 Ready 큐로 돌아간다.

### 6) Exit : Running -> Terminated

- 프로세스가 실행을 완료하면 종료되고 Terminated 상태로 전이된다.

---

REF
https://august-jhy.tistory.com/152#google_vignette
https://github.com/gyoogle/tech-interview-for-developer/blob/master/Computer%20Science/Operating%20System/CPU%20Scheduling.md
