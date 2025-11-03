# 🔐 Password Vault
A secure password manager built using Next.js, MongoDB, and CryptoJS for client-side encryption. Users can sign up, log in, generate strong passwords, and manage their vault securely with a clean and minimal interface. Includes light/dark mode toggle and search functionality.

## 🚀 Live Demo
https://vault-drab-one.vercel.app

## 🧠 Features
- User authentication (signup/login)
- Add, edit, delete, and search passwords
- AES encryption using CryptoJS (client-side)
- Copy to clipboard with auto-clear
- Light/Dark mode toggle
- MongoDB data storage (no plain text ever stored)

## ⚙️ Tech Stack
Frontend: Next.js 14, React, TailwindCSS  
Backend: Next.js API Routes, MongoDB (Mongoose)  
Encryption: CryptoJS (AES encryption)

## 🧩 How to Run Locally
Clone the repository and move into it:  
git clone https://github.com/<your-username>/password-vault.git  
cd password-vault  

Install dependencies:  
npm install --legacy-peer-deps  

Create a `.env.local` file in the root folder and add:  
MONGODB_URI=your_mongodb_connection_string  
NEXT_PUBLIC_SECRET=anyrandomkey  

Run the development server:  
npm run dev  

Visit: http://localhost:3000  

## 🔐 Crypto Note
This project uses AES encryption from CryptoJS to ensure passwords are encrypted before leaving the client. AES is chosen because it’s secure, fast, and symmetric, allowing smooth encryption and decryption while keeping user data private and safe.

## 🧑‍💻 Author
Mandeep Nehra  
B.Tech AI & Data Science | Full Stack Developer


