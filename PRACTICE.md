Месяц 1: Core Node.js и runtime
1. Event Loop
Написать скрипт, который покажет порядок выполнения всех фаз event loop (timers → pending → poll → check → close → process.nextTick → microtasks). Добавить setTimeout, setImmediate, Promise, process.nextTick, fs.readFile, http.request
2. CommonJS vs ESM
Создать один и тот же пакет в двух вариантах (cjs и esm). Написать скрипт, который динамически импортирует модуль через import() в CommonJS-проекте и через require в ESM
3. Streams
Реализовать свой Transform stream, который сжимает текст в gzip и обратно распаковывает (без использования zlib напрямую в пайплайне). Пайп файл → ваш stream → http response
4. Buffers
Написать утилиту для склеивания видео-файлов (concat) через Buffers и Streams без внешних библиотек
5. Cluster
Написать HTTP-сервер, который в кластерном режиме распределяет нагрузку и выводит PID каждого обработанного запроса
6.Worker Threads
Реализовать тяжёлую задачу (например, вычисление 100 млн простых чисел) в Worker Thread и сравнить время с обычным выполнением
7.Async Hooks
Написать свой async hook, который логирует создание/завершение каждого asyncId и строит дерево вызовов
8.V8 & GC
С помощью –inspect-brk запустить приложение, создать heap snapshot и найти искусственную утечку памяти
9.Error Handling
Реализовать глобальный обработчик unhandledRejection + uncaughtException + multipleResolves, который пишет в Sentry-подобный файл
10
Promises internals
Написать свою минимальную реализацию Promise (then, catch, finally, Promise.all, Promise.race)
11
Async Iterators
Реализовать асинхронный итератор, который читает огромный лог-файл построчно (for await…of)
12
File System
Написать утилиту «watch-dir» — аналог tail -f для целого дерева каталогов с событиями
13
TCP/UDP
Написать TCP-эхо-сервер + UDP multicast сервер, который рассылает сообщения всем клиентам
14
HTTP без фреймворков
Полностью вручную реализовать обработку POST multipart/form-data (загрузка файлов)
15
WebSockets вручную
Реализовать WebSocket сервер и клиент только на модуле net + crypto (без ws/socket.io)
16
Child Processes
Написать пул воркеров через fork(), которые выполняют CPU-intensive задачи по очереди
17-30
(остальные core-модули)
По одному небольшому CLI-утилиту на каждый модуль (crypto → hash файлов, zlib → архиватор, etc.)
Месяц 2: Frameworks, DB и интеграции
День
Тема
Практическое задание
31
Express middleware
Написать 5 своих middleware: request-id, response-time, jwt-verify, error-handler, request-logger
32
Koa 2
Переписать задание 31 полностью на Koa 2 (без express)
33
NestJS
Создать полноценный CRUD микросервис «Tasks» с DI, guards, interceptors, custom decorators
34
Fastify
Переписать NestJS-приложение из дня 33 на Fastify + @fastify/decorator (сравнить бенчмарки)
35
Hapi
Реализовать тот же CRUD на Hapi + joi validation
36-38
REST + GraphQL
Один проект: REST + GraphQL (Apollo Server) на одном порту через мердж роутов
39
MongoDB + Mongoose
Реализовать soft-delete, versioning плагин, aggregation pipeline для аналитики
40
PostgreSQL + Sequelize
Реализовать те же фичи, что в 39, но на реляционной БД
41
Redis
Rate limiter + distributed lock + кэш с invalidation через pub/sub
42
Kafka
Producer + Consumer Group на kafkajs, с обработкой ошибок и dead-letter queue
43
RabbitMQ
Реализовать 4 паттерна: RPC, pub/sub, work queues, delayed messages (через dead-letter)
44
gRPC
Написать protobuf-контракт и сервер/клиент для сервиса «User»
45-50
Auth, CORS, Rate limiting
Полный OAuth2 Authorization Code flow с PKCE (используя oauth4webapi) + refresh token rotation
51
Logging
Сравнить Winston и Pino по скорости (написать бенчмарк)
52
Prometheus
Выставить свои метрики (http_request_duration_seconds, db_query_duration)
53-59
DB advanced
Реализовать шардирование по user_id вручную + read replicas failover
60
TypeScript advanced
Написать utility types для всех DTO из предыдущих дней + branded types
Месяц 3: Advanced архитектура и DevOps
День
Тема
Практическое задание
61
Microservices
Разбить монолит из дня 33-35 на 4 микросервиса (auth, users, tasks, files)
62
Docker
Написать multi-stage Dockerfile + docker-compose с healthchecks
63
Kubernetes
Деплойить все микросервисы в minikube: Deployment, Service, Ingress, HPA
64
CI/CD
GitHub Actions: lint → test → build → push → deploy в k8s
65-67
Testing
Покрыть 100% один из микросервисов: unit (jest) + integration (supertest) + e2e (cypress против API)
68
Load testing
Написать сценарий k6, который доводит сервис до 5000 RPS и снимает метрики
69-74
Security
Аудит и фикс всех OWASP Top 10 в проекте (sql injection, broken auth, etc.)
75-77
Performance & memory
Найти и починить 3 утечки памяти с помощью clinic doctor и flamegraph
78
Horizontal scaling
Запустить 6 инстансов сервиса за Nginx + sticky sessions
79
Circuit Breaker
Реализовать свой circuit breaker (opossum или вручную)
80
Retry + Backoff
Реализовать exponential backoff с jitter для внешних API
81
Distributed tracing
Добавить Jaeger/OpenTelemetry в микросервисы
82-86
Architecture patterns
Реализовать один сервис по Clean Architecture + DDD (bounded contexts, aggregates)
87
GraphQL Federation
Разбить GraphQL на 3 субграфа (users, tasks, reviews) и собрать gateway
88
Socket.io + rooms
Чат с комнатами, typing indicator, presence
89
Server-Sent Events
Реализовать live-обновление дашборда через SSE
90. Deno vs Bun
Переписать любой микросервис из плана на Deno и на Bun, сравнить cold start и RPS