# ProcessApp Deployment

## 1) Backend on Render

1. Push this repo to GitHub.
2. In Render, create a new `Web Service` from the repo.
3. Use these settings:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables in Render:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `ALLOWED_ORIGINS` = `https://intelligc.org,https://www.intelligc.org`
5. Deploy and copy the Render URL (example: `https://processapp-api.onrender.com`).
6. Verify backend:
   - `GET https://<render-url>/api/health`
   - Expected: `{ "ok": true, "service": "processapp-server" }`

## 2) Frontend for intelligc.org

1. In `client`, create `.env` from `.env.example`.
2. Set:
   - `VITE_API_BASE_URL=https://<render-url>/api`
3. Build frontend:
   - `cd client`
   - `npm run build`
4. Upload everything from `client/dist` to your `intelligc.org` hosting public folder.
5. Open `https://intelligc.org` and test login + folder/item operations.

## 3) Functional checks

1. Register a new user.
2. Login and create folders/items.
3. Logout and login again; data should still be present.
4. Open the same account on another device; same data should appear.

## 4) Optional hardening

1. In Atlas, replace open IP rule `0.0.0.0/0` with limited IPs.
2. Rotate DB password and JWT secret after setup.
