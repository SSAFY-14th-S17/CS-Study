# CPU 스케줄링


CPU 스케줄링은 한정된 CPU 자원을 시스템 내의 여러 프로세스(또는 스레드)들에게 공정하고 효율적으로 할당하는 정책 및 과정이다. 실행 대기 중인 프로세스(준비 큐, Ready Queue) 중에서 다음에 어떤 프로세스에게 CPU를 할당할지를 결정한다.

<br>

## 목적

CPU 스케줄링의 최종 목적은 **시스템의 성능을 최적화**하는 것이다. 여러 프로세스들이 공정하고 효율적으로 CPU를 할당받을 수 있도록 관리한다.

### 최적화 지표

**증대 목표**
- **CPU 이용률(CPU Utilization)**: CPU가 쉬지 않고 최대한 많이 작업을 수행하도록 하여 시스템 효율을 제고
- **처리량(Throughput)**: 단위 시간당 완료되는 프로세스의 수를 최대화

**최소화 목표**
- **대기 시간(Waiting Time)**: 프로세스가 준비 큐에서 기다리는 시간
  - 계산식: `Waiting Time = Turnaround Time - Burst Time`
- **응답 시간(Response Time)**: 요청 후 첫 번째 응답이 나올 때까지의 시간
  - 계산식: `Response Time = CPU Allocation Time - Arrival Time`
- **소요 시간(Turnaround Time)**: 프로세스가 시스템에 들어와서 완료될 때까지 걸리는 총 시간

<br>

## 스케줄러 종류

![](/document/images/cpu_scheduling_1.png)

### 장기 스케줄러(Long-Term Scheduler)
- **별칭**: 작업 스케줄러(Job Scheduler)
- **역할**: 어떤 프로세스를 시스템에 받아들여 준비 큐에 넣을지 결정
- **특징**: 시스템 내 프로세스 수(다중 프로그래밍 정도)를 조절하며, 실행 빈도가 적고 느리다

### 중기 스케줄러(Medium-Term Scheduler)

![](/document/images/cpu_scheduling_2.png)

- **별칭**: 중단/재개 스케줄러
- **역할**: 메모리 관리를 위해 프로세스를 메모리에서 디스크로 내보내거나(Swap Out), 다시 메모리로 불러들인다(Swap In)
- **특징**: 시스템 과부하 시 작동하며, 실행 빈도는 중간 수준이다

### 단기 스케줄러(Short-Term Scheduler)
- **역할**: 준비 큐에 있는 프로세스 중 다음에 CPU를 사용할 프로세스를 선택하고 CPU를 할당
- **특징**: 실행 빈도가 매우 잦고 빠르다

<br><br>

## 스케줄링 알고리즘

![alt text](/document/images/cpu_scheduling_3.png)

CPU 스케줄링 알고리즘은 **CPU를 할당받은 프로세스가 작업 도중에 CPU를 강제로 빼앗길 수 있는지 여부**에 따라 두 가지로 분류된다.

### 비선점형 스케줄링(Non-Preemptive Scheduling)

프로세스가 CPU를 할당받으면 작업이 완료되거나 스스로 대기 상태로 전환될 때까지 CPU를 점유하며, 다른 프로세스가 중간에 CPU를 빼앗을 수 없다.

**장점**: 오버헤드가 적다  
**단점**: 중요한 작업이 긴 작업 뒤에 대기해야 하는 문제가 발생할 수 있다

#### FCFS(First-Come, First-Served)

![image](/document/images/cpu_scheduling_4.png)

- 준비 큐에 도착한 순서대로 CPU를 할당(FIFO)
- 구현이 가장 간단하다
- **단점**: 긴 프로세스가 먼저 도착하면 뒤의 짧은 프로세스들이 오래 기다리는 호위 효과(Convoy Effect) 발생 가능

#### SJF(Shortest-Job-First)

![image](/document/images/cpu_scheduling_5.png)

- CPU 사용 시간이 가장 짧은 프로세스에게 CPU를 할당
- 평균 대기 시간이 가장 짧은 최적의 알고리즘
- **단점**: 
  - 실제 사용 시간을 예측하기 어렵다
  - 긴 프로세스가 영원히 실행되지 못하는 기아 현상(Starvation) 발생 가능

#### 우선순위 스케줄링(Priority Scheduling)
- 가장 높은 우선순위를 가진 프로세스에게 CPU를 할당
- **단점**: 우선순위가 낮은 프로세스가 무한정 대기하는 기아 현상 발생 가능
- **해결 방법**: 에이징(Aging) 기법으로 오래 기다린 프로세스의 우선순위를 점차 높여준다

### 선점형 스케줄링(Preemptive Scheduling)

프로세스가 CPU를 사용 중이라도 우선순위가 더 높은 프로세스가 도착하거나 할당된 시간(Time Quantum)이 만료되면 현재 프로세스의 CPU 사용을 중단시키고 다른 프로세스에게 할당할 수 있다.

**적합한 시스템**: 반응 시간이 중요한 대화형 시스템이나 실시간 시스템

#### 라운드 로빈(Round Robin, RR)

![image](/document/images/cpu_scheduling_6.png)

- FCFS에 시간 할당량(Time Slice 또는 Time Quantum) 개념을 추가
- 프로세스는 할당 시간 동안만 CPU를 사용하고, 끝나지 않으면 준비 큐 맨 뒤로 이동
- 시분할 시스템에 적합하고 공평성이 높다
- **주의사항**:
  - 할당 시간이 너무 길면 FCFS와 유사해진다
  - 할당 시간이 너무 짧으면 잦은 컨텍스트 스위칭으로 인한 오버헤드가 커진다

#### SRTF(Shortest-Remaining-Time-First)
- SJF의 선점형 버전
- 현재 실행 중인 프로세스의 남은 시간보다 더 짧은 남은 시간을 가진 새 프로세스가 도착하면 CPU를 선점
- 평균 대기 시간이 가장 짧다
- **단점**: 새로운 프로세스가 도착할 때마다 남은 시간을 비교해야 하므로 오버헤드 발생 가능

#### 다단계 큐(Multi-Level Queue)

![image](/document/images/cpu_scheduling_7.png)

- 프로세스를 특성에 따라 여러 개의 준비 큐로 분류
- 각 큐마다 다른 스케줄링 알고리즘을 적용
- 각 큐 사이에는 고정된 우선순위가 존재 (상위 큐가 비어야 하위 큐 실행)
- **제약**: 큐 간의 프로세스 이동 불가능

#### 다단계 피드백 큐(Multi-Level Feedback Queue, MLFQ)
- 다단계 큐의 개선 버전으로, 프로세스가 큐 간에 이동 가능
- CPU를 오래 사용한 프로세스는 낮은 우선순위 큐로 이동
- 낮은 큐에서 오래 대기한 프로세스는 높은 큐로 이동하여 기아 현상 방지(에이징)
- **현대 운영체제에서 가장 일반적으로 사용되는 스케줄링 방식**


---

REF
- https://www.geeksforgeeks.org/operating-systems/process-schedulers-in-operating-system/
- https://www.geeksforgeeks.org/operating-systems/cpu-scheduling-criteria/
- https://www.geeksforgeeks.org/operating-systems/multilevel-queue-mlq-cpu-scheduling/