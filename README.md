# CS-Study

## Contents

### network

* [README.md](/document/network/README.md)

### operating-system

* [Context_switching.md](/document/operating-system/Context_swithcing.md)
* [CPU_scheduling.md](/document/operating-system/CPU_scheduling.md)
* [File_System.md](/document/operating-system/File_System.md)
* [IPC.md](/document/operating-system/IPC.md)
* [Mutex&Semaphore.md](/document/operating-system/Mutex&Semaphore.md)
* [PCB(Process_Control_Block).md](/document/operating-system/PCB%28Process_Control_Block%29.md)
* [Process_state_transition.md](/document/operating-system/Process_state_transition.md)
* [Race_Condition.md](/document/operating-system/Race_Condition.md)

<br>

## About

> 2025.09.01 ~ ing

- 알고리즘과 CS 기초 지식의 이론부터 구현까지, 예비 개발자로서 알아야 할 필수 지식들을 공부하고 기록한 저장소입니다.
- 매주 스터디한 흔적인 **발표 자료**들이 업로드되어 있으며, 더 나아가 **글**로 문서화하는 것을 목표로 하고 있습니다.
- 자동 문서 인식: document/ 폴더에 .md 파일을 추가하면 자동으로 웹사이트에 반영됩니다( GitHub Actions를 통한 자동 빌드 및 배포 )


### Project Structure
```
cs-study/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflows
├── document/                   # document
├── scripts/
│   └── generate-docs.js        # 문서 자동 스캔 스크립트
├── index.html                  # Main page
├── main.js                     # Main JavaScript
├── docs.json                   # 자동 생성된 문서 목록
├── package.json
└── vite.config.js
```


### Repository Rule


#### Package Structure
* `document/` 폴더 아래에 카테고리별 폴더 생성
  * ex) `document/network/`, `document/operating-system/`

#### Naming Convention
* `.md` 파일명이 자동으로 제목으로 표시됨
* 언더스코어(`_`)는 슬래시(`/`)로 변환
  * ex) `B-Tree_B+Tree.md` → "B-Tree/B+Tree"

#### Git Convention

- **Branch**
* 형식: `대주제/`
* ex) `OperatingSystem/cpu-scheduling`

- **Commit**
* 형식: `[대주제] 소주제 분류`
* 분류: 이론정리, 구현, 자료업로드, 질의응답
* ex) `[OperatingSystem] CPU 스케줄링 알고리즘 업로드`


### Collaborator

| <img src="https://github.com/KoalaJimin.png" width="100"> | <img src="https://github.com/9imDohee.png" width="100"> | <img src="https://github.com/Hyun00505.png" width="100"> | <img src="https://github.com/PNoahKR.png" width="100"> | <img src="https://github.com/youyeon11.png" width="100"> | <img src="https://github.com/mingeung.png" width="100"> |
|---|---|---|---|---|---|
| [@KoalaJimin](https://github.com/KoalaJimin) | [@9imDohee](https://github.com/9imDohee) | [@Hyun00505](https://github.com/Hyun00505) | [@PNoahKR](https://github.com/PNoahKR) | [@youyeon11](https://github.com/youyeon11) | [@mingeung](https://github.com/mingeung) |



### Build and Deploy
```bash
yarn install
yarn generate-docs
yarn dev
yarn build
```


### Reference

- [gyoogle/tech-interview-for-developer](https://github.com/gyoogle/tech-interview-for-developer)
- [JaeYeopHan/Interview_Question_for_Beginner](https://github.com/JaeYeopHan/Interview_Question_for_Beginner)
- [WeareSoft/tech-interview](https://github.com/WeareSoft/tech-interview)
- [jobhope/TechnicalNote](https://github.com/jobhope/TechnicalNote)
- [milooy/TIL](https://github.com/milooy/TIL)