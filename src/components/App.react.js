
import * as React from 'react';

export default class App extends React.Component {

  constructor() {

    super();

    this.state = {
      config: null,
      serverConnected: false,
      serverMessages: []
    };

    this.loadConfig(`config.json`);

  }

  onConfigLoad = (config) => {

    this.setState({ config });

  }

  loadConfig(path) {

    fetch(path)
      .then((response) => response.json())
      .then((json) => this.onConfigLoad(json))
      .catch((error) => {
        console.log(error);
      })

  }

  connectToServer(url) {

    const ws = new WebSocket(url);

    ws.onopen = () => {
      this.setState({
        serverConnected: true
      })
    }
    ws.onclose = () => {
      this.setState({
        serverConnected: false
      })
    }
    ws.onerror = () => {
      this.setState({
        serverConnected: false
      })
    }
    ws.onmessage = ({ data }) => {
      this.setState({
        serverMessages: [
          ...this.state.serverMessages,
          data
        ]
      })
    }

    this.socket = ws;

  }

  sendMessageToServer() {

    if (!this.socket) return;

    this.socket.send('Hello from PARTYYY PPL')

  }

  render() {

    if (!this.state.config) return null;

    return (
      <main>

        {this.state.serverConnected && (

          <ul>
          {this.state.serverMessages.map((msg, i) => (
            <li key={`msg-${i}`}>{msg}</li>
          ))}
          </ul>
        )}
        {this.state.serverConnected && (
          <button
            onClick={() => this.sendMessageToServer() }>
            Send message
          </button>
        )}

        {!this.state.serverConnected && (
          <button
            onClick={() => this.connectToServer(this.state.config.serverUrl)}>
            Connect to Server
          </button>
        )}

      </main>
    );

  }

}
