# gotham-pdf

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.11. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.


## Docker configuration
Build docker container
```bash
docker build -t gotham-pdf .
```

Run container using port 3000
```bash
docker run -p 3000:3000 gotham-pdf
```
