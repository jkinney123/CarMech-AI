import React, { useState } from 'react';
import ChatBox from './components/chatbot';
import Footer from './components/footer';
import Header from './components/header';
import NavMenu from './components/navMenu';
import ExcerptBox from './components/excerptBox';


export default function Home() {
  const [isTyping, setIsTyping] = useState(false);

  return (
    <div className="container">
      <Header />
      <NavMenu />
      <div className="content-wrapper">
        <ChatBox isTyping={isTyping} setIsTyping={setIsTyping} />
        <ExcerptBox isTyping={isTyping} />
      </div>
      <Footer />
    </div>
  );
}
