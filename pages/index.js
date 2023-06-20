import React from 'react';
import ChatBox from './components/chatbot';
import Footer from './components/footer';
import Header from './components/header';
import NavMenu from './components/navMenu';
import ExcerptBox from './components/excerptBox';


export default function Home() {
  return (
    <div className="container">
      <Header />
      <NavMenu />
      <div className="content-wrapper">
        <ChatBox />
        <ExcerptBox />
      </div>
      <Footer />
    </div>
  );
}
