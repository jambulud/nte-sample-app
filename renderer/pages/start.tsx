import { Component, Fragment } from 'react'
import { IpcRendererEvent } from 'electron';
import Spawned from '../components/Spawned';
import Renderer from '../services/renderer.service';
import Layout from '../components/Layout';

class HelloElectron extends Component {
  state = {
    input: '',
    mkdirMessage: null,
    lsMessage: null,
    pwdMessage: null,
  }

  renderer: Renderer;

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
  }

  componentDidMount() {
    // start listening the channel message
    this.renderer.on('terminal/mkdir', this.handleMkdir)
    this.renderer.on('terminal/ls', this.handleLs);
    this.renderer.on('terminal/pwd', this.handlePwd);
  }

  componentWillUnmount() {
    // stop listening channel messages
    this.renderer.removeAll();
  }

  handleMkdir = (_: IpcRendererEvent, message: string) => {
    // receive a message from the main process and save it in the local state
    this.setState({ mkdirMessage: message })
  }

  handleLs = (_: IpcRendererEvent, message: string) => {
    this.setState({ lsMessage: message })
  }

  handlePwd = (_: IpcRendererEvent, message: string) => {
    this.setState({ pwdMessage: message })
  }

  handleSendLs = () => {
    this.renderer.send('terminal/ls', this.state.input)
  }

  handleSendMkdir = () => {
    this.renderer.send('terminal/mkdir', this.state.input)
  }

  handleSendPwd = () => {
    this.renderer.send('terminal/pwd', this.state.input)
  }

  render() {
    return (
      <Layout>
        <h1>Hello Electron!</h1>
        <Spawned
          message={this.state.lsMessage}
          command="ls"
          handleInfo={this.handleSendLs}>
        </Spawned>
        <Spawned
          message={this.state.mkdirMessage}
          command="mkdir"
          handleInfo={this.handleSendMkdir}>
        </Spawned>
        <Spawned
          message={this.state.pwdMessage}
          command="pwd"
          handleInfo={this.handleSendPwd}>
        </Spawned>
      </Layout>
    );
  }
}

export default HelloElectron;