// src/inner/Footer.tsx
import { Component } from 'react';

class Footer extends Component {
  render() {
    return (
      <footer className="bg-light text-center text-muted py-3 mt-5">
        <div className="container">
          <small>&copy; {new Date().getFullYear()} Vite + React + Bootstrap</small>
        </div>
      </footer>
    );
  }
}

export default Footer;
