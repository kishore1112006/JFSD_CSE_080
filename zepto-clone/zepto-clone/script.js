/* ---------------------------------- */
/* 🔘 Toggle Button Logic             */
/* ---------------------------------- */

// Get the toggle button element
const toggle = document.getElementById("toggle-btn");

// Listen for click event on the toggle button
toggle.addEventListener("click", () => {
  // Toggle the "toggled" class on/off
  toggle.classList.toggle("toggled");

  // Optional: redirect to another page when toggled
  // Uncomment below if redirection needed
  if (toggle.classList.contains("toggled")) {
    setTimeout(() => {
      window.location.href = "supersaver.html";
    }, 300);
  }
});


/* ---------------------------------- */
/* 🔍 Animated Search Placeholder     */
/* ---------------------------------- */

// Search input element
const searchInput = document.getElementById("searchInput");

// Suggestions to rotate in placeholder
const suggestions = ["milk", "bread", "cheese", "butter", "paneer"];
let index = 0;

function updatePlaceholder() {
  // Restart animation by removing and re-adding fade-up class
  searchInput.classList.remove("fade-up");
  void searchInput.offsetWidth; // Force reflow
  searchInput.classList.add("fade-up");

  // Update input's placeholder with new suggestion
  searchInput.placeholder = `Search for "${suggestions[index]}"`;

  // Move to next suggestion, loop back to 0
  index = (index + 1) % suggestions.length;
}

// Start rotation every 2 seconds
setInterval(updatePlaceholder, 2000);
updatePlaceholder(); // Call immediately on page load



const sugBtns = document.querySelectorAll(".sug-btn");
sugBtns.forEach(button=>{
  button.addEventListener("click",()=>{
    sugBtns.forEach(b=>{
      b.classList.remove("active")
    });
    button.classList.add("active");
  });
});
sugBtns[0].classList.add("active");


/* ---------------------------------- */
/* 📍 Location Dialog Logic           */
/* ---------------------------------- */

// Get DOM elements related to the location popup
const locDialogOne = document.getElementById("loc-dialog");               // Dialog box
const openLocBtn = document.getElementById("loc-open-dialog");      // Open dialog button
const closeLocBtn = document.getElementById("close-dialog");        // Close dialog button
const minInfo = document.getElementById("9min-info");               // Shows delivery time
const fetchedDisplay = document.getElementById("fetched-display");  // Shows formatted address
const chevDown = document.querySelector(".fa-chevron-down");       // Chevron icon in button

// Open location modal when "Select Location" is clicked
openLocBtn.addEventListener("click", () => {
  locDialogOne.showModal();
});

// Close location modal when 'X' is clicked
closeLocBtn.addEventListener("click", () => {
  locDialogOne.close();
});

/* ---------------------------------- */
/* 📍 Get Current Location Logic      */
/* ---------------------------------- */

const getLocBtn = document.getElementById("get-loc");

// When user clicks "Use My Current Location"
getLocBtn.addEventListener("click", () => {
  // Check if geolocation is supported
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    getLocBtn.innerText = "Your browser is not supported";
  }
});

/* ---------------------------------- */
/* ✅ On Success: Fetch Location Info */
/* ---------------------------------- */

function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  const apiKey = "320b891560774ec49f619adef5b86d44"; // Replace with your own key
  const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`;

  // Fetch formatted address from OpenCage API
  fetch(url)
    .then(response => response.json())
    .then(result => {
      console.log(result); // Debugging

      const allDetails = result.results[0].components;
      const { county, postcode, country } = allDetails;

      // Show address in UI
      fetchedDisplay.innerText = `${county} ${postcode} , ${country}`;

      // Update delivery time
      minInfo.innerHTML = `
        <span style="font-size: 20px; font-weight: 600; margin-right: 6px;">
          Delivery In <strong style="color:green">12 Mins</strong>
        </span>`;

      // Hide chevron icon after selecting location
      chevDown.style.display = "none";

      // Close modal
     locDialogOne.close();
    })
    .catch(() => {
      fetchedDisplay.innerText = "Failed to fetch location";
    });
}

/* ---------------------------------- */
/* ❌ On Error: Handle Geolocation Fail */
/* ---------------------------------- */

function onError(error) {
  if (error.code === 1) {
    getLocBtn.innerText = "You denied the request";
  } else if (error.code === 2) {
    getLocBtn.innerText = "Location not available";
  } else {
    getLocBtn.innerText = "Something went wrong";
  }
}



// -------------------------------------
// 🔐 Login Dialog Management
// -------------------------------------

const loginOpenDialogOne = document.getElementById("login-dialog");
const loginTwoOpenDialog = document.getElementById("login-dialog-two");
const loginOpenBtn = document.getElementById("login-open-dialog");

// Toggle for development mode
const isDevMode = false; // 🔁 Set to false in production

// Open first dialog on button click
loginOpenBtn.addEventListener("click", () => {
  loginOpenDialogOne.showModal();
});

// Close dialogs if clicking outside
window.addEventListener("click", (event) => {
  if (event.target === loginOpenDialogOne) loginOpenDialogOne.close();
  if (event.target === loginTwoOpenDialog) loginTwoOpenDialog.close();
});

// -------------------------------------
// 📲 OTP Dialog & Firebase Setup
// -------------------------------------

const firebaseConfig = {
  apiKey: "AIzaSyBvygWaBr-spPB91OhhFxYlaQuSaieGapI",
  authDomain: "otp-for-num.firebaseapp.com",
  projectId: "otp-for-num",
  storageBucket: "otp-for-num.appspot.com",
  messagingSenderId: "1094935946052",
  appId: "1:1094935946052:web:00ed380b751f860dd1ed11",
  measurementId: "G-YNGWXVBYR6"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
let confirmationResult;

function sendOTP() {
  const resultDiv = document.getElementById("result");
  resultDiv.innerText = "";

  const phoneNumber = document.getElementById("phone-number").value.trim();

  const phoneRegex = /^\+91\d{10}$/;
  if (!phoneRegex.test(phoneNumber)) {
    alert("Please enter a valid Indian number in format +91XXXXXXXXXX");
    return;
  }

  const recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container", {
    size: "invisible",
    callback: () => console.log("✅ reCAPTCHA solved"),
  });

  recaptchaVerifier.render().then(() => {
    auth.signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((result) => {
        confirmationResult = result;
        resultDiv.innerText = "✅ OTP sent to " + phoneNumber;

        loginOpenDialogOne.close();
        loginTwoOpenDialog.showModal();
      })
      .catch((error) => {
        resultDiv.innerText = `❌ Error: ${error.message}`;
        console.error("OTP send error:", error);
      });
  });
}

function verifyOTP() {
  const otp = document.getElementById("otp").value.trim();
  const resultDiv = document.getElementById("result");

  if (!confirmationResult) {
    resultDiv.innerText = "⚠️ Please send OTP first.";
    return;
  }

  confirmationResult.confirm(otp)
    .then((result) => {
      resultDiv.innerText = "🎉 Login successful!";
      console.log("User Info:", result.user);

      loginOpenDialogOne.close();
      loginTwoOpenDialog.close();
    })
    .catch((error) => {
      resultDiv.innerText = "❌ Invalid OTP";
      console.error("OTP Verification Error:", error);
    });
}



// -------------------------------
// 📦 Global Cart Array
// -------------------------------
let cart = [];

const sectionImages = {
  "product-list": "assets/section/pan.webp",
  "cafe": "assets/section/cafe.webp",
  "home": "assets/section/home.webp",
  "toys": "assets/section/toys.webp",
  "fresh": "assets/section/fresh.png",
  "electronics": "assets/section/electronics.webp",
  "mobiles": "assets/section/mobiles.webp",
  "beauty": "assets/section/beauty.webp",
  "fashions": "assets/section/fashion.webp"
};
function renderProducts(products, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";

  // Add image ABOVE the grid
  const imgSrc = sectionImages[containerId];
  if (imgSrc) {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = "Section Image";
    img.className = "section-image";
    container.appendChild(img);
  }

  // Create grid wrapper
  const gridWrapper = document.createElement("div");
  gridWrapper.className = "products-grid";

  products.forEach((product) => {
    const card = document.createElement("div");
    card.className = "product-card";

    const price = Math.floor(Math.random() * 300) + 100;

    card.setAttribute("data-price", price);
    card.innerHTML = `
      <img src="${product.thumbnail}" alt="${product.name}" />
      <button class="add-cart-btn">ADD</button>
      <p id="price"><strong>₹${price}</strong></p>
      <p id="servings">Servings: ${product.stock}</p>
      <h3>${product.title}</h3>
    `;
    gridWrapper.appendChild(card);
  });

  // Append the grid after the image
  container.appendChild(gridWrapper);
}


// -------------------------------
// 🌐 Fetch Functions for 10 Categories
// -------------------------------
function fetchAllProducts() {
  fetch("https://dummyjson.com/products?limit=48")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "product-list"));
}

function fetchCafeProducts() {
  fetch("https://dummyjson.com/products/category/groceries")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "cafe"));
}
function fetchHomeDecor() {
  fetch("https://dummyjson.com/products/category/home-decoration")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "home"));
}

function fetchToys() {
  fetch("https://dummyjson.com/products/category/furniture")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "toys"))
    .catch(error => console.error("Error fetching furniture (toys):", error));
}

function fetchFreshItems() {
  fetch("https://dummyjson.com/products/category/groceries") // or another fresh-related category
    .then(res => res.json())
    .then(data => renderProducts(data.products, "fresh"));
}

function fetchElectronics() {
  fetch("https://dummyjson.com/products/category/laptops")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "electronics"));
}

function fetchMobiles() {
  fetch("https://dummyjson.com/products/category/smartphones")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "mobiles"));
}

function fetchBeauty() {
  fetch("https://dummyjson.com/products/category/fragrances")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "beauty"))
    .catch(error => console.error("Error fetching beauty products:", error));
}


function fetchFashions() {
  fetch("https://dummyjson.com/products/category/tops")
    .then(res => res.json())
    .then(data => renderProducts(data.products, "fashions"));
}


// -------------------------------
// 🛒 Cart Count Update
// -------------------------------
function updateCartCount() {
  document.getElementById("cart-count").textContent = cart.length;
}

// -------------------------------
// 🧾 Render Cart Panel
// -------------------------------
function renderCart() {
  const cartItems = document.getElementById("cart-items");
  const cartTotal = document.getElementById("cart-total");
  cartItems.innerHTML = "";

  let total = 0;

  cart.forEach((item) => {
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
      <img id="cart-item-img"src="${item.img}" />
      <div class="item-details">
        <h4>${item.name}</h4>
        <p>Qty: ${item.qty}</p>
        <p>₹${item.price}</p>
      </div>
    `;
    cartItems.appendChild(itemDiv);

    total += item.qty * parseInt(item.price);
  });

  cartTotal.textContent = `${total}`;
}

// -------------------------------
// ⚡ Event Listener for Clicks
// -------------------------------
document.addEventListener("click", (e) => {
  // Add to cart
  if (e.target.classList.contains("add-cart-btn")) {
    const card = e.target.closest(".product-card");
    const name = card.querySelector("h3").textContent;
    const img = card.querySelector("img").src;
    const price = card.getAttribute("data-price");
    const btn = e.target;

    const existingItem = cart.find((item) => item.name === name);

    if (existingItem) {
      existingItem.qty += 1;
      const qtySpan = card.querySelector(".qty-count");
      if (qtySpan) qtySpan.textContent = existingItem.qty;
    } else {
      cart.push({ name, img, price, qty: 1 });
      btn.outerHTML = `
        <div class="qty-controls">
          <button class="decrease">−</button>
          <span class="qty-count">1</span>
          <button class="increase">+</button>
        </div>
      `;
    }

    updateCartCount();
  }

  // Open cart panel
  if (e.target.closest(".cart-container")) {
    renderCart();
    document.getElementById("cart-panel").style.display = "block";
  }else{
    document.getElementById("cart-close-btn").addEventListener("click", () => {
  document.getElementById("cart-panel").style.display = "none";
});

  }
});

// -------------------------------
// 📌 Category Buttons (Suggestions)
// -------------------------------
document.querySelectorAll(".sug-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const category = btn.querySelector("span").textContent.trim();

   const sections = [
  "product-list",  // All
  "cafe",
  "home",
  "toys",
  "fresh",
  "electronics",
  "mobiles",
  "beauty",
  "fashions"
];

    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
switch (category) {
  case "All":
    fetchAllProducts();
    document.getElementById("product-list").style.display = "grid";
    break;
  case "Cafe":
    fetchCafeProducts();
    document.getElementById("cafe").style.display = "grid";
    break;
  case "Home":
    fetchHomeDecor(); // ✅ you can rename this to `fetchHome()` if you prefer
    document.getElementById("home").style.display = "grid";
    break;
  case "Toys":
    fetchToys();
    document.getElementById("toys").style.display = "grid";
    break;
  case "Fresh":
    fetchFreshItems();
    document.getElementById("fresh").style.display = "grid";
    break;
  case "Electronics":
    fetchElectronics();
    document.getElementById("electronics").style.display = "grid";
    break;
  case "Mobiles":
    fetchMobiles();
    document.getElementById("mobiles").style.display = "grid";
    break;
  case "Beauty":
    fetchBeauty();
    document.getElementById("beauty").style.display = "grid";
    break;
  case "Fashions":
    fetchFashions();
    document.getElementById("fashions").style.display = "grid";
    break;
}


    // Highlight active
    document.querySelectorAll(".sug-btn").forEach((b) =>
      b.classList.remove("active-suggestion")
    );
    btn.classList.add("active-suggestion");
  });
});

// -------------------------------
// 🚀 Initial Load
// -------------------------------
window.onload = fetchAllProducts;





//faqs

const faq=[
  {
    "id": 1,
    "title": "Coupons & Offers",
    "description": "Help regarding available coupons, discounts, and promo codes.",
    "faqs": [
      {
        "question": "Coupon not working / expired coupon",
        "answer": "Every coupon comes with a validity and if the validity is over you cannot use the coupon. But there are more coupons coming your way through our various promotions! Keep checking the 'View coupons & offers' tab on the cart page for more offers."
      },
      {
        "question": "I forgot to apply my coupon code. What do I do now?",
        "answer": "An order once placed, cannot be edited. You can always use the coupon for your next order with us."
      },
      {
        "question": "How do I refer my friend?",
        "answer": "Once your friend makes their initial purchase using your referral code, you will unlock a sensational 25% discount, reaching a maximum of ₹200 on your subsequent order and your friend will get INR 50/- off on their first order. But here's where the excitement reaches new heights – with an impressive 5 successful referrals, you stand to earn an incredible ₹1000. You can track your referrals via the 'Manage Referrals Section'."
      }
    ]
  },
  {
    "id": 2,
    "title": "General Inquiry",
    "description": "General questions about services, timings, availability, etc.",
    "faqs": [
      {
        "question": "How do I delete my account?",
        "answer": "You will need to contact our customer support through the 'Chat With Us' option or email to delete your account."
      },
      { "question": "What is Zepto Daily?", 
        "answer": "Zepto Daily is a membership program that gives you access to certain benefits such as free delivery on orders above the order value Rs. 99 and discounts on select products." 
      },
      { "question": "How do I log in to the Zepto app?", 
        "answer": "Once the app is installed, you could log in by entering your mobile number and validating it with an OTP. " 
      },
      { "question": "Zepto doesn't sell my favourite brand. How can I tell you about it?", 
        "answer": "We would love to hear what you think is missing on Zepto. We are always open to new products to expand our selection. Just click on 'Suggest Products Option' on our app." 
      },
      { "question": "Tell me a little about Zepto", 
        "answer": "Zepto is a fast-growing startup that delivers groceries in 10 minutes through an optimized network of dark stores! We now deliver in more than 10 cities.   " 
      },
      { "question": "Do you charge any amount or taxes over and above the price of each item?", 
        "answer": "All our products prices are inclusive of taxes. We charge a nominal fee for rendering the services of packing & delivering your products. If applicable, the delivery fee and small-cart fee will be specified on the checkout page." 
      },
      { "question": "Do you deliver all beverages cold?", 
        "answer": "We try to deliver all cold beverages chilled. However, given that there is a delivery time involved, there can be times when the beverages aren't as chilled." 
      },
      { "question": "How do you pack your veg and non-veg items?", 
        "answer": "All veg & non-veg items are stored & packed separately. " 
      },
      { "question": "How do I order anything from the paan corner?", 
        "answer": "In tandem with the laws in the country, for paan accessories or cigarettes, you have to place an order on www.zeptonow.com/paan ." 
      },
      { "question": "Do you follow discreet packaging for sexual wellness product?", 
        "answer": "Currently, we don't follow the option of discreet packaging for any of our products. But we are working on it." 
      },
      { "question": "What is the minimum order value?", 
        "answer": "You can place an order for any amount on Zepto. There is no minimum order value or MOV. However, a small cart fee may be levied in case the cart value is below a certain threshold." 
      },
      { "question": "Want to work with us?", 
        "answer": "Thank you for your interest in working with Zepto. Kindly share your updated resume with us at careers@zeptonow.com and someone from our Human Resources team will connect with you if you fulfill our required criteria. We wish you all the best with your application!. " 
      },
      { "question": "What is the maximum COD limit?", 
        "answer": "Yes, we do have a maximum limit of Rs.700 on COD orders." 
      },
      { "question": "Why is my ETA more than 10 minutes?", 
        "answer": "While our effort is always to deliver your order within 10 minutes, if there is a surge in demand or a traffic-related issue, it can sometimes take a bit longer for your order to be delivered. The estimated delivery time is always indicated in the app before you place your order. " 
      },
      { "question": "Can I pay the rider by UPI?", 
        "answer": "We are working on this option. As of now, we don't have this capability.  " 
      },
      { "question": "How do I return the Zepto bags?", 
        "answer": "You can always return your Zepto bags to our Zepto rider. We will recycle it for you!" 
      },
      { "question": "Why does Zepto not deliver in my area?", 
        "answer": "We strive hard to ensure Zepto is serviceable in as many areas as possible. You could head to the Delivery Areas page on our website to know more details about the areas we are currently serviceable in. " 
      },
      { "question": "Can I make a product request which is not available on Zepto?", 
        "answer": "Yes, we love when you let us know what you want from Zepto! You can suggest products to us by clicking on the menu at the top right side of the App." 
      },
      { "question": "Why are you not taking orders?", 
        "answer": "Due to higher order volumes, we are currently not accepting orders. You could check in after some time! Thank you for your patience!" 
      },
      { "question": "Can I partner/sell with Zepto?", 
        "answer": "You could e-mail us at below mentioned email ID and we could take this further from there" 
      },
      { "question": "Location serviceability / Non serviceable area", 
        "answer": "We strive hard to ensure Zepto is serviceable in as many areas as possible. You could head to the Delivery Areas page on our website to know more details about the areas we are currently serviceable in." 
      },
      { "question": "What are your timings?", 
        "answer": "Our support team is here to help you from 6am to 3am." 
      }
    ]
  },
 {
  "id": 3,
  "title": "Payment Related",
  "description": "Everything about payment methods, charges, and limits.",
  "faqs": [
    {
      "question": "What are the modes of payment?",
      "answer": "The following modes of payment are available on our app: a. Cash on Delivery (COD), after the first order is placed via Online Payment. b. Visa, Mastercard, and Rupay-credit and debit cards. c. CRED Pay d. Wallets (Freecharge, Mobikwik, PayZapp) e. Pay Later (SIMPL, LazyPay). If the order must be left at the security gate, please continue to pay online using wallets, UPI, net banking, or credit/debit cards."
    },
    {
      "question": "How do I change the mode of payment?",
      "answer": "Since the orders are already out for delivery shortly, it's not possible to change the payment method at this time."
    },
    {
      "question": "Is It safe to use my debit/credit card to shop on Zepto?",
      "answer": "Yes, it is. All transactions on Zepto are completed via secure payment gateways that are PCI DSS compliant. We do not store your card details at any point."
    },
    {
      "question": "How can I delete my saved card details?",
      "answer": "You can contact us through email mentioned below to delete your card details."
    },
    {
      "question": "Do you accept Sodexo, ticket restaurants etc.?",
      "answer": "We are working on it and will be available soon. In the meanwhile, you can choose from the array of options available."
    },
    {
      "question": "Why is my COD blocked?",
      "answer": "When orders are placed and cancelled, post packing or delivering, the COD gets disabled. Please place an order using the 'Online Payment' option. As soon as your order is marked as 'Delivered', the system will automatically enable COD on your account."
    },
    {
      "question": "What is the limit to place a COD order?",
      "answer": "You can place a COD order with a value of upto Rs 700."
    },
    {
      "question": "What are the small cart fees?",
      "answer": "It is a nominal charge for rendering the services of picking and packing the products for you. If your order value is more than a certain amount, this value is waived. The minimum amount benchmark and subsequent small-cart fees will be specified on the checkout page."
    },
    {
      "question": "Is there a delivery fee for each order?",
      "answer": "The delivery fee is levied based on the location at which the order is being delivered, as each store has its unique delivery fee structure. If applicable, the delivery fee will be specified on the checkout page."
    },
    {
      "question": "Why is there a surge fee ?",
      "answer": "A surge fee is applied during instances of very high demand in certain areas, it encourages more delivery partners to be on the ground ensuring smooth operations. That said, the surge fee is applicable only for a brief period. You can click on the 'Notify Me' button on the app to know once the surge fee is removed."
    },
    {
      "question": "Do you charge for the Bag ?",
      "answer": "As a policy, Zepto does not charge for the bag. There is a packaging fee that is applicable to the consumer which is essentially rendered towards the efforts of the picker who picks the products for you at our warehouse."
    }
  ]
},
 {
  "id": 4,
  "title": "Feedback & Suggestions",
  "description": "Share your thoughts or issues related to feedback, packaging, and safety.",
  "faqs": [
    {
      "question": "Tell me a little about your rider safety initiative.",
      "answer": "We take rider safety very seriously. Our riders are equipped with safety gear and trained to follow all traffic and safety protocols. We continuously work on ensuring their well-being through awareness sessions and in-app safety alerts."
    },
    {
      "question": "Rider feedback in general",
      "answer": "We welcome any feedback about our riders. Please use the in-app support or 'Chat With Us' feature to share your comments—positive or negative."
    },
    {
      "question": "Any feedback / review",
      "answer": "Your feedback helps us improve! Use the support section or rating options in the app to let us know how we're doing."
    },
    {
      "question": "Out of stock",
      "answer": "If an item is out of stock, it usually returns soon. You can tap on the 'Notify Me' option for updates or check back shortly."
    },
    {
      "question": "Packaging feedback",
      "answer": "We strive to deliver products in the best condition. If you have suggestions or concerns about our packaging, please share it with us through the support option in the app."
    }
  ]
},
 {
  "id": 5,
  "title": "Order / Products Related",
  "description": "Everything about your order, delivery, and product requests.",
  "faqs": [
    {
      "question": "Can I change the delivery address of my order?",
      "answer": "Unfortunately, once an order is placed, the delivery address cannot be changed for operational and safety reasons."
    },
    {
      "question": "Can I reschedule my order?",
      "answer": "We currently do not support rescheduling orders as they are processed immediately to ensure fast delivery."
    },
    {
      "question": "Can I edit my cart / add items ?",
      "answer": "Once an order is placed, items cannot be added or removed. You can place a new order for additional items."
    },
    {
      "question": "Want the invoice/ pricing break-up ?",
      "answer": "You can view and download the detailed invoice from the order history section in the app."
    },
    {
      "question": "Do you take delivery instructions?",
      "answer": "Yes, you can add delivery instructions during checkout or use the 'Chat With Us' option for special requests."
    },
    {
      "question": "Is there a minimum order value?",
      "answer": "Yes, the minimum order value may vary by location and will be visible at checkout."
    }
  ]
},
 {
  "id": 6,
  "title": "Gift Card",
  "description": "Everything you need to know about gift cards and how to use them.",
  "faqs": [
    {
      "question": "What is ‘Add Gift card’ on Zepto Cash?",
      "answer": "The ‘Add Gift card’ option allows you to redeem a gift card code and load the amount into your Zepto Cash wallet."
    },
    {
      "question": "How do I add my Gift Card?",
      "answer": "Go to the Zepto Cash section in the app, tap on ‘Add Gift card’, and enter your 16-digit gift card code to redeem."
    },
    {
      "question": "Where can I buy a Gift Card?",
      "answer": "You can purchase Zepto Gift Cards from select online platforms and third-party gift card vendors."
    },
    {
      "question": "Are there any fees associated with redeeming Gift Cards?",
      "answer": "No, Zepto does not charge any additional fee for redeeming gift cards."
    },
    {
      "question": "What should I do if my Gift Card is not working?",
      "answer": "Please contact our customer support with your gift card details for assistance if you're unable to redeem it."
    },
    {
      "question": "Can I use multiple Gift Cards for a single purchase?",
      "answer": "Yes, you can combine multiple gift cards by adding them to your Zepto Cash wallet and using the total balance at checkout."
    },
    {
      "question": "Is there an expiry date for the Gift Card?",
      "answer": "Yes, each gift card comes with a validity period which is mentioned in the email or receipt at the time of purchase."
    },
    {
      "question": "How will I receive the Gift Card that I purchased?",
      "answer": "The gift card will be delivered digitally via email or SMS to the recipient you specified at checkout."
    }
  ]
},
 {
  "id": 7,
  "title": "No-Cost EMI",
  "description": "Information related to EMI and No-Cost EMI options.",
  "faqs": [
    {
      "question": "What is EMI?",
      "answer": "EMI (Equated Monthly Installment) allows you to pay for your purchase in smaller, fixed payments over a specified period."
    },
    {
      "question": "What is No-Cost EMI?",
      "answer": "No-Cost EMI means you do not pay any interest on the EMI amount. The product cost is divided equally over the repayment tenure with no additional charges."
    },
    {
      "question": "How do I know if a product has a No-Cost EMI offer?",
      "answer": "If a product is eligible for No-Cost EMI, you will see the option listed on the product page or at checkout."
    },
    {
      "question": "Will I be charged any processing fees?",
      "answer": "No, there are no processing or hidden fees with No-Cost EMI on eligible products."
    },
    {
      "question": "What happens if I cancel or return a product purchased with No-Cost EMI?",
      "answer": "If you cancel or return the product, the EMI will be canceled, and the amount will be refunded as per the bank’s policies."
    },
    {
      "question": "What are some other Terms and Conditions I should be aware of?",
      "answer": "No-Cost EMI is available only with select banks and payment partners. Minimum order value and tenure may vary depending on the partner."
    }
  ]
},
 {
  "id": 8,
  "title": "Wallet Related",
  "description": "Queries regarding Zepto Cash and wallet issues.",
  "faqs": [
    {
      "question": "I am not able to add money to my Wallet",
      "answer": "Please check if your payment method is valid and has sufficient balance. If the issue persists, contact our support team for assistance."
    },
    {
      "question": "I am not able to see the money refunded to my Wallet. What should I do?",
      "answer": "Refunds to Zepto Wallet usually reflect within a few minutes. If not, wait for up to 24 hours and then contact support with your order ID."
    },
    {
      "question": "I am not able to see the money I added to my Wallet. What should I do?",
      "answer": "If your wallet top-up was successful but not reflecting, please check your transaction history and reach out to support with the payment reference ID."
    },
    {
      "question": "What is Zepto Cash?",
      "answer": "Zepto Cash is a wallet feature that allows you to store money and use it for faster, seamless checkouts on the Zepto app."
    },
    {
      "question": "I am unable to use my wallet",
      "answer": "Ensure that your wallet balance is sufficient and not restricted by any promo conditions. Contact support if the issue remains."
    }
  ]
},
 {
  "id": 9,
  "title": "Zepto Super Saver",
  "description": "Information about Zepto's premium subscription service and its benefits.",
  "faqs": [
    {
      "question": "Issues with free monthly Super Saver gift",
      "answer": "Please note that the monthly gift is applicable only once per calendar month. If you're facing issues, reach out to our support team for resolution."
    },
    {
      "question": "What is Zepto Super Saver?",
      "answer": "Zepto Super Saver is a subscription plan that offers benefits like free delivery, exclusive offers, and monthly gifts for a small monthly fee."
    },
    {
      "question": "Is there a minimum order for free delivery with Zepto Super Saver?",
      "answer": "Yes, free delivery applies on orders above ₹199 under the Super Saver plan."
    },
    {
      "question": "What charges are covered under free delivery?",
      "answer": "The free delivery benefit covers the standard delivery charge but excludes surge fees, small cart fees, or packaging charges."
    },
    {
      "question": "On which platforms can I use Zepto Super Saver?",
      "answer": "Zepto Super Saver is available on the latest versions of our Android and iOS apps."
    },
    {
      "question": "Is Zepto Super Saver available in all cities?",
      "answer": "Currently, Zepto Super Saver is available in selected cities. You will see the option if it's available in your area."
    },
    {
      "question": "Which products get additional offers with Zepto Super Saver?",
      "answer": "Selected products will have exclusive Super Saver tags/offers visible on them when browsing the app."
    },
    {
      "question": "Does Zepto Super Saver offer stack with other coupons?",
      "answer": "Yes, Super Saver benefits stack with other ongoing coupon-based promotions unless specified otherwise."
    },
    {
      "question": "Is the Paper bag removal option applicable to Zepto Super Saver orders?",
      "answer": "Yes, if your area has the paper bag removal toggle, it will be applicable even on Super Saver orders."
    },
    {
      "question": "How do I enroll in Zepto Super Saver?",
      "answer": "You can subscribe through the Zepto app’s Super Saver section by paying the monthly or yearly subscription fee."
    },
    {
      "question": "Is there a minimum order value for placing orders on Zepto Super Saver?",
      "answer": "Yes, Super Saver orders must meet the standard minimum cart value, which will be shown at checkout."
    }
  ]
},
  {
  "id": 10,
  "title": "Zepto Daily",
  "description": "Details about Zepto Daily membership, benefits, and transition from Zepto Pass.",
  "faqs": [
    {
      "question": "What is Zepto Daily?",
      "answer": "Zepto Daily is our upgraded membership program that offers daily essentials at special prices, free deliveries, and more exclusive benefits."
    },
    {
      "question": "Can I still purchase a new Zepto Pass?",
      "answer": "No, Zepto Pass has been discontinued. All users have been upgraded to Zepto Daily for a better experience."
    },
    {
      "question": "Is Zepto Daily available to all users?",
      "answer": "Zepto Daily is being rolled out gradually and will be available to all users across eligible locations."
    },
    {
      "question": "How do I sign up for Zepto Daily?",
      "answer": "You can subscribe to Zepto Daily through the Zepto app by navigating to the Daily tab and selecting the membership plan."
    },
    {
      "question": "I am a Zepto Pass user and have been converted to Zepto Daily user. Does that impact the benefits of my Zepto Pass Membership in any way?",
      "answer": "Your existing benefits will remain intact during the transition and will be enhanced with Zepto Daily features."
    },
    {
      "question": "How long does my Zepto Daily membership last?",
      "answer": "The Zepto Daily membership duration depends on the plan you chose—either monthly or quarterly—and will be visible under your account settings."
    },
    {
      "question": "What happens when my Zepto Daily membership expires?",
      "answer": "Once your membership expires, you will lose access to member-exclusive discounts and free deliveries unless you renew your plan."
    },
    {
      "question": "What products will I get the special prices on?",
      "answer": "Daily essentials and frequently bought grocery items will have member-only prices visible under the Zepto Daily tag in the app."
    },
    {
      "question": "How many free deliveries do I get?",
      "answer": "You can enjoy unlimited free deliveries during your active Zepto Daily subscription, subject to minimum cart value."
    }
  ]
}
]







const chatBox = document.getElementById("chat-box");

// 💬 Helper: create message bubble
function addMessage(content, type = "bot") {
  const msg = document.createElement("div");
  msg.className = type === "bot" ? "bot-msg" : "user-msg";
  msg.innerText = content;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 💬 Helper: create clickable buttons
function addOptions(options, onClick) {
  options.forEach((text, index) => {
    const btn = document.createElement("button");
    btn.className = "option-button";
    btn.textContent = text;
    btn.onclick = () => onClick(index, text);
    chatBox.appendChild(btn);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 💬 Start: show all category titles
function showCategories() {
  addMessage("Please select a category:");
  const titles = faq.map(cat => cat.title);
  addOptions(titles, (index, title) => {
    addMessage(title, "user");
    showQuestions(index);
  });
}

// 💬 Show questions of a selected category
function showQuestions(categoryIndex) {
  const questions = faq[categoryIndex].faqs.map(q => q.question);
  addMessage("Select a question from " + faq[categoryIndex].title + ":");
  addOptions(questions, (qIndex, question) => {
    addMessage(question, "user");
    const answer = faq[categoryIndex].faqs[qIndex].answer;
    addMessage(answer, "bot");

    // Optionally: Ask if they want to go back or continue
    setTimeout(() => {
      addOptions(["🔙 Back to Categories", "📖 More Questions"], (choice) => {
        if (choice === 0) {
          addMessage("Back to Categories", "user");
          showCategories();
        } else {
          addMessage("Show more questions", "user");
          showQuestions(categoryIndex);
        }
      });
    }, 1000);
  });
}

// 🚀 Start the chatbot
showCategories();



const botToggleBtn = document.getElementById("bot-toggle-btn");
const chatWindow = document.getElementById("chat-box");

botToggleBtn.addEventListener("click", () => {
  chatWindow.style.display = chatWindow.style.display === "none" ? "flex" : "none";
});




