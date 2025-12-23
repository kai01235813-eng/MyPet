# 🐕 Gemini Pet - AI 시바견 키우기

Gemini API를 활용한 인터랙티브 펫 키우기 게임입니다. 창작 활동, 뉴스 검색, 지식 탐구 등 생산적인 활동을 할 때마다 펫이 성장합니다!

## 📸 스크린샷

### 초기 화면
![초기 화면](https://github.com/user-attachments/assets/407a592b-7b3b-4d27-995a-eddc3e025cf4)

### 채팅 인터페이스
![채팅 화면](https://github.com/user-attachments/assets/22e0e12e-4f82-4596-8956-c8362b112fdd)

## 🚀 시작하기

### 1. Gemini API 키 발급
1. [Google AI Studio](https://aistudio.google.com/app/apikey)에 접속
2. API 키를 발급받습니다

### 2. 로컬에서 테스트하기

```bash
# 저장소 클론
git clone https://github.com/kai01235813-eng/MyPet.git
cd MyPet

# Python 내장 HTTP 서버 실행
python3 -m http.server 8000

# 또는 Node.js를 사용하는 경우
npx http-server -p 8000
```

브라우저에서 `http://localhost:8000`으로 접속하세요.

### 3. 코드스페이스에서 테스트하기

GitHub Codespaces는 클라우드 기반 개발 환경이라 별도 설치 없이 바로 테스트할 수 있습니다:

1. 이 저장소에서 `Code` 버튼 클릭 → `Codespaces` 탭 선택
2. "Create codespace on main" 클릭
3. 코드스페이스가 열리면 터미널에서 실행:
   ```bash
   python3 -m http.server 8000
   ```
4. 포트 포워딩 알림이 나타나면 "Open in Browser" 클릭
5. 또는 "PORTS" 탭에서 포트 8000을 찾아 브라우저 아이콘 클릭

## 🎮 게임 방법

1. **API 키 입력**: 발급받은 Gemini API 키를 입력합니다
2. **대화하기**: 시바견과 자유롭게 대화하세요
3. **생산적인 활동하기**: 
   - 🎵 노래 가사나 시 창작
   - 📰 뉴스 검색 및 정보 탐색
   - 📚 지식 검색 및 학습
   - ✨ 창의적인 이야기 만들기
4. **펫 성장**: 생산적인 활동을 할 때마다 경험치를 얻고 레벨업합니다!

## 🎯 주요 기능

- ✅ Gemini API 연동
- ✅ 시바견 캐릭터 (이모지 기반)
- ✅ 실시간 채팅 인터페이스
- ✅ 활동 유형 자동 감지 (창작, 뉴스, 지식)
- ✅ 경험치 및 레벨 시스템
- ✅ 펫 기분 상태 표시
- ✅ 애니메이션 효과
- ✅ 로컬 스토리지 저장

## 🛠️ 기술 스택

- 순수 HTML/CSS/JavaScript (프레임워크 없음)
- Google Gemini API
- LocalStorage (데이터 저장)

## 📝 활동 유형별 보상

| 활동 유형 | 경험치 | 예시 |
|---------|--------|------|
| 🎨 창작 활동 | +30 | 노래 가사, 시, 이야기 만들기 |
| 📚 지식 검색 | +25 | 학습, 설명 요청 |
| 📰 뉴스 검색 | +20 | 최근 소식, 뉴스 요청 |
| 💬 일반 대화 | +0 | 일상 대화 |

## 🤝 기여하기

이슈나 풀 리퀘스트는 언제나 환영합니다!

## 📄 라이선스

MIT License