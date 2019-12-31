
import * as React from 'react';
import uuid from 'uuid';
import cookies from 'js-cookie';

const COOKIE_ID = 'partyyy-ppl-id';

export default class App extends React.Component {

  constructor() {

    super();

    this.state = {
      config: null,
      serverConnected: false,
      serverMessages: [],
      name: ''
    };

    this.id = this.getCookieId();
    this.loadConfig(`config.json`);

  }

  onConfigLoad = (config) => {

    this.setState({ config });

  }
  onServerMsg = (message) => {

    const data = JSON.parse(message);

    switch (data.type) {

      case 'ppl':
        this.setState({
          name: data.name
        })
        break;

    }

  }

  getCookieId() {

    let val = cookies.get(COOKIE_ID);

    if (!val) {
      val = uuid.v4();
      cookies.set(COOKIE_ID, val);
    }

    return val;

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
      this.setState({ serverConnected: true });

      this.sendToServer({
        type: 'identify',
        group: 'ppl',
        id: this.id
      })

    }
    ws.onclose = () => {
      this.setState({ serverConnected: false });
    }
    ws.onerror = () => {
      this.setState({ serverConnected: false });
    }
    ws.onmessage = ({ data }) => this.onServerMsg(data);

    this.socket = ws;

  }

  sendToServer(data) {

    if (!this.socket) return;

    this.socket.send(JSON.stringify(data));

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

        {!this.state.serverConnected && (
          <button
            onClick={() => this.connectToServer(this.state.config.serverUrl)}>
            Connect to Server
          </button>
        )}

        {this.state.serverConnected && (
          <>
            <input
              type='text'
              value={this.state.name}
              onChange={(e) => {
                this.setState({
                  name: e.target.value
                })
              }} />
              <button
                onClick={() => {
                  this.sendToServer({
                    type: 'updatePpl',
                    ppl: {
                      name: this.state.name
                    }
                  })
                }}>
                Update Name
              </button>
          </>

        )}

      </main>
    );

  }

}
