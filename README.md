# web3-freelancer
e6998-fa23

clone to your local computer and have docker installed and logged in

for fronend dev, use
```
cd backend
docker build -t backend .
docker compose up
cd ../frontend
npm install
npm start
```
for frontend production, use

```
cd backend
docker build -t backend .
docker compose up
cd ../frontend
docker build -t frontend .
cd ..
docker compose up
```

access the backend at
```
http://localhost:3001
```
access the frontend at (dev)
```
http://localhost:3000
```


