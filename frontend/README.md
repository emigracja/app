## siemano czlowieku

```bash
docker build -t emigracja-frontend .
docker run -p 3000:3000 -v $(pwd):/app -v /app/node_modules emigracja-frontend
```

### instalowanie nowej dependencji

```bash
docker run --rm -it -v $(pwd):/app -w /app node:22-alpine sh
```