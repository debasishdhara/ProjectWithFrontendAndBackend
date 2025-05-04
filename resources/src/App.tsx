import { Component } from 'react';
import reactLogo from './assets/react.svg';
import bootstrapLogo from './assets/bootstrap-logo.svg';
import viteLogo from '/vite.svg';
import './App.css';

interface AppState {
  count: number;
}

class App extends Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      count: 0,
    };
  }

  handleClick = () => {
    this.setState((prevState) => ({
      count: prevState.count + 1,
    }));
  };

  render() {
    return (
      <>
        <div className="container py-5 text-center">
          <div className="d-flex flex-column flex-md-row justify-content-center gap-4 mb-4">
            <div
              onClick={() => console.log('Vite clicked')}
              role="button"
              tabIndex={0}
              className="p-2 border rounded shadow-sm d-flex justify-content-center align-items-center"
            >
              <img
                src={viteLogo}
                className="logo img-fluid"
                alt="Vite logo"
                style={{ height: '6em', transition: 'filter 300ms' }}
              />
            </div>
            <div
              onClick={() => console.log('React clicked')}
              role="button"
              tabIndex={0}
              className="p-2 border rounded shadow-sm d-flex justify-content-center align-items-center"
            >
              <img
                src={reactLogo}
                className="logo img-fluid react"
                alt="React logo"
                style={{ height: '6em', transition: 'filter 300ms' }}
              />
            </div>
            <div
              onClick={() => console.log('Bootstrap clicked')}
              role="button"
              tabIndex={0}
              className="p-2 border rounded shadow-sm d-flex justify-content-center align-items-center"
            >
              <img
                src={bootstrapLogo}
                className="logo img-fluid react"
                alt="Bootstrap logo"
                style={{ height: '6em', transition: 'filter 300ms' }}
              />
            </div>
          </div>

          <h1 className="mb-3">Vite + React + Bootstrap</h1>

          <div className="card mx-auto" style={{ maxWidth: '400px' }}>
            <div className="card-body">
              <button className="btn btn-primary mb-3" onClick={this.handleClick}>
                Count is {this.state.count}
              </button>
              <p className="card-text">
                Edit <code>resource/src/App.tsx</code> and save to test HMR.
              </p>
            </div>
          </div>

          <p className="mt-4 text-muted">
            Click on the Vite and React logos to learn more.
          </p>
        </div>


      </>
    );
  }
}

export default App;
