import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  ArrowLeft, ArrowRight, ArrowUpDown, Box, Check, CheckCircle2, ChevronDown,
  ChevronRight, ChevronUp, CircleHelp, Clock3, Headset, Info, Menu, MessageCircle,
  Package, PhoneCall, Smartphone, X, CircleX, CircleCheck, History, Search, ShieldCheck
} from "lucide-react";
import "./styles.css";

const BLUE = "#0800a8";
const WHATSAPP_URL = "https://wa.me/233000000000"; // Replace with your support/channel link.
const CHANNEL_URL = "https://whatsapp.com/channel/"; // Replace with your WhatsApp Channel URL.

const products = [
  { id: "mtnup2u", name: "MTNUP2U", desc: "Non-expiry data | This package is not instant.", network: "MTN", kind: "MTNUP2U" },
  { id: "instant", name: "MTN INSTANT", desc: "Non-expiry data | This package is instant.", network: "MTN", kind: "MTN INSTANT" },
  { id: "airtime", name: "MTN AIRTIME", desc: "Cheap MTN airtime.", network: "MTN", kind: "MTN AIRTIME" },
  { id: "airteltigo", name: "Airteltigo", desc: "", network: "AT", kind: "Airteltigo" },
  { id: "telecel", name: "Telecel", desc: "", network: "T", kind: "Telecel" }
];
const bundles = [
  { gb: 1, price: 5 }, { gb: 2, price: 10 }, { gb: 3, price: 14.5 }, { gb: 4, price: 19.5 },
  { gb: 5, price: 24.5 }, { gb: 6, price: 29.5 }, { gb: 7, price: 34.5 }, { gb: 8, price: 39.5 },
  { gb: 9, price: 44.5 }, { gb: 10, price: 49.5 }
];
const demoOrders = [
  { bundle: "5GB (MTNUP2U)", number: "0537446605", date: "Oct 19, 2026 7:05 AM", ref: "ED78563921", status: "Pending" },
  { bundle: "5GB (MTN INSTANT)", number: "0537446605", date: "Oct 18, 2026 7:06 AM", ref: "ED78563922", status: "Processing" },
  { bundle: "5GB (MTN INSTANT)", number: "0537446605", date: "Oct 17, 2026 7:07 AM", ref: "ED78563923", status: "Delivered" },
  { bundle: "5GB (MTNUP2U)", number: "0537446605", date: "Oct 16, 2026 7:08 AM", ref: "ED78563924", status: "Failed" },
  { bundle: "5GB (MTNUP2U)", number: "0537446605", date: "Oct 15, 2026 7:09 AM", ref: "ED78563925", status: "Delivered" },
  { bundle: "MTN INSTANT", number: "0537446605", date: "Oct 14, 2026 7:10 AM", ref: "ED78563926", status: "Delivered" }
];
const faqs = [
  { q: "How long does it take to receive my data?", a: "Data delivery typically takes 10–30 minutes after successful payment. In rare cases, it may take up to 1 hour." },
  { q: "How do I check my order status?", a: "Enter the phone number used when purchasing your data on the Check Order Status page." },
  { q: "What happens if my data is delayed?", a: "Please allow up to 1 hour for delivery, then contact support with your order reference if it has not arrived." },
  { q: "Can I reverse a completed data purchase?", a: "Data purchases cannot be reversed once delivered. Please double-check the recipient number before confirming." },
  { q: "Which payment methods are supported?", a: "You can pay through the supported mobile money providers shown in the payment checkout." }
];

function Brand({ centered = false }) {
  return <div className={`brand ${centered ? "centered" : ""}`}>easydata<span>.</span></div>;
}
function PrimaryButton({ children, onClick, className = "", disabled = false }) {
  return <button className={`primary-btn ${className}`} onClick={onClick} disabled={disabled}>{children}</button>;
}
function StatusPill({ status }) {
  const icons = { Pending: <Clock3 size={14}/>, Processing: <Clock3 size={14}/>, Delivered: <CircleCheck size={14}/>, Failed: <CircleX size={14}/> };
  return <span className={`status-pill ${status.toLowerCase()}`}>{icons[status]}{status}</span>;
}
function NetworkLogo({ product }) {
  if (product?.network === "MTN") return <div className="network-logo mtn"><span>MTN</span></div>;
  if (product?.network === "AT") return <div className="network-logo at">at<small>it's simple</small></div>;
  return <div className="network-logo telecel">t</div>;
}
function BottomNav({ page, go }) {
  const items = [
    { label: "Buy Data", page: "choose", icon: <ArrowUpDown/> },
    { label: "Order Status", page: "status", icon: <Package/> },
    { label: "Whatsapp Channel", external: CHANNEL_URL, icon: <MessageCircle/> },
    { label: page === "faq" ? "Support" : "FAQs", page: "faq", icon: page === "faq" ? <Headset/> : <CircleHelp/> }
  ];
  return <nav className="bottom-nav">{items.map((item) => <button key={item.label} className={`nav-item ${item.page === page || (page === "home" && item.page === "choose") ? "active" : ""}`} onClick={() => item.external ? window.open(item.external, "_blank", "noopener,noreferrer") : go(item.page)}><span className="nav-icon">{item.icon}</span><span>{item.label}</span></button>)}</nav>;
}
function Header({ go, statusButton = true, brand = false }) {
  return <header className="app-header">
    <button className="back-btn" aria-label="Go back" onClick={() => go("back")}><ArrowLeft size={28}/></button>
    {brand && <Brand centered/>}
    {statusButton && <button className="small-blue-btn" onClick={() => go("status")}>Check order status</button>}
  </header>;
}
function OrderCard({ order, compact = false }) {
  return <div className={`order-card ${compact ? "compact" : ""}`}>
    <div className="order-meta"><strong>{order.bundle}</strong><span>{order.number}</span><small>{order.date} | REF: {order.ref}</small></div>
    <StatusPill status={order.status}/>
  </div>;
}

function App() {
  const [page, setPage] = useState("home");
  const [history, setHistory] = useState(["home"]);
  const [product, setProduct] = useState(products[0]);
  const [bundle, setBundle] = useState(bundles[0]);
  const [number, setNumber] = useState("0537446605");
  const [statusNumber, setStatusNumber] = useState("0537446605");
  const [showRecentOrders, setShowRecentOrders] = useState(false);
  const [scrollHintVisible, setScrollHintVisible] = useState(true);
  const [filter, setFilter] = useState("All");
  const [openFaq, setOpenFaq] = useState(0);
  const [orders, setOrders] = useState(demoOrders);
  const [toast, setToast] = useState("");

  const navigate = (next) => {
    if (next === "back") {
      if (history.length > 1) {
        const newHistory = [...history]; newHistory.pop();
        setHistory(newHistory); setPage(newHistory[newHistory.length - 1]);
      } else setPage("home");
      return;
    }
    setHistory(h => [...h, next]); setPage(next);
  };
  const goHome = () => { setPage("home"); setHistory(["home"]); };
  const price = bundle.price.toLocaleString("en-GH", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
  const filteredOrders = useMemo(() => filter === "All" ? orders : orders.filter(o => o.status === filter), [filter, orders]);
  useEffect(() => {
    const updateScrollHint = () => setScrollHintVisible(window.scrollY < 5);
    window.addEventListener("scroll", updateScrollHint, { passive: true });
    updateScrollHint();
    return () => window.removeEventListener("scroll", updateScrollHint);
  }, []);
  const checkStatus = () => {
    if (!/^[0-9]{9,15}$/.test(statusNumber.replace(/\s/g, ""))) { setToast("Enter a valid phone number."); return; }
    setNumber(statusNumber); setShowRecentOrders(true);
  };
  const startPayment = () => {
    if (!/^[0-9]{9,15}$/.test(number.replace(/\s/g, ""))) { setToast("Enter a valid recipient number."); return; }
    navigate("confirm");
  };
  const confirmPayment = () => {
    const order = { bundle: `${bundle.gb}GB (${product.kind})`, number, date: "Oct 21, 2026 9:22 AM", ref: "ED" + Math.floor(10000000 + Math.random() * 89999999), status: "Pending" };
    setOrders(prev => [order, ...prev]);
    navigate("payment");
  };
  const completeDemoPayment = () => {
    setOrders(prev => prev.map((o, i) => i === 0 ? { ...o, status: "Processing" } : o));
    navigate("success");
  };
  const openWhatsApp = () => window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
  const showToast = (msg) => { setToast(msg); window.setTimeout(() => setToast(""), 2600); };

  return <div className={`app-shell page-${page}`}>
    {page === "home" && <>
      <header className="home-header"><Brand/><button className="small-blue-btn" onClick={() => navigate("status")}>Check order status</button></header>
      <main className="home-content">
        <div className="hero"><h1>Cheap Data.<br/><span>Cheap Airtime</span></h1><p>All your favorite networks in one place. Choose a bundle, enter the recipient number, and <b>pay securely.</b></p></div>
        <button className="home-cta" onClick={() => navigate("choose")}><ArrowUpDown size={28}/><span><strong>Buy Data Now</strong><small>Fast, secure, and instant.</small></span><ArrowRight className="cta-arrow"/></button>
        <button className="channel-cta" onClick={() => window.open(CHANNEL_URL, "_blank", "noopener,noreferrer")}><MessageCircle size={36}/><span><strong>Follow Our Whatsapp Channel</strong><small>Get updates, announcements, and more.</small></span><ArrowRight/></button>
        <div className="home-nav-wrap"><BottomNav page={page} go={navigate}/></div>
      </main>
      <div className="help-footer"><Headset size={15}/> Need help? <button onClick={openWhatsApp}>Contact support.</button></div>
      <button className="floating-wa" aria-label="WhatsApp support" onClick={openWhatsApp}><MessageCircle size={34}/></button>
    </>}

    {page === "choose" && <>
      <Header go={navigate}/><main className="screen-content">
        <div className="step-label">Buy Data <span>.</span></div><div className="steps"><i/><i/><i className="muted"/><small>1 of 3</small></div>
        <h1>Choose Product</h1><p className="subtitle">Select the product you want to buy.</p>
        <div className="product-list">{products.map(p => <button key={p.id} className={`product-card ${product.id === p.id ? "selected" : ""}`} onClick={() => { setProduct(p); navigate("recipient"); }}><NetworkLogo product={p}/><span className="product-text"><strong>{p.name}</strong>{p.desc && <small>{p.desc}</small>}</span></button>)}</div>
      </main>
    </>}

    {page === "recipient" && <>
      <Header go={navigate}/><main className="screen-content">
        <div className="step-label">Buy Data <span>.</span></div><div className="steps"><i/><i/><i className="muted"/><small>2 of 3</small></div>
        <h1>Enter Recipient Number</h1><p className="subtitle">Enter the phone number that will receive the data.</p>
        <div className="phone-input"><PhoneCall size={20}/><input aria-label="Recipient number" value={number} onChange={e => setNumber(e.target.value)} inputMode="tel"/><button aria-label="Clear number" onClick={() => setNumber("")}><X size={17}/></button></div>
        <div className="info-box"><Info size={28}/><span>Please make sure the number is correct.<br/>Data cannot be reversed once delivered.</span></div>
      </main><div className="bottom-action"><PrimaryButton onClick={() => navigate("bundle")}>Continue <ArrowRight/></PrimaryButton></div>
    </>}

    {page === "bundle" && <>
      <Header go={navigate}/><main className="screen-content">
        <div className="step-label">Buy Data <span>.</span></div><div className="steps"><i/><i/><i/><small>3 of 3</small></div>
        <h1>Select Data Bundle</h1><p className="subtitle">Choose a bundle for {number} ({product.kind})</p>
        <div className="bundle-list">{bundles.map(b => <div className="bundle-item-wrap" key={b.gb}>{b.gb === 6 && scrollHintVisible && <div className="scroll-hint" aria-hidden="true"><ChevronDown size={22} strokeWidth={3}/></div>}<button className={`bundle-option ${bundle.gb === b.gb ? "selected" : ""}`} onClick={() => setBundle(b)}><span className="radio-dot"/><span className="bundle-desc"><strong>{b.gb}GB</strong><small>Non-expiry bundle</small></span><strong className="bundle-price">GHS {b.price.toFixed(2).replace(/\.00$/, "")}</strong>{bundle.gb === b.gb && <span className="radio-selected"/>}</button></div>)}</div>
      </main><div className="bottom-action"><PrimaryButton onClick={startPayment}>Proceed to Payment <ArrowRight/></PrimaryButton></div>
    </>}

    {page === "confirm" && <>
      <Header go={navigate}/><main className="screen-content">
        <h1>Confirm Purchase</h1><p className="subtitle">Please review your purchase details carefully before proceeding.</p>
        <div className="details-table">
          <div><span>Network</span><strong className="network-value"><NetworkLogo product={product}/><span>{product.network === "MTN" ? "MTN" : product.name}<small>{product.kind}</small></span></strong></div>
          <div><span>Bundle</span><strong>{bundle.gb}GB</strong></div>
          <div><span>Amount</span><strong>GHS {price}</strong></div>
          <div><span>Recipient Number</span><strong>{number}</strong></div>
        </div>
        <div className="warning-box"><Info size={28}/><span>Please make sure the number is correct.<br/>Data cannot be reversed once delivered.</span></div>
      </main><div className="bottom-action"><PrimaryButton onClick={confirmPayment}>Confirm &amp; Pay <ArrowRight/></PrimaryButton></div>
    </>}

    {page === "payment" && <>
      <main className="paystack-screen">
        <div className="paystack-top"><Menu size={23}/><span>Pay <b>GHS {price}</b></span></div>
        <div className="paystack-content"><div className="paystack-mark">₵</div><h2>Enter your mobile money number and provider to start the payment</h2><input placeholder="050 000 0000" inputMode="tel" defaultValue={number}/><select defaultValue=""><option value="" disabled>Choose Provider</option><option>MTN Mobile Money</option><option>Telecel Cash</option><option>AT Money</option></select><button className="confirm-pay" onClick={completeDemoPayment}>Confirm</button><button className="cancel-pay" onClick={() => navigate("confirm")}>× Cancel Payment</button><div className="secured"><ShieldCheck size={15}/> Secured by <b>paystack</b></div></div>
      </main>
    </>}

    {page === "success" && <>
      <main className="screen-content success-content"><div className="success-icon"><Check size={44}/></div><h1>Purchase Successful!</h1><p className="subtitle center">Your data bundle is being delivered to {number}.<br/>You will receive a confirmation SMS shortly.</p>
        <div className="details-table success-table"><div><span>Network</span><strong className="network-value"><NetworkLogo product={product}/><span>{product.network === "MTN" ? "MTN" : product.name}<small>{product.kind}</small></span></strong></div><div><span>Bundle</span><strong>{bundle.gb}GB</strong></div><div><span>Amount</span><strong>GHS {price}</strong></div><div><span>Recipient Number</span><strong>{number}</strong></div><div><span>Reference Number</span><strong>{orders[0]?.ref || "ED78563921"}</strong></div></div>
      </main><div className="bottom-action stacked"><PrimaryButton onClick={goHome}>Back to Home</PrimaryButton><button className="secondary-btn" onClick={() => { setStatusNumber(number); navigate("history"); }}>Check Order Status</button></div>
    </>}

    {page === "status" && <>
      <Header go={navigate} statusButton={false} brand/><main className="screen-content status-content">
        <h1>Check Order <span>Status</span></h1><p className="subtitle">Enter the number you bought the data for to check the order status.</p>
        <div className="phone-input"><PhoneCall size={20}/><input aria-label="Phone number to check" value={statusNumber} onChange={e => setStatusNumber(e.target.value)} inputMode="tel"/><button aria-label="Clear number" onClick={() => setStatusNumber("")}><X size={17}/></button></div>
        <PrimaryButton onClick={checkStatus}>Check Status <ArrowRight/></PrimaryButton>
        {showRecentOrders && <>
          <div className="recent-head"><strong>Recent Orders</strong><button onClick={() => navigate("history")}>See All <ChevronRight size={18}/></button></div>
          <div className="orders-list">{orders.filter(o => o.number === statusNumber).slice(0, 4).map((o, i) => <OrderCard key={o.ref + i} order={o} compact/>)}</div>
          <button className="support-banner" onClick={openWhatsApp}><Headset/><span><strong>Need help with an order?</strong><small>Contact our support team.</small></span><ChevronRight/></button>
        </>}
      </main>
    </>}

    {page === "history" && <>
      <Header go={navigate} statusButton={false} brand/><main className="screen-content history-content">
        <h1>Order <span>History</span></h1><p className="subtitle">Order history for recipient number {number}.</p>
        <div className="filter-pills">{["All", "Pending", "Processing", "Delivered", "Failed"].map(f => <button key={f} className={filter === f ? "active" : ""} onClick={() => setFilter(f)}>{f}</button>)}</div>
        <div className="orders-list">{filteredOrders.filter(o => o.number === number || number === "").map((o, i) => <OrderCard key={o.ref + i} order={o}/>)}</div>
        {filteredOrders.length === 0 && <p className="empty-state">No orders found for this filter.</p>}
      </main><div className="bottom-action"><PrimaryButton onClick={goHome}>Back to Home</PrimaryButton></div>
    </>}

    {page === "faq" && <>
      <Header go={navigate}/><main className="screen-content faq-content">
        <h1>How Can We Help?</h1><p className="subtitle">Check order status or get in touch with our support team.</p>
        <button className="whatsapp-card" onClick={openWhatsApp}><MessageCircle size={42}/><span><strong>WhatsApp Us</strong><small>Quick Responses</small></span><ArrowRight/></button>
        <div className="faq-divider"/><h2><CircleHelp size={21} fill={BLUE} color={BLUE}/> Frequently Asked Questions</h2>
        <div className="faq-list">{faqs.map((f, i) => <div className={`faq-item ${openFaq === i ? "open" : ""}`} key={f.q}><button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}><strong>{f.q}</strong>{openFaq === i ? <ChevronUp/> : <ChevronDown/>}</button>{openFaq === i && <p>{f.a}</p>}</div>)}</div>
      </main><div className="faq-bottom"><BottomNav page={page} go={navigate}/><PrimaryButton onClick={goHome}>Back to Home</PrimaryButton></div>
    </>}

    {page === "limited" && <>
      <Header go={navigate} statusButton={false}/><main className="screen-content"><h1>Check Order Status</h1><p className="subtitle">Enter the number you bought the data for to check the order status.</p><div className="phone-input"><PhoneCall/><input value={statusNumber} onChange={e => setStatusNumber(e.target.value)}/><button onClick={() => setStatusNumber("")}><X/></button></div><PrimaryButton onClick={checkStatus}>Check Status <ArrowRight/></PrimaryButton><div className="recent-head"><strong>Recent Orders</strong><button onClick={() => navigate("history")}>See All <ChevronRight/></button></div><div className="orders-list">{orders.slice(0,4).map((o,i)=><OrderCard key={o.ref+i} order={o} compact/>)}</div></main><div className="bottom-action"><PrimaryButton onClick={goHome}>Back to Home</PrimaryButton></div>
    </>}

    {page === "faqAnswers" && <>
      <Header go={navigate}/><main className="screen-content faq-content"><h1>How Can We Help?</h1><p className="subtitle">Check order status or get in touch with our support team.</p><button className="whatsapp-card" onClick={openWhatsApp}><MessageCircle size={42}/><span><strong>WhatsApp Us</strong><small>Quick Responses</small></span><ArrowRight/></button><div className="faq-divider"/><h2><CircleHelp size={21} fill={BLUE} color={BLUE}/> Frequently Asked Questions</h2><div className="faq-list">{faqs.map((f,i)=><div className={`faq-item ${i===0 ? "open" : ""}`} key={f.q}><button onClick={() => setOpenFaq(openFaq===i ? -1 : i)}><strong>{f.q}</strong>{openFaq===i ? <ChevronUp/> : <ChevronDown/>}</button>{(i===0 || openFaq===i) && <p>{f.a}</p>}</div>)}</div></main><div className="faq-bottom"><BottomNav page="faq" go={navigate}/><PrimaryButton onClick={goHome}>Back to Home</PrimaryButton></div>
    </>}

    {toast && <div className="toast" role="status">{toast}</div>}
  </div>;
}

createRoot(document.getElementById("root")).render(<App/>);
