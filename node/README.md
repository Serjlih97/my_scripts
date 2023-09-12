# Описание

Набор скриптов для ускорения работы с git docker и kubernetis

Проверенно только на `Mac OS`

## config

Подготовьте config для себя

```json
{
    "kube": {
        "pods_expire_ms": 5000
    },
    "dbs": [
        {
            "name": "db-game",
            "port": "5432",
            "local_port": "5439"
        }
    ],
    "sshs": [
        {
            "name": "ssh_name",
            "user": "user",
            "host": "host",
            "port": 22
        }
    ]
}

```

- `kube` - *object*
  - `pods_expire_ms` - *number* - Время кеширования списка подов в миллисекундах
- `dbs` - *array[object]* - Список баз данных
  - `name` - *string* - App name
  - `port` - *string* - Порт базы (5432 - postgres)
  - `local_port` - *string* - Порт локальный
- `sshs` - *array[object]* - Список ssh консолей
    - `name` - *string* - Имя ssh соединения
    - `user` - *string* - Пользователь
    - `host` - *string* - Хост
    - `port` - *number* - Порт

# Установка

```bash
npm i
npm link
npm run setup
```

# Удаление
```bash
npm unlink
npm run cleanup
```

# Команды

- [branch](#branch)
- [ctmp](#ctmp)
- [glog](#glog)
- [pull](#pull)
- [push](#push)
- [master](#master)
- [task](#task)
- [ssh](#ssh)
- [gen_grants](#gen_grants)
- [docker](#docker)
  - [exec](#docker-exec)
  - [logs](#docker-logs)
  - [restart](#docker-restart)
  - [rm](#docker-rm)
  - [start](#docker-start)
  - [status](#docker-status)
  - [stop](#docker-stop)
- [kube](#kube)
    - [db](#kube-db)
    - [delete](#kube-delete)
    - [edit](#kube-edit)
    - [exec](#kube-exec)
    - [get_restart_pods](#kube-get_restart_pods)
    - [go](#kube-go)
    - [info](#kube-info)
    - [ip](#kube-ip)
    - [kubefwd](#kube-kubefwd)
    - [logs](#kube-logs)
    - [node_inspect](#kube-node_inspect)
    - [port](#kube-port)
    - [scale](#kube-scale)
- [tele](#tele)
    - [inter](#tele-inter)
    - [leave](#tele-leave)

## branch

Перейти на активную ветку в веб интерфейс (работает с vcs и github другие системы не проверялись)
```bash
my branch
```

## ctmp

Очистка кеш дериктории
```bash
my ctmp
```

## glog

Вывод коммитов относящихся только к активной ветке
```bash
my glog
```

## pull

Получает pull по активной ветке
alias для git pull origin branch_name
```bash
my pull
```

## push

Публикует изменения по активной ветке (Так же инициирует создание MR при первой отправке изменений)
alias для git push origin branch_name
```bash
my push
```

## master

Переключает на master ветку
alias для git checkout master
```bash
my push
```

## task

Переход в таску jira по названию ветки
```bash
my task
```

## ssh

Открывает ssh консоль на основе конфига
```bash
my ssh ssh_name
```

## gen_grants

Генерирует гранты для базы данных на основе sql файла
```bash
my gen_grants db_user_name patch/to/file.sql --errors
```

Где:
- `db_user_name` - *string* - Имя пользователя базы данных
- `patch/to/file.sql` - *string* - Путь до файла с sql запросами
- `--errors` - *flag* - Флаг для просмотра ошибок

## docker

Работа с докером (для контейнеров работает автоподстановка)

### docker exec

Перейти в bash контейнера
```bash
my docker exec container_name
```

### docker logs

Посмотреть логи контейнера
```bash
my docker logs container_name
```

### docker restart

Перезапустить контенеры
```bash
my docker restart container_name container_name ...
```

### docker rm

Удалить контейнеры
```bash
my docker rm container_name container_name ...
```

### docker start

Запустить контейнеры
```bash
my docker start container_name container_name ...
```

### docker status

Статус контейнеров
```bash
my docker status
```

### docker stop

Остановить контейнеры
```bash
my docker stop container_name container_name ...
```

## kube

Работа с kubectl (Нужно чтобы был установлен kubectl и настроен)
Работает автоподстановка для неймспейсов и подов
! Неймспейсы кешируются если добавлен новый неймспейс для его появления нужно выполнить команду ctmp

### kube db

Прокидывает port баззы данных на локальное устройство
! Доступны только те что указанны в config
```bash
my kube db namespace_name app_name
```

### kube delete

Удаляет под
```bash
my kube delete namespace_name app_name
```

### kube edit

Изменить настройки deployment
```bash
my kube exec namespace_name app_name
```

### kube exec

Перейти в bash пода
```bash
my kube exec namespace_name pod_name
```

### kube get_restart_pods

Выводит список подов которые были перезапущены
```bash
my kube get_restart_pods namespace_name
```

### kube go

Перейти в веб интерфейс пода
```bash
my kube go namespace_name pod_name
```

### kube info

Вывести информацию о поде
```bash
my kube info namespace_name pod_name
```

### kube ip

Вывести ip пода
```bash
my kube ip namespace_name pod_name
```

### kube kubefwd

Пробросить порты namespace на локальную машину (Должен быть установлен kubefwd)
```bash
my kube kubefwd namespace_name
```

### kube logs

Получить логи пода
```bash
my kube logs namespace_name pod_name
```

### kube node_inspect

Прокинуть порт 9229 на локальную машину
```bash
my kube node_inspect namespace_name pod_name
```

### kube port

Прокинуть порт пода на локальную машину
```bash
my kube port namespace_name pod_name service_port local_port
```

### kube scale

Изменить количество реплик пода
```bash
my kube scale namespace_name pod_name count
```

## tele

Работа с telepresence (Нужно чтобы был установлен kubectl и настроен а так же telepresence)

### tele inter

Перехватить трафик сервиса
```bash
my tele inter namespace_name service_name service_port local_port
```

### tele leave

Выйти из режима перехвата трафика
```bash
my tele leave intercept_name
```
