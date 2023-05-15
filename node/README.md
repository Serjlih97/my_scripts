# Описание

Набор скриптов для ускорения работы с git docker и kubernetis

Проверенно только на `Mac OS`

## config

Подготовьте config для себя

```json
{
    "dbs": [
        {
            "name": "db-game",
            "port": "5432",
            "local_port": "5439"
        }
    ]
}

```

- `dbs` - *array[object]* - Список баз данных
  - `name` - *string* - App name
  - `port` - *string* - Порт базы (5432 - postgres)
  - `local_port` - *string* - Порт локальный

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

## docker

Работа с докером (для контейнеров работает автоподстановка)

### exec

Перейти в bash контейнера
```bash
my docker exec container_name
```

### logs

Посмотреть логи контейнера
```bash
my docker logs container_name
```

### restart

Перезапустить контенеры
```bash
my docker restart container_name container_name ...
```

### start

Запустить контейнеры
```bash
my docker start container_name container_name ...
```

### status

Статус контейнеров
```bash
my docker status
```

### stop

Остановить контейнеры
```bash
my docker stop container_name container_name ...
```

## kube

Работа с kubectl (Нужно чтобы был установлен kubectl и настроен)
Работает автоподстановка для неймспейсов и подов
! Неймспейсы кешируются если добавлен новый неймспейс для его появления нужно выполнить команду ctmp

### db

Прокидывает port баззы данных на локальное устройство
! Доступны только те что указанны в config
```bash
my kube db namespace_name app_name
```

### edit

Изменить настройки deployment
```bash
my kube exec namespace_name app_name
```

### exec

Перейти в bash пода
```bash
my kube exec namespace_name pod_name
```

### go

Перейти в веб интерфейс пода
```bash
my kube go namespace_name pod_name
```

### info

Вывести информацию о поде
```bash
my kube info namespace_name pod_name
```

### ip

Вывести ip пода
```bash
my kube ip namespace_name pod_name
```

### logs

Получить логи пода
```bash
my kube logs namespace_name pod_name
```
