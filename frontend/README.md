## siemano czlowieku

### instalowanie nowej dependencji

```bash
docker run --rm -it -v $(pwd):/app -w /app node:22-alpine sh
```

### viewsiki

`GET /login` - logowanie

`GET /signup` - zakładanie konta

`GET /news` - lista newsów

`GET /news/[id]` - szczegóły newsa

`GET /stocks` - lista spółek

`GET /stocks/[id]` - szczegóły spółki

`GET /wallet` - portfel uzytkownika

`GET /ai` - interfest do czatbota

`GET /settings` - ustawienia aplikacji

`GET /admin/users` - lista userów
