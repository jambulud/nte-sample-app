import { Component, Fragment, ChangeEvent } from 'react'
import { IpcRendererEvent } from 'electron';
import Spawned from '../components/Spawned';
import DialogRes from '../components/DialogRes';
import Directory from '../components/Directory';
import Renderer from '../services/renderer.service';
import Layout from '../components/Layout';

class HelloElectron extends Component {
  state = {
    input: '',
    rmdirInput: null,
    mkdirMessage: null,
    rmdirMessage: null,
    lsMessage: null,
    pwdMessage: null,
    dialog: [],
  }

  renderer: Renderer;

  constructor(props: {}) {
    super(props);
    this.renderer = new Renderer();
  }

  handleSendLs = async () => {
    const message = await this.renderer.send('terminal/ls')
    this.setState({ lsMessage: message })
  }

  handleSendMkdir = async () => {
    const message = await this.renderer.send('terminal/mkdir', this.state.input)
    this.setState({ mkdirMessage: message })
  }

  handleSendPwd = async () => {
    const message = await this.renderer.send('terminal/pwd');
    this.setState({ pwdMessage: message })
  }

  handleSendRmdir = async () => {
    const message = await this.renderer.send('terminal/rmdir', this.state.rmdirInput)
    this.setState({ rmdirMessage: message })
  }

  handleSendOpenDialog = async () => {
    const message = await this.renderer.send('terminal/open-dialog')
    this.setState({ dialog: message['filePaths'] })
  }

  handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ input: event.target.value })
  }


  handleRmdirInput = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ rmdirInput: event.target.value })
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
          message={this.state.pwdMessage}
          command="pwd"
          handleInfo={this.handleSendPwd}>
        </Spawned>
        <DialogRes
          message={this.state.dialog}
          command="open dialog"
          handleInfo={this.handleSendOpenDialog}>
        </DialogRes>
        <Directory
          message={this.state.mkdirMessage}
          command="mkdir"
          handleInfo={this.handleSendMkdir}
          handleInput={this.handleInput}>
        </Directory>
        <Directory
          message={this.state.rmdirMessage}
          command="rmdir"
          handleInfo={this.handleSendRmdir}
          handleInput={this.handleRmdirInput}>
        </Directory>
      </Layout>
    );
  }
}

export default HelloElectron;