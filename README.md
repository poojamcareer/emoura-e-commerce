Emoura Frontend
A stylish and responsive e-commerce frontend built for Emoura, featuring product exploration, category pages, cart, authentication pages, and dashboard UI.
Designed to integrate seamlessly with the Emoura backend.
Features

🛍️ Product listing & category pages (Women, Girls, Footwear, Beauty, etc.)

🔍 Explore & dashboard pages

🛒 Cart (Bag) and Wishlist UI

🔐 Login & Profile pages

🎨 Custom styling with CSS

⚡ Centralized JavaScript logic for dynamic behavior
frontend/
│
├── assets/          # Static assets
├── images/          # Product & UI images
│
├── app.js           # Entry-level JS
├── app.fixed.js     # 🚀 MAIN business logic (see note below)
│
├── bag.html
├── beauty.html
├── dashboard.html
├── explore.html
├── footwear.html
├── girls.html
├── login.html
├── profile.html
├── wishlist.html
├── women.html
│
└── styles.css       # Global styles
app.fixed.js is the core logic file of this frontend.

It contains:

main JavaScript logic

UI interactions

data handling

page behavior control

⚠️ This file is larger than GitHub’s 25MB upload limit, so it is not included in this repository.

✅ This is intentional
✅ Not an error
✅ Project still valid and functional

In real-world projects, large bundled files are usually generated during build steps and are often excluded from version control.
Tech Stack

HTML5

CSS3

Vanilla JavaScript

Git & GitHub
Backend Integration

This frontend is designed to work with the Emoura Backend (Spring Boot + MySQL), handling:

product data

cart operations

user authentication

dashboard data
Project Purpose

This project was built as a full-stack portfolio project to demonstrate:

frontend architecture

UI design

JavaScript logic handling

real-world GitHub practices  
Author

Pooja
Aspiring Full-Stack Developer
 Building. Learning. Shipping. 
