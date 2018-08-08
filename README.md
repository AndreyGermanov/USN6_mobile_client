УСН 6%

Данная программа предназначена для ввода сведений, необходимых для формирования отчета "Книга учета доходов и расходов" для организаций и индивидуальных предпринимателей, работающих по "Упрощенной Системе Налогообложения" с объектом налогообложения "Доходы" или говоря простым языком, УСН 6%.

Данный репозиторий содержит серверную часть (бэкенд). Это HTTP-сервер, который принимает HTTP-запросы для взаимодействия с базой данных, выполняет их и возвращает результаты в формате JSON. База данных содержит следующие сущности:

Организации
Банковские счета
Документы, подтверждающие доходы
Документы, подтверждающие расходы
Отчеты
Пользователи

Сервер предоставляет доступ к API, который позволяет:

* Выполнять аутентификацию на сервере, для того чтобы получить доступ к последующим операциям
* выполнять CRUD операции над этими сущностями
* Осуществлять выборку (SELECT) с различными условиями и сортировкой
* Генерировать отчет "Книга учета доходов и расходов" в формате HTML и PDF, возвращать отчет в теле HTTP ответа или отправлять его по email

Установка

Установка зависимостей

Прежде чем устанавливать бэкенд, дожны быть установлены следующие внешние компоненты (зависимости):

* Java Runtime Environment 7 или 8
* Сервер баз данных OrientDB
* Учетная запись на любом SMTP-сервере электронной почты

Сервер баз данных OrientDB можно загрузить и установить руководствуясь следующей инструкцией: https://www.orientdb.com/docs/last/gettingstarted/Tutorial-Installation.html

Также, необходимо подготовить данные о SMTP сервере и учетной записи на нем, которая будет использоваться для отправки отчета по email.

После установки OrientDB, загрузите начальную базу данных из файла в подпапке /backup данного репозитория.

После этого откройте конфигурационный файл "config.json" и установите параметры разделов "db" и "mail" в соответствии с установленном сервером БД и учетной записью электронной почты.

Также, измените поле "port" в разделе web, если хотите чтобы бэкенд принимал запросы на порте, отличном от 8085. Остальные параметры можно не менять.

Сборка и запуск сервера

Для сборки сервера необходимо установить систему сборки "Gradle". Продукт создавался с использованием версии 4.1, поэтому данная и более новая версия должны работать. Установить Gradle можно из репозитория ОС, или c сайта https://gradle.org/.

Затем скачайте весь репозиторий, войдите в каталог "main" и запустите:

./gradlew build






