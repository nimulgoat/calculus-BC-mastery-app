# BC Mastery: AP Calculus BC study platform

click [here](https://calc1-2-free.vercel.app/) to use it (blocked on school devices means you will have to download the source and use it locally) 

## Run (only if you plan to use this via websocket) 
    node server.js            # Node 18+, no npm install needed
    open http://localhost:3000

Accounts live on the server in data/ (scrypt-hashed PINs, one progress file per user). "Guest" keeps data in the browser only.
For another device on your network: HOST=0.0.0.0 node server.js, then open http://<your-computer-ip>:3000 (trusted networks only).

## What is inside
- public/js/tex.js: LaTeX filter. All text shown in the app passes through it (repairs converter artifacts, unicode math, bad braces, < and > inside math; never shows raw errors).
- public/js/engine.js: unlimited typed-answer problems (math.js). Answers are checked by value, so any equivalent form is accepted; antiderivatives accept any +C.
- public/data/openstax.json: 1,286 textbook problems with answers from OpenStax Calculus Vol. 1 and 2 (CC BY-NC-SA 4.0, (c) Rice University), adapted. Non-commercial use only.
- public/data/lessons.json: Flipped Math lesson index (embedded viewer). Khan Academy links open in a new tab because Khan blocks embedding.
- Desmos loads only on calculator-active questions and Part B of the simulator.
- Google Drive sync: Settings lists the 4 setup steps (needs your own OAuth Client ID; works at http://localhost:3000).

creds: gemini for the UI 
